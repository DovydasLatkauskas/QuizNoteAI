using System.Text;
using Microsoft.EntityFrameworkCore;
using WebApiTemplate.Models;

namespace WebApiTemplate.Services;

public class ContentService : IContentService {
    private readonly AppDbContext _context;

    public ContentService(AppDbContext context) {
        _context = context;
    }

    public async Task<bool> CheckGroupExists(string groupName, string userId) {
        var grp = await _context.Groups.Where(g => g.OwnerId == Guid.Parse(userId))
            .FirstOrDefaultAsync(g => g.Name == groupName);

        return grp is not null;
    }

    public async Task<bool> SaveContentFile(ContentFile contentFile, string groupName, string subGroupName, string userId) {
        var usr = await _context.Users.Include(u=> u.Groups)
            .ThenInclude(g => g.Subgroups)
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (usr is null) {
            return false;
        }

        var grp = usr.Groups.FirstOrDefault(g => g.Name == groupName);
        if (grp is null) {
            return false;
        }

        if (subGroupName == "") {
            grp.ContentFiles.Add(contentFile);
        }
        else {
            var subg = grp.Subgroups.FirstOrDefault(sg=> sg.Name == subGroupName);
            if (subg is null) {
                var sg = new Subgroup();
                sg.ContentFiles.Add(contentFile);
                grp.Subgroups.Add(sg);
            }
            else {
                subg.ContentFiles.Add(contentFile);
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<UserTreeDto> GetUserGroupTree(User user) {
        var grps = await _context.Groups
            .Include(g => g.Subgroups).Include(g => g.ContentFiles)
            .Where(g => g.OwnerId == Guid.Parse(user.Id)).ToListAsync();

        var outp = new UserTreeDto(new List<GroupTreeDto>());
        foreach (var grp in grps) {
            var gt = new GroupTreeDto(grp.Name, new List<SubGroupDto>(), new List<ContentFilePropsDto>());

            foreach (var sg in grp.Subgroups) {
                var sgDto = new SubGroupDto(new List<ContentFilePropsDto>());

                foreach (var cf in sg.ContentFiles) {
                    sgDto.contentFileProperties.Add(new ContentFilePropsDto(cf.Name, cf.UploadedAtUtc));
                }
                gt.subGroups.Add(sgDto);
            }

            foreach (var cf in grp.ContentFiles) {
                gt.contentFileProperties.Add(new ContentFilePropsDto(cf.Name, cf.UploadedAtUtc));
            }
            outp.gt.Add(gt);
        }

        return outp;
    }
}

public interface IContentService {
    public Task<bool> SaveContentFile(ContentFile contentFile, string groupName, string subGroupName, string userId);
    public Task<bool> CheckGroupExists(string groupName, string userId);
    Task<UserTreeDto> GetUserGroupTree(User user);
}

public record UserTreeDto(List<GroupTreeDto> gt);
public record GroupTreeDto(string groupName, List<SubGroupDto> subGroups, List<ContentFilePropsDto> contentFileProperties);
public record SubGroupDto(List<ContentFilePropsDto> contentFileProperties);
public record ContentFilePropsDto(string name, DateTime uploadedAt);