namespace SynapseStudio.ProjectService.Domain.Models;

public enum ProjectType
{
    DEFAULT,
    SPECIAL
}

public class ProjectModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public ProjectType Type { get; set; } = ProjectType.DEFAULT;
    public string? ImageUrl { get; set; }
    // public List<ConversationModel> Conversations { get; set; } = new List<ConversationModel>();
}