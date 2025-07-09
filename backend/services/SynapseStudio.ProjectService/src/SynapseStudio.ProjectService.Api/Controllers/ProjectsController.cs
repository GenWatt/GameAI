using Microsoft.AspNetCore.Mvc;
using SynapseStudio.ProjectService.Api.Dto;
using SynapseStudio.ProjectService.Domain.Models;
using SynapseStudio.Shared.Abstractions.Api;

namespace SynapseStudio.ProjectService.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProjectsController : ControllerBase
{
    private static readonly List<ProjectModel> _projects = new()
    {
        new ProjectModel
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "AI Game Character Creator",
            Description = "An advanced AI system for generating unique game characters with customizable personalities, abilities, and visual designs.",
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            UpdatedAt = DateTime.UtcNow.AddDays(-5),
            Type = ProjectType.SPECIAL,
            ImageUrl = "https://example.com/ai-character-creator.png"
        },
        new ProjectModel
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Procedural World Generator",
            Description = "Generate infinite, immersive game worlds with realistic terrain and ecosystems.",
            CreatedAt = DateTime.UtcNow.AddDays(-25),
            UpdatedAt = DateTime.UtcNow.AddDays(-2),
            Type = ProjectType.SPECIAL,
            ImageUrl = "https://example.com/world-generator.png"
        },
        new ProjectModel
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "Smart NPC Behavior Engine",
            Description = "Create intelligent NPCs that adapt to player behavior and provide dynamic storytelling.",
            CreatedAt = DateTime.UtcNow.AddDays(-20),
            UpdatedAt = DateTime.UtcNow.AddDays(-1),
            Type = ProjectType.DEFAULT,
            ImageUrl = "https://example.com/npc-behavior.png"
        },
        new ProjectModel
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            Name = "Dynamic Quest Generator",
            Description = "Automatically generate engaging quests based on player preferences and game state.",
            CreatedAt = DateTime.UtcNow.AddDays(-15),
            UpdatedAt = DateTime.UtcNow.AddHours(-12),
            Type = ProjectType.DEFAULT,
            ImageUrl = "https://example.com/quest-generator.png",
        }
    };

    [HttpGet]
    public IActionResult GetProjects()
    {
        return Ok(new ApiResponse<List<ProjectModel>>
        {
            Success = true,
            Data = _projects
        });
    }

    [HttpGet("{id}")]
    public IActionResult GetProjectById(Guid id)
    {
        var project = _projects.FirstOrDefault(p => p.Id == id);

        if (project == null)
        {
            return NotFound(new ApiError
            {
                Message = "Project not found.",
                Code = "ProjectNotFound",
                Status = 404
            });
        }

        return Ok(new ApiResponse<ProjectModel>
        {
            Success = true,
            Data = project
        });
    }

    [HttpPost]
    public IActionResult CreateProject([FromBody] CreateProjectDto projectDto)
    {
        if (projectDto == null)
        {
            return BadRequest(new ApiError
            {
                Message = "Invalid project data.",
                Code = "InvalidProjectData",
                Status = 400
            });
        }

        ProjectModel project = new ProjectModel
        {
            Id = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow,
            Name = projectDto.Name,
            Description = projectDto.Description ?? string.Empty,
            Type = projectDto.projectType,
            ImageUrl = projectDto.ImageUrl,
        };

        _projects.Add(project);

        Console.WriteLine($"Project created: {project.Name} (ID: {project.Id})");

        return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, new ApiResponse<ProjectModel>
        {
            Success = true,
            Data = project
        });
    }

    [HttpGet("types")]
    public IActionResult GetProjectTypes()
    {
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Data = "ale3"
        });
    }
}
