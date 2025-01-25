using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text;
using AssemblyAI;
using AssemblyAI.Transcripts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApiTemplate.Models;
using WebApiTemplate.Services;

namespace WebApiTemplate;

public static class ApiEndpoints {
    private static readonly EmailAddressAttribute _emailAddressAttribute = new();

    private static ValidationProblem CreateValidationProblem(IdentityResult result)
    {
        // We expect a single error code and description in the normal case.
        // This could be golfed with GroupBy and ToDictionary, but perf! :P
        Debug.Assert(!result.Succeeded);
        var errorDictionary = new Dictionary<string, string[]>(1);

        foreach (var error in result.Errors)
        {
            string[] newDescriptions;

            if (errorDictionary.TryGetValue(error.Code, out var descriptions))
            {
                newDescriptions = new string[descriptions.Length + 1];
                Array.Copy(descriptions, newDescriptions, descriptions.Length);
                newDescriptions[descriptions.Length] = error.Description;
            }
            else
            {
                newDescriptions = new string[] {error.Description};
            }

            errorDictionary[error.Code] = newDescriptions;
        }

        return TypedResults.ValidationProblem(errorDictionary);
    }

    private static async Task<Transcript> GetTranscription(string tempServerFilePath) {
        var fi = new FileInfo(tempServerFilePath);
        // call transcript api

        throw new NotImplementedException();
    }

    private static void ContentEndpoints(this WebApplication app) {
        // file_path = group/nesteddir/nesteddir2/nesteddir3/etc...
        app.MapPost("/insert-file", async (
            string file_name, string file_path, string file_type, IFormFile file,
            IContentService contentService) =>
        {
            string groupName = file_path.Split("/").First();
            int index = file_path.IndexOf("/");
            string subPath = "";
            if (index > 0) {
                subPath = file_path.Substring(index + 1);
            }

            if(! await contentService.CheckGroupExists(groupName)) {
                return Results.NotFound("group not found by name");
            }

            // save file to temp storage
            string tempPath = Path.GetTempPath();
            using (var stream = File.Create(tempPath))
            {
                await file.CopyToAsync(stream);
            }

            // get transcription
            var transcript = await GetTranscription(tempPath);

            // save transcription to group
            var contentFile = new ContentFile {
                Id = Guid.NewGuid(),
                Name = file_name,
                SubgroupPath = subPath,
                UploadedAtUtc = DateTime.UtcNow,
                Text = transcript.Text ?? "",
                Summary = null
            };

            var scfResp = await contentService.SaveContentFile(contentFile, groupName);
            if (!scfResp) {
                return Results.NotFound("group not found by name");
            }

            return Results.Ok();
        });

        // app.MapGet("/show-groups", async (HttpContext httpContext, UserManager<User> userManager,
        //     IContentService contentService) => {
        //     var user = await userManager.GetUserAsync(httpContext.User);
        //     if (user is null) {
        //         return Results.Unauthorized();
        //     }
        //
        //     string groupTree = await contentService.GetUserGroupTree(user);
        // });
    }

    private static void TestEndpoints(this WebApplication app) {
        app.MapGet("/", () => {
            return "hello world!";
        });

        app.MapGet("/createTestUser", async (IUserService userService) => {
            var user = await userService.CreateTestUser();
            return Results.Text($"created user with name: {user.FirstName} {user.LastName}");
        });

        app.MapGet("/GeminiJoke", async () => {
            string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = "Write a story about a magic backpack." }
                        }
                    }
                }
            };

            string jsonBody = System.Text.Json.JsonSerializer.Serialize(requestBody);

            using var httpClient = new HttpClient();

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(jsonBody, Encoding.UTF8,  "application/json")
            };

            HttpResponseMessage response = await httpClient.SendAsync(request);

            string responseBody = await response.Content.ReadAsStringAsync();

            return Results.Text(responseBody);
        });
    }

    public static void AddApiEndpoints(this WebApplication app) {
        app.ContentEndpoints();

        app.TestEndpoints();

        app.MapPost("/register-v2", async Task<Results<Ok, ValidationProblem>>
            ([FromBody] RegisterRequestDto registration, HttpContext context, [FromServices] IServiceProvider sp) =>
        {
            var userManager = sp.GetRequiredService<UserManager<User>>();

            if (!userManager.SupportsUserEmail)
            {
                throw new NotSupportedException($"{nameof(AddApiEndpoints)} requires a user store with email support.");
            }

            var userStore = sp.GetRequiredService<IUserStore<User>>();
            var emailStore = (IUserEmailStore<User>)userStore;
            var email = registration.Email;

            if (string.IsNullOrEmpty(email) || !_emailAddressAttribute.IsValid(email))
            {
                return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(email)));
            }

            var user = new User();
            await userStore.SetUserNameAsync(user, email, CancellationToken.None);
            await emailStore.SetEmailAsync(user, email, CancellationToken.None);
            user.FirstName = registration.FirstName;
            user.LastName = registration.LastName;
            var result = await userManager.CreateAsync(user, registration.Password);

            if (!result.Succeeded)
            {
                return CreateValidationProblem(result);
            }

            //await SendConfirmationEmailAsync(user, userManager, context, email);
            return TypedResults.Ok();
        });
    }
}

public record RegisterRequestDto(string Email, string Password, string FirstName, string LastName);