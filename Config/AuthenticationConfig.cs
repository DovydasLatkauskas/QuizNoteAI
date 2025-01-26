using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using WebApiTemplate;
using WebApiTemplate.Models;

public static class AuthenticationConfig {
    public static void AddAuthServices(WebApplicationBuilder builder) {
        NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();
        var databaseSettings = builder.Configuration.GetSection("DatabaseSettings").Get<DatabaseSettings>();
        builder.Services.AddDbContext<AppDbContext>(x =>
            x.UseNpgsql(databaseSettings.ConnectionString));

        builder.Services.AddAuthorizationBuilder()
            .AddPolicy("admin", policy =>
                policy.RequireRole("admin"));

        builder.Services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();
        //builder.Services.AddIdentity<User, IdentityRole>();
    }
}