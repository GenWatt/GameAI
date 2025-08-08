using SynapseStudio.ProjectService.Domain.Models;

namespace SynapseStudio.ProjectService.Domain.Entities;

public sealed class Project
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public ProjectType Type { get; private set; }
    public string? ImageUrl { get; private set; }

    private Project()
    {
        Name = string.Empty;
        Description = string.Empty;
    }

    public Project(Guid id, string name, string? description, ProjectType type, string? imageUrl)
    {
        Name = string.Empty;
        Description = string.Empty;
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        SetName(name);
        SetDescription(description);
        Type = type;
        ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Project name is required.", nameof(name));
        if (name.Length > 200)
            throw new ArgumentException("Project name is too long (max 200).", nameof(name));
        Name = name.Trim();
        Touch();
    }

    public void SetDescription(string? description)
    {
        if (description?.Length > 2000)
            throw new ArgumentException("Description too long (max 2000).", nameof(description));
        Description = description?.Trim() ?? string.Empty;
        Touch();
    }

    public void SetType(ProjectType type)
    {
        Type = type;
        Touch();
    }

    public void SetImageUrl(string? imageUrl)
    {
        if (imageUrl is { Length: > 1024 })
            throw new ArgumentException("Image URL too long (max 1024).", nameof(imageUrl));
        ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl;
        Touch();
    }

    private void Touch() => UpdatedAt = DateTime.UtcNow;
}
