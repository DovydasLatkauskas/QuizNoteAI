using WebApiTemplate.Services;

namespace WebApiTemplate;

public static class ServerSetupExtensions {
    public static IHostApplicationBuilder AddServices(this IHostApplicationBuilder builder) {
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IContentService, ContentService>();
        builder.Services.AddScoped<ILLMService, LLMService>();

        return builder;
    }
}