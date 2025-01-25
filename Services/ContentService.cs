using Microsoft.EntityFrameworkCore;
using WebApiTemplate.Models;

namespace WebApiTemplate.Services;

public class ContentService : IContentService {
    private readonly AppDbContext _context;

    public ContentService(AppDbContext context) {
        _context = context;
    }

    public async Task<bool> CheckGroupExists(string groupName) {
        var grp = await _context.Groups.Include(g => g.Subgroups)
            .FirstOrDefaultAsync(g => g.Name == groupName);

        return grp is not null;
    }

    public async Task<bool> SaveContentFile(ContentFile contentFile, string groupName) {
        var grp = await _context.Groups.Include(g => g.Subgroups)
            .FirstOrDefaultAsync(g => g.Name == groupName);
        if (grp is null) {
            return false;
        }

        grp.DataFiles.Add(contentFile);
        if (!grp.Subgroups.Contains(contentFile.SubgroupPath)) {
            grp.Subgroups.Add(contentFile.SubgroupPath);
        }

        await _context.SaveChangesAsync();
        return true;
    }
}

public interface IContentService {
    public Task<bool> SaveContentFile(ContentFile contentFile, string group);
    public Task<bool> CheckGroupExists(string groupName);
}