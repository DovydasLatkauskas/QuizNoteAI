using System.Text.Json.Serialization;

namespace WebApiTemplate.Models;

public class Quiz
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; }
    public string Description { get; set; }
    public int ImageNumber { get; set; } = new Random().Next(0, 5);
    public List<string> Sources { get; set; }
    public List<Question> Questions { get; set; }

    // nav and fk props
    public Guid GroupId { get; set; }
    [JsonIgnore]
    public Group Group { get; set; }
}

public class Question
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string QuestionText { get; set; }
    public List<string> Answers { get; set; }
    public string CorrectAnswer { get; set; }
    public string Source { get; set; }
}