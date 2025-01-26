using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text;
using AssemblyAI;
using AssemblyAI.Transcripts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using UglyToad.PdfPig;
using WebApiTemplate.Models;
using WebApiTemplate.Services;

namespace WebApiTemplate;

public static class ApiEndpoints {
    private static void QuizEndpoints(this WebApplication app) {
        app.MapGet("/user-quizzes", async (IContentService contentService, HttpContext httpContext, UserManager<User> userManager) => {
                var user = await userManager.GetUserAsync(httpContext.User);
                if (user is null) {
                    return Results.Unauthorized();
                }

                var quizzesResponse = await contentService.GetUserQuizzesDto(user.Id);

                return Results.Json(quizzesResponse);
        });

        app.MapGet("/GeminiQuiz", async (string groupId, string idsOfFilesString, int numberOfQuestions,
            string userPrompt,
            ILLMService llmService, IContentService contentService,
            HttpContext httpContext, UserManager<User> userManager) => {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            var idsOfFiles = idsOfFilesString.Split(",").ToList().Select(Guid.Parse).ToList();
            List<ContentFile> cfs = await contentService.GetContentFilesByIds(idsOfFiles, user.Id);

            string sourcesToAdd = "";
            foreach (var cf in cfs) {
                sourcesToAdd += $"name of source: {cf.Name} contents of source: {cf.Text} END\n";
            }

            string combinedPrompt = $@"Generate a {numberOfQuestions}-question multiple choice quiz based on the information provided in the attached file. Ensure the questions cover a range of key concepts, and include four answer choices for each question, with the correct answer clearly indicated. The questions should be clear and concise. Ensure that the answer choices are similar in content and structure and that it’s not immediately obvious which option is correct. Provide four plausible answer choices for each question, with only one correct answer. Label the answers a through d. Additonally, include the number coressponding to the source from where the information was taken.
                                    Please provide the following content strictly in a valid JSON format. The response should not include any extra non-JSON characters or code block formatting. The output should follow the structure below:
                                    {{
                                      ""quiz"": {{
                                        ""title"": ""<Please provide the title of the quiz fewer than 30 characters>"",
                                        ""description"": ""<Please provide a description for the quiz>"",
                            
                                        ""questions"": [
                                          {{
                                            ""question"": ""<Please provide the question>"",
                                            ""answers"": [
                                              ""<Option 1>"",
                                              ""<Option 2>"",
                                              ""<Option 3>"",
                                              ""<Option 4>""
                                            ],
                                            ""correctAnswer"": ""<Please provide the correct answer>"",
                                            ""source"": ""<Source of the question>""
                                          }}
                                        ]
                                      }}
                                    }}
                                    
                                    The end user has made this request: {userPrompt}

                                    Now here is the content to summarize: {sourcesToAdd}";


            // TODO: only for testing
            // string[] fileContent =
            // {
            //     "Whales are a widely distributed and diverse group of fully aquatic placental marine mammals. As an informal and colloquial grouping, they correspond to large members of the infraorder Cetacea, i.e. all cetaceans apart from dolphins and porpoises. Dolphins and porpoises may be considered whales from a formal, cladistic perspective. Whales, dolphins and porpoises belong to the order Cetartiodactyla, which consists of even-toed ungulates. Their closest non-cetacean living relatives are the hippopotamuses, from which they and other cetaceans diverged about 54 million years ago. The two parvorders of whales, baleen whales (Mysticeti) and toothed whales (Odontoceti), are thought to have had their last common ancestor around 34 million years ago. Mysticetes include four extant (living) families: Balaenopteridae (the rorquals), Balaenidae (right whales), Cetotheriidae (the pygmy right whale), and Eschrichtiidae (the grey whale). Odontocetes include the Monodontidae (belugas and narwhals), Physeteridae (the sperm whale), Kogiidae (the dwarf and pygmy sperm whale), and Ziphiidae (the beaked whales), as well as the six families of dolphins and porpoises which are not considered whales in the informal sense.",
            //     "Whales are fully aquatic, open-ocean animals: they can feed, mate, give birth, suckle and raise their young at sea. Whales range in size from the 2.6 metres (8.5 ft) and 135 kilograms (298 lb) dwarf sperm whale to the 29.9 metres (98 ft) and 190 tonnes (210 short tons) blue whale, which is the largest known animal that has ever lived. The sperm whale is the largest toothed predator on Earth. Several whale species exhibit sexual dimorphism, in that the females are larger than males. Baleen whales have no teeth; instead, they have plates of baleen, fringe-like structures that enable them to expel the huge mouthfuls of water they take in while retaining the krill and plankton they feed on. Because their heads are enormous—making up as much as 40% of their total body mass—and they have throat pleats that enable them to expand their mouths, they are able to take huge quantities of water into their mouth at a time. Baleen whales also have a well-developed sense of smell. Toothed whales, in contrast, have conical teeth adapted to catching fish or squid. They also have such keen hearing—whether above or below the surface of the water—that some can survive even if they are blind. Some species, such as sperm whales, are particularly well adapted for diving to great depths to catch squid and other favoured prey."
            // };
            //
            // int i = 0;
            // foreach (var x in fileContent) {
            //     cfs.Add(new ContentFile {
            //         Name = $"{i}",
            //         Text = x
            //     });
            //     i++;
            // }

            var responseBody = await llmService.PromptGeminiForQuiz(combinedPrompt);

            await contentService.SaveGeminiQuiz(responseBody, user.Id, groupId);

            return Results.Json(responseBody);
        });

        app.MapPost("/GeminiSummarize", async (string nameOfSummaryDoc, string groupId,
            string idsOfFilesString, string? userPrompt,
            IContentService contentService, ILLMService llmService,
            HttpContext httpContext, UserManager<User> userManager) => {

            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            var idsOfFiles = idsOfFilesString.Split(",").ToList().Select(Guid.Parse).ToList();
            List<ContentFile> cfs = await contentService.GetContentFilesByIds(idsOfFiles, user.Id);
            string txtToSum = "";
            foreach (var cf in cfs) {
                txtToSum += $"name of source: {cf.Name}, text in source: {cf.Text}";
            }

            string combinedPrompt = $@"Please summarize the information provided. Focus on the key points, important concepts, and any notable details which might be necessary to study the material. Keep the summary concise, clear, and to the point. Provide the answer .\n\n +
                                    Please summarize the following content strictly in a valid JSON format. The response should not include any extra non-JSON characters or code block formatting. The output should follow the structure below:
                                    {{
                                        ""summary"": ""<Please provide a summary of the document(s).>""
                                    }}
                                    The user has also made this request: {userPrompt}
                                    Now here is the content to summarize: {txtToSum}";

            string summaryText = await llmService.PromptGeminiSummary(combinedPrompt);

            var summaryCf = new ContentFile {
                Name = nameOfSummaryDoc,
                GroupId = Guid.Parse(groupId),
                UploadedAtUtc = DateTime.UtcNow,
                Text = summaryText
            };

            await contentService.SaveContentFile(summaryCf, null, groupId, null, user.Id);

            return Results.Json(summaryCf);
        });
    }

    private static void ContentEndpoints(this WebApplication app) {
        app.MapPost("/create-group", async (string groupName, string groupColour,
            IContentService contentService, HttpContext httpContext, UserManager<User> userManager) =>
        {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            bool rsp = await contentService.CreateGroup(user.Id, groupName, groupColour);
            if (!rsp) {
                return Results.Conflict("group already exists");
            }

            return Results.Ok();
        });

        app.MapDelete("/delete-group", async (string groupName,
            IContentService contentService, HttpContext httpContext, UserManager<User> userManager) =>
        {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            await contentService.DeleteGroup(user.Id, groupName);

            return Results.Ok();
        });

        app.MapDelete("/rename-group", async (string oldGroupName, string newGroupName,
            IContentService contentService, HttpContext httpContext, UserManager<User> userManager) =>
        {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            bool rsp = await contentService.UpdateGroupName(user.Id, oldGroupName, newGroupName);
            if (!rsp) {
                return Results.Conflict("could not complete operation");
            }

            return Results.Ok();
        });

        app.MapPost("/insert-file", [IgnoreAntiforgeryToken] async (
            string fileName, string groupName, string? subGroupName, IFormFile file,
            IContentService contentService, ILLMService llmService,
            HttpContext httpContext, UserManager<User> userManager) =>
        {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            if(!contentService.CheckGroupExists(groupName, user.Id)) {
                return Results.NotFound("group not found by name");
            }

            if (subGroupName == "") {
                subGroupName = null;
            }

            // save file to temp storage
            string tempPath = $"{Path.GetTempPath()}{file.FileName}{Guid.NewGuid()}";
            await using (var stream = File.Create(tempPath))
            {
                await file.CopyToAsync(stream);
            }

            // get transcription
            var ct = file.ContentType;
            var text = "";
            if (ct.StartsWith("audio/") || ct.StartsWith("video/")) {
                var transcript = await GetTranscription(tempPath);
                text = transcript.Text ?? "";
            }
            else if (ct == "text/plain") {
                using var reader = new StreamReader(file.OpenReadStream());
                text = await reader.ReadToEndAsync();
            }
            else if (ct is "image/png" or "image/jpeg" or "image/webp" or "image/heic" or "image/heif") {
                byte[] imageBytes = await File.ReadAllBytesAsync(tempPath);
                string base64String = Convert.ToBase64String(imageBytes);

                text = await llmService.PromptGeminiParseNotes(base64String, ct);
            }
            else if (file.ContentType == "application/pdf") {
                StringBuilder sb = new();
                using (PdfDocument doc = PdfDocument.Open(tempPath)) {
                    foreach (var page in doc.GetPages()) {
                        var words = page.GetWords();
                        sb.Append(string.Join(' ', words));
                        sb.Append(' ');
                    }
                }

                text = sb.ToString();
            }
            else {
                return Results.BadRequest("Not implemented: other filetype support.");
            }

            File.Delete(tempPath);

            // save transcription to group
            var contentFile = new ContentFile {
                Id = Guid.NewGuid(),
                Name = fileName,
                UploadedAtUtc = DateTime.UtcNow,
                Text = text
            };

            var scfResp = await contentService.SaveContentFile(contentFile, groupName, null, subGroupName, user.Id);
            if (!scfResp) {
                return Results.NotFound("group not found by name");
            }

            return Results.Ok(new { Id = contentFile.Id });
        }).DisableAntiforgery();

        app.MapGet("/show-groups", async (HttpContext httpContext, UserManager<User> userManager,
            IContentService contentService) => {
            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            var groupTree = await contentService.GetUserGroupTree(user.Id);
            return Results.Json(groupTree);
        });
    }

    private static void TestEndpoints(this WebApplication app) {
        app.MapGet("/getUserDetails", async (HttpContext httpContext, UserManager<User> userManager,
            IUserService userService) => {

            var user = await userManager.GetUserAsync(httpContext.User);
            if (user is null) {
                return Results.Unauthorized();
            }

            var userDetails = await userService.GetUserDetails(user.Id);
            if (userDetails is null) {
                return Results.Unauthorized();
            }
            return Results.Json(userDetails);
        });

        app.MapGet("/createTestUser", async (IUserService userService) => {
            var user = await userService.CreateTestUser();
            return Results.Text($"created user with name: {user.FirstName} {user.LastName}");
        });
    }

    public static void AddApiEndpoints(this WebApplication app) {
        app.ContentEndpoints();

        app.TestEndpoints();

        app.QuizEndpoints();

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
        var client = new AssemblyAIClient($"{Environment.GetEnvironmentVariable("ASSEMBLY_API_KEY")}");
        var fi = new FileInfo(tempServerFilePath);
        // call transcript api

        var transcript = await client.Transcripts.TranscribeAsync(
            new FileInfo($"{fi}"),
            new TranscriptOptionalParams
            {
                SpeakerLabels = true
            }
        );

        if (transcript.Status == TranscriptStatus.Error)
        {
            Console.WriteLine($"Transcription failed {transcript.Error}");
            Environment.Exit(1);
        }

        return transcript;

        // foreach (var utterance in transcript.Utterances!)
        // {
        //     Console.WriteLine($"Speaker {utterance.Speaker}: {utterance.Text}");
        // }
    }
}

public record RegisterRequestDto(string Email, string Password, string FirstName, string LastName);