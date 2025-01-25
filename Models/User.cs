using Microsoft.AspNetCore.Identity;

namespace WebApiTemplate.Models;

public class User : IdentityUser {

    public DateTime CreatedOn { get; init; } = DateTime.UtcNow;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public List<Group> Groups { get; set; }
}