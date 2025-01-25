using System.Text;
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

    // public async Task<string> GetUserGroupTree(User user) {
    //     var grps = await _context.Groups
    //         .Include(g => g.Subgroups).Include(g => g.ContentFiles)
    //         .Where(g => g.OwnerId == Guid.Parse(user.Id)).ToListAsync();
    //
    //     List<> outp = new();
    //
    //     foreach (var grp in grps) {
    //         outp.
    //     }
    // }

    public async Task<bool> SaveContentFile(ContentFile contentFile, string groupName) {
        var grp = await _context.Groups.Include(g => g.Subgroups)
            .FirstOrDefaultAsync(g => g.Name == groupName);
        if (grp is null) {
            return false;
        }

        grp.ContentFiles.Add(contentFile);
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
    // Task<string> GetUserGroupTree(User user);
}

public record UserGroupTreeDto(List<SingleGroupTreeDto> sgt);
public record SingleGroupTreeDto(string groupName, List<SubGroupDto> subGroups);
public record SubGroupDto(List<SubGroupDto> NestedSubGroups, List<ContentFilePropertiesDto> contentFileProperties);
public record ContentFilePropertiesDto();