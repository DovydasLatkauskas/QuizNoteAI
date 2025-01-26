using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace WebApiTemplate.Services;

public class LLMService : ILLMService {
    private readonly AppDbContext _context;
    private readonly string geminiUrl;

    public LLMService(AppDbContext context) {
        _context = context;
        geminiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";
    }

    public async Task<GeminiQuizResponseDto> PromptGeminiForQuiz(string prompt) {
        string rsp = await PromptGemini(prompt);

        using JsonDocument doc = JsonDocument.Parse(rsp);

        string rawText = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();



        string quizJson = Regex.Match(rawText, @"\{.*\}", RegexOptions.Singleline).Value;
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        var quizResponse = JsonSerializer.Deserialize<GeminiQuizResponseDto>(quizJson, options);

        return quizResponse;
    }

    public async Task<string> PromptGeminiSummary(string combinedPrompt) {
        var rsp = await PromptGemini(combinedPrompt);
        var jsonDocument = JsonDocument.Parse(rsp);
        var text = jsonDocument.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        var startIndex = text.IndexOf("{");
        var endIndex = text.LastIndexOf("}");
        var embeddedJson = text.Substring(startIndex, endIndex - startIndex + 1);

        var embeddedDocument = JsonDocument.Parse(embeddedJson);
        var summary = embeddedDocument.RootElement.GetProperty("summary").GetString();
        return summary ?? "";
    }

    public async Task<string> PromptGeminiParseNotes(string base64String, string imageContentType) {
        var prompt = $@"transcribe the text in the provided image into this JSON schema:
                        {{
                            ""transcribedText"" = ""<Please provide the transcribed text as a single string while preserving some structure here>""
                        }}
                        ";

        var rsp = await PromptGeminiImage(prompt, base64String, imageContentType);
        var jsonDocument = JsonDocument.Parse(rsp);
        var text = jsonDocument.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        var startIndex = text.IndexOf("{");
        var endIndex = text.LastIndexOf("}");
        var embeddedJson = text.Substring(startIndex, endIndex - startIndex + 1);

        var embeddedDocument = JsonDocument.Parse(embeddedJson);
        var parsedText = embeddedDocument.RootElement.GetProperty("transcribedText").GetString();
        return parsedText ?? "";
    }

    public async Task<string> PromptGemini(string prompt) {
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt}
                    }
                }
            }
        };

        string jsonBody = JsonSerializer.Serialize(requestBody);

        using var httpClient = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Post, geminiUrl)
        {
            Content = new StringContent(jsonBody, Encoding.UTF8,  "application/json")
        };

        HttpResponseMessage response = await httpClient.SendAsync(request);

        return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> PromptGeminiImage(string prompt, string base64String, string imageContentType) {
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new {
                            text = prompt
                        },
                        new
                        {
                            inline_data = new
                            {
                                mime_type = imageContentType,
                                data = base64String
                            }
                        }
                    }
                }
            }
        };

        string jsonBody = JsonSerializer.Serialize(requestBody);

        using var httpClient = new HttpClient();

        var request = new HttpRequestMessage(HttpMethod.Post, geminiUrl)
        {
            Content = new StringContent(jsonBody, Encoding.UTF8,  "application/json")
        };

        HttpResponseMessage response = await httpClient.SendAsync(request);

        return await response.Content.ReadAsStringAsync();
    }
}

public interface ILLMService {
    public Task<string> PromptGemini(string prompt);
    Task<GeminiQuizResponseDto> PromptGeminiForQuiz(string prompt);
    Task<string> PromptGeminiSummary(string combinedPrompt);
    Task<string> PromptGeminiParseNotes(string base64String, string imageContentType);
}

public record GeminiQuizResponseDto
{
    public QuizDto quiz { get; init; }

    public record QuizDto
    {
        public string title { get; init; }
        public string description { get; init; }
        public List<QuestionDto> questions { get; init; }
    }

    public record QuestionDto
    {
        public string question { get; init; }
        public List<string> answers { get; init; }
        public string correctAnswer { get; init; }
        public string source { get; init; }
    }
}
