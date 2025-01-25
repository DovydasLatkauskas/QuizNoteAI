using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApiTemplate.Models;

namespace WebApiTemplate.Services;

public class UserService : IUserService {
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;

    public UserService(AppDbContext context, UserManager<User> userManager) {
        _context = context;
        _userManager = userManager;
    }

    public async Task<User> CreateTestUser() {
        Random random = new Random();
        var randNum = random.Next();
        var user = new User {
            FirstName = "Peter",
            LastName = $"{randNum}",
            Email = $"admin{randNum}@admin.com",
            UserName = $"admin{randNum}@admin.com"
        };
        var pass = "Test1234!";
        await _userManager.CreateAsync(user, pass);
        return user;
    }

    public async Task<UserDetailsDto?> GetUserDetails(string userId) {
        return await _context.Users.Where(u => u.Id == userId)
            .Select(u=> new UserDetailsDto(u.Email ?? "", u.FirstName ?? "", u.LastName ?? ""))
            .FirstOrDefaultAsync();
    }
}

public interface IUserService {
    public Task<User> CreateTestUser();
    Task<UserDetailsDto?> GetUserDetails(string userId);
}

public record UserDetailsDto(string email, string firstName, string lastName);