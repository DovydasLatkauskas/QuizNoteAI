namespace WebApiTemplate.Models; 

public class Group {
    public string Name { get; set; }
    public List<string> Subgroups { get; set; }
    public List<ContentFile> DataFiles { get; set; }
}

public class ContentFile {
    public string Name { get; set; }
    public string Text { get; set; }
    public string? Summary { get; set; }

    public DateTime UploadedAtUtc { get; set; }
    public string SubgroupPath { get; set; }
}