using System.Text;

namespace WebApiTemplate.Services;

public class LLMService : ILLMService {
    private readonly AppDbContext _context;
    private readonly string geminiUrl;

    public LLMService(AppDbContext context) {
        _context = context;
        geminiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";
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
}