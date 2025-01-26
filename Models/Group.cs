using System.Text.Json.Serialization;

namespace WebApiTemplate.Models;

public class Group {
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Colour { get; set; }
    public List<Subgroup> Subgroups { get; set; }
    public List<ContentFile> ContentFiles { get; set; }
    public List<Quiz> Quizzes { get; set; }

    // foreign key and nav property
    public string UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; }
}

public class Subgroup {
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; }
    public List<ContentFile> ContentFiles { get; set; }

    //fkey and nav props
    public Guid GroupId { get; set; }
    [JsonIgnore]
    public Group Group { get; set; }
}

public class ContentFile {
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Text { get; set; }

    public DateTime UploadedAtUtc { get; set; }

    // fkey and nav properties
    public Guid GroupId { get; set; }
    public Guid? SubgroupId { get; set; }
    [JsonIgnore]
    public Group Group { get; set; }
    [JsonIgnore]
    public Subgroup? Subgroup { get; set; }
}