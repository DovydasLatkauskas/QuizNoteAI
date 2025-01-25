using WebApiTemplate.Services;

namespace WebApiTemplate;

public static class ServerSetupExtensions {
    public static IHostApplicationBuilder AddServices(this IHostApplicationBuilder builder) {
        builder.Services.AddScoped<IUserService, UserService>();

        return builder;
    }
}