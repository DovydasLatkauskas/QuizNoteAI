namespace WebApiTemplate.Models;

public class Quiz
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int ImageNumber { get; set; }
    public List<string> Sources { get; set; }
    public List<Question> Questions { get; set; }
}

public class Question
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; }
    public List<string> Answers { get; set; }
    public string CorrectAnswer { get; set; }
    public string Source { get; set; }
}