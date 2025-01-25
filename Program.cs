using Microsoft.EntityFrameworkCore;
using WebApiTemplate;
using WebApiTemplate.Models;
using dotenv.net;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();

builder.Services.AddCors(co =>
{
    co.AddDefaultPolicy(pb =>
    {
        pb.WithOrigins("http://localhost:3000") // Specify the allowed frontend origin
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Explicitly allow credentials
    });
});

builder.AddServices();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettings"));

AuthenticationConfig.AddAuthServices(builder);

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.AddApiEndpoints();

app.MapIdentityApi<User>();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();