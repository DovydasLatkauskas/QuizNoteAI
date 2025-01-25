using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
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

    public static void AddApiEndpoints(this WebApplication app) {
        app.MapGet("/", () => {
            return "hello world!";
        });

        app.MapGet("/createTestUser", async (IUserService userService) => {
            var user = await userService.CreateTestUser();
            return Results.Text($"created user with name: {user.FirstName} {user.LastName}");
        });

        app.MapGet("/GeminiQuiz", async () => {
            string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";
            string fileContent = "Whales are a widely distributed and diverse group of fully aquatic placental marine mammals. As an informal and colloquial grouping, they correspond to large members of the infraorder Cetacea, i.e. all cetaceans apart from dolphins and porpoises. Dolphins and porpoises may be considered whales from a formal, cladistic perspective. Whales, dolphins and porpoises belong to the order Cetartiodactyla, which consists of even-toed ungulates. Their closest non-cetacean living relatives are the hippopotamuses, from which they and other cetaceans diverged about 54 million years ago. The two parvorders of whales, baleen whales (Mysticeti) and toothed whales (Odontoceti), are thought to have had their last common ancestor around 34 million years ago. Mysticetes include four extant (living) families: Balaenopteridae (the rorquals), Balaenidae (right whales), Cetotheriidae (the pygmy right whale), and Eschrichtiidae (the grey whale). Odontocetes include the Monodontidae (belugas and narwhals), Physeteridae (the sperm whale), Kogiidae (the dwarf and pygmy sperm whale), and Ziphiidae (the beaked whales), as well as the six families of dolphins and porpoises which are not considered whales in the informal sense.\n\nWhales are fully aquatic, open-ocean animals: they can feed, mate, give birth, suckle and raise their young at sea. Whales range in size from the 2.6 metres (8.5 ft) and 135 kilograms (298 lb) dwarf sperm whale to the 29.9 metres (98 ft) and 190 tonnes (210 short tons) blue whale, which is the largest known animal that has ever lived. The sperm whale is the largest toothed predator on Earth. Several whale species exhibit sexual dimorphism, in that the females are larger than males.\n\nBaleen whales have no teeth; instead, they have plates of baleen, fringe-like structures that enable them to expel the huge mouthfuls of water they take in while retaining the krill and plankton they feed on. Because their heads are enormous—making up as much as 40% of their total body mass—and they have throat pleats that enable them to expand their mouths, they are able to take huge quantities of water into their mouth at a time. Baleen whales also have a well-developed sense of smell.\n\nToothed whales, in contrast, have conical teeth adapted to catching fish or squid. They also have such keen hearing—whether above or below the surface of the water—that some can survive even if they are blind. Some species, such as sperm whales, are particularly well adapted for diving to great depths to catch squid and other favoured prey.\n\nWhales evolved from land-living mammals, and must regularly surface to breathe air, although they can remain underwater for long periods of time. Some species, such as the sperm whale, can stay underwater for up to 90 minutes.[2] They have blowholes (modified nostrils) located on top of their heads, through which air is taken in and expelled. They are warm-blooded, and have a layer of fat, or blubber, under the skin. With streamlined fusiform bodies and two limbs that are modified into flippers, whales can travel at speeds of up to 20 knots, though they are not as flexible or agile as seals. Whales produce a great variety of vocalizations, notably the extended songs of the humpback whale. Although whales are widespread, most species prefer the colder waters of the Northern and Southern Hemispheres and migrate to the equator to give birth. Species such as humpbacks and blue whales are capable of travelling thousands of miles without feeding. Males typically mate with multiple females every year, but females only mate every two to three years. Calves are typically born in the spring and summer; females bear all the responsibility for raising them. Mothers in some species fast and nurse their young for one to two years.";
            string userPrompt = "I want to specificially memorize the types of whales in the file.";
            string combinedPrompt = $"Generate a 5-question multiple choice quiz based on the information provided in the attached file. Ensure the questions cover a range of key concepts, and include four answer choices for each question, with the correct answer clearly indicated. The questions should be clear and concise.\n. \n\n{fileContent} \n\n{userPrompt}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = combinedPrompt}
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
        
        app.MapGet("/GeminiSummarize", async () => {
            string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={Environment.GetEnvironmentVariable("GEMINI_API_KEY")}";
            string fileContent = "Whales are a widely distributed and diverse group of fully aquatic placental marine mammals. As an informal and colloquial grouping, they correspond to large members of the infraorder Cetacea, i.e. all cetaceans apart from dolphins and porpoises. Dolphins and porpoises may be considered whales from a formal, cladistic perspective. Whales, dolphins and porpoises belong to the order Cetartiodactyla, which consists of even-toed ungulates. Their closest non-cetacean living relatives are the hippopotamuses, from which they and other cetaceans diverged about 54 million years ago. The two parvorders of whales, baleen whales (Mysticeti) and toothed whales (Odontoceti), are thought to have had their last common ancestor around 34 million years ago. Mysticetes include four extant (living) families: Balaenopteridae (the rorquals), Balaenidae (right whales), Cetotheriidae (the pygmy right whale), and Eschrichtiidae (the grey whale). Odontocetes include the Monodontidae (belugas and narwhals), Physeteridae (the sperm whale), Kogiidae (the dwarf and pygmy sperm whale), and Ziphiidae (the beaked whales), as well as the six families of dolphins and porpoises which are not considered whales in the informal sense.\n\nWhales are fully aquatic, open-ocean animals: they can feed, mate, give birth, suckle and raise their young at sea. Whales range in size from the 2.6 metres (8.5 ft) and 135 kilograms (298 lb) dwarf sperm whale to the 29.9 metres (98 ft) and 190 tonnes (210 short tons) blue whale, which is the largest known animal that has ever lived. The sperm whale is the largest toothed predator on Earth. Several whale species exhibit sexual dimorphism, in that the females are larger than males.\n\nBaleen whales have no teeth; instead, they have plates of baleen, fringe-like structures that enable them to expel the huge mouthfuls of water they take in while retaining the krill and plankton they feed on. Because their heads are enormous—making up as much as 40% of their total body mass—and they have throat pleats that enable them to expand their mouths, they are able to take huge quantities of water into their mouth at a time. Baleen whales also have a well-developed sense of smell.\n\nToothed whales, in contrast, have conical teeth adapted to catching fish or squid. They also have such keen hearing—whether above or below the surface of the water—that some can survive even if they are blind. Some species, such as sperm whales, are particularly well adapted for diving to great depths to catch squid and other favoured prey.\n\nWhales evolved from land-living mammals, and must regularly surface to breathe air, although they can remain underwater for long periods of time. Some species, such as the sperm whale, can stay underwater for up to 90 minutes.[2] They have blowholes (modified nostrils) located on top of their heads, through which air is taken in and expelled. They are warm-blooded, and have a layer of fat, or blubber, under the skin. With streamlined fusiform bodies and two limbs that are modified into flippers, whales can travel at speeds of up to 20 knots, though they are not as flexible or agile as seals. Whales produce a great variety of vocalizations, notably the extended songs of the humpback whale. Although whales are widespread, most species prefer the colder waters of the Northern and Southern Hemispheres and migrate to the equator to give birth. Species such as humpbacks and blue whales are capable of travelling thousands of miles without feeding. Males typically mate with multiple females every year, but females only mate every two to three years. Calves are typically born in the spring and summer; females bear all the responsibility for raising them. Mothers in some species fast and nurse their young for one to two years.";
            string combinedPrompt = $"Please summarize the information provided in the attached file. Focus on the key points, important concepts, and any notable details which might be necessary to study the material. Keep the summary concise, clear, and to the point.\n.\n. \n\n{fileContent}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = combinedPrompt}
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