namespace ConversationService.Domain.Models;

public enum ChatRole
{
    User,
    Assistant,
}

public enum AssetsType
{
    Image,
    Audio,
    Model,
}

public class ConversationModel
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }

    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<MessageModel> Messages { get; set; } = new List<MessageModel>();
}

public class AssetsModel
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }

    public string Name { get; set; } = string.Empty;
    public AssetsType Type { get; set; }
    public string Url { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class MessageModel
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }

    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ChatRole Role { get; set; }
    public AssetsModel Assets { get; set; } = new AssetsModel();
}