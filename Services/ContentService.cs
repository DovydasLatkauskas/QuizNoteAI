using System.Text;
using Microsoft.EntityFrameworkCore;
using WebApiTemplate.Models;

namespace WebApiTemplate.Services;

public class ContentService : IContentService {
    private readonly AppDbContext _context;

    public ContentService(AppDbContext context) {
        _context = context;
    }

    public bool CheckGroupExists(string groupName, string userId) {
        var grp = _context.Users.Include(u=> u.Groups)
            .First(u=> u.Id == userId)
            .Groups.FirstOrDefault(g => g.Name == groupName);

        return grp is not null;
    }

    public async Task<bool> SaveContentFile(ContentFile contentFile, string? groupName, string? groupId, string? subGroupName, string userId) {
        if (groupName is null) {
            groupName = (await _context.Groups.FindAsync(Guid.Parse(groupId!)))!.Name;
        }

        var grp = _context.Groups.Include(g=> g.ContentFiles)
            .Include(g=> g.Subgroups).ThenInclude(sg => sg.ContentFiles)
            .FirstOrDefault(g => g.UserId == userId && g.Name == groupName);
        if (grp is null) {
            return false;
        }

        contentFile.GroupId = grp.Id;
        if (subGroupName is null) {
            _context.ContentFiles.Add(contentFile);
        }
        else {
            var subg = grp.Subgroups.FirstOrDefault(sg=> sg.Name == subGroupName);
            if (subg is null) {
                subg = new Subgroup {
                    Name = subGroupName,
                    ContentFiles = new List<ContentFile>{contentFile},
                    GroupId = grp.Id
                };
                _context.Subgroups.Add(subg);
            }
            else {
                _context.ContentFiles.Add(contentFile);
            }
            contentFile.SubgroupId = subg.Id;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<UserTreeDto> GetUserGroupTree(string userId) {
        var grps = _context.Groups.Include(g=> g.ContentFiles)
            .Where(g => g.UserId == userId);

        var outp = new UserTreeDto(new List<GroupTreeDto>());
        foreach (var grp in grps) {
            var gt = new GroupTreeDto(grp.Name, grp.Id.ToString(), grp.Colour, new List<ContentFile>());

            gt.contentFiles.AddRange(grp.ContentFiles);
            outp.gt.Add(gt);
        }

        return outp;
    }

    public async Task<bool> CreateGroup(string userId, string groupName, string groupColour) {
        var grps = _context.Groups.Include(g=> g.User)
            .Where(g => g.UserId == userId).ToList();
        if (grps.Any(g=> g.Name == groupName)) {
            return false;
        }

        _context.Groups.Add(new Group {
            Name = groupName,
            Colour = groupColour,
            UserId = userId
        });

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task DeleteGroup(string userId, string groupName)
    {
        var usr = await _context.Users
            .Include(u => u.Groups)
            .FirstAsync(u => u.Id == userId);

        var group = usr.Groups.FirstOrDefault(g => g.Name == groupName);
        if (group == null) {
            return;
        }

        usr.Groups.Remove(group);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UpdateGroupName(string userId, string oldGroupName, string newGroupName)
    {
        var usr = await _context.Users
            .Include(u => u.Groups)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (usr == null)
        {
            return false;
        }

        var group = usr.Groups.FirstOrDefault(g => g.Name == oldGroupName);
        if (group == null)
        {
            return false;
        }

        if (usr.Groups.Any(g => g.Name == newGroupName))
        {
            return false;
        }

        group.Name = newGroupName;
        await _context.SaveChangesAsync();
        return true;
    }



    public async Task<UserQuizzesDto> GetUserQuizzesDto(string userId) {
        var qzs = await _context.Groups
            .Include(g=> g.Quizzes).ThenInclude(q => q.Questions)
            .Where(g => g.UserId == userId)
            .Select(g=> new GroupQuizzesDto(g.Name, g.Quizzes)).ToListAsync();

        return new UserQuizzesDto(qzs);
    }

    public async Task<bool> SaveGeminiQuiz(GeminiQuizResponseDto responseBody, string userId, string groupId) {
        var quizDto = responseBody.quiz;

        var quiz = new Quiz
        {
            Title = quizDto.title,
            Description = quizDto.description,
            Questions = quizDto.questions.Select(q => new Question
            {
                QuestionText = q.question,
                Answers = q.answers,
                CorrectAnswer = q.correctAnswer,
                Source = q.source
            }).ToList(),
            Sources = quizDto.questions.Select(q => q.source).Distinct().ToList(),
            GroupId = Guid.Parse(groupId)
        };

        try
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }

    public async Task<List<ContentFile>> GetContentFilesByIds(List<Guid> idsOfFiles, string userId) {
        return await _context.ContentFiles.Include(cf => cf.Group)
            .ThenInclude(g => g.User)
            .Where(cf => idsOfFiles.Contains(cf.Id)).ToListAsync();
    }
}

public interface IContentService {
    public Task<bool> SaveContentFile(ContentFile contentFile, string? groupName, string? groupId, string? subGroupName, string userId);
    public bool CheckGroupExists(string groupName, string userId);
    Task<UserTreeDto> GetUserGroupTree(string userId);
    Task<bool> CreateGroup(string userId, string groupName, string groupColour);
    Task DeleteGroup(string userId, string groupName);
    Task<bool> UpdateGroupName(string userId, string oldGroupName, string newGroupName);
    Task<UserQuizzesDto> GetUserQuizzesDto(string userId);
    Task<bool> SaveGeminiQuiz(GeminiQuizResponseDto responseBody, string userId, string groupId);
    Task<List<ContentFile>> GetContentFilesByIds(List<Guid> idsOfFiles, string userId);
}

public record UserTreeDto(List<GroupTreeDto> gt);
public record GroupTreeDto(string groupName, string groupId, string groupColour, List<ContentFile> contentFiles);

public record UserQuizzesDto(List<GroupQuizzesDto> GroupQuizzesDtos);
public record GroupQuizzesDto(string groupName, List<Quiz> quizzes);