using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace WebApiTemplate.Services;

public class LLMService : ILLMService {
    private readonly AppDbContext _context;
    private readonly string geminiUrl;

    public LLMService(AppDbContext context) {
        _context = context;
        geminiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";
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
        return "";
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

        string jsonBody = System.Text.Json.JsonSerializer.Serialize(requestBody);

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
