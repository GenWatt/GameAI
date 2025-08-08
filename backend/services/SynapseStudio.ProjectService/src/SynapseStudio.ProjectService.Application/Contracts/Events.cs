namespace SynapseStudio.ProjectService.Application.Contracts;

public interface ProjectCreatedV1
{
    Guid ProjectId { get; }
    string Name { get; }
    string? Description { get; }
    string? ImageUrl { get; }
    string Type { get; }
    DateTime CreatedAt { get; }
}
