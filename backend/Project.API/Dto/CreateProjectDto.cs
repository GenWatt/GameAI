using Project.API.Models;

namespace GameAI.Dto;

public class CreateProjectDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public ProjectType projectType { get; set; } = ProjectType.DEFAULT;
}
