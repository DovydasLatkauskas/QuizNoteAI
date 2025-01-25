namespace WebApiTemplate.Models; 

public class Group {
    public Guid OwnerId { get; set; }
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<Subgroup> Subgroups { get; set; }
    public List<ContentFile> ContentFiles { get; set; }
}

public class Subgroup {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<ContentFile> ContentFiles { get; set; }
}

public class ContentFile {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Text { get; set; }

    public DateTime UploadedAtUtc { get; set; }
}