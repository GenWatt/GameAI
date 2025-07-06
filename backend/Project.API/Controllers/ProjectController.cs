using GameAI.API.Models;
using GameAI.Dto;
using GameAI.Shared;
using Microsoft.AspNetCore.Mvc;
using Project.API.Models;

namespace Project.API.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProjectsController : ControllerBase
{
    private static readonly List<ProjectModel> _projects = new List<ProjectModel>(){
    new ProjectModel
    {
        Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
        Name = "AI Game Character Creator",
        Description = "An advanced AI system for generating unique game characters with customizable personalities, abilities, and visual designs.",
        CreatedAt = DateTime.UtcNow.AddDays(-30),
        UpdatedAt = DateTime.UtcNow.AddDays(-5),
        Type = ProjectType.SPECIAL,
        ImageUrl = "https://example.com/ai-character-creator.png",
        Conversations = new List<ConversationModel>
        {
            new ConversationModel
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                ProjectId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Title = "Character Design Discussion",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-2),
                Messages = new List<MessageModel>
                {
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        Content = "I need help creating a fantasy warrior character with unique abilities.",
                        CreatedAt = DateTime.UtcNow.AddDays(-10),
                        UpdatedAt = DateTime.UtcNow.AddDays(-10),
                        Role = ChatRole.User
                    },
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        Content = "I can help you create an amazing fantasy warrior! Let's start with their background and special abilities.",
                        CreatedAt = DateTime.UtcNow.AddDays(-10).AddMinutes(2),
                        UpdatedAt = DateTime.UtcNow.AddDays(-10).AddMinutes(2),
                        Role = ChatRole.Assistant,
                        Assets = new AssetsModel
                        {
                            Id = Guid.NewGuid(),
                            MessageId = Guid.NewGuid(),
                            Name = "warrior_concept.png",
                            Type = AssetsType.Image,
                            Url = "https://example.com/assets/warrior_concept.png",
                            CreatedAt = DateTime.UtcNow.AddDays(-10),
                            UpdatedAt = DateTime.UtcNow.AddDays(-10)
                        }
                    }
                }
            }
        }
    },
    new ProjectModel
    {
        Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
        Name = "Procedural World Generator",
        Description = "Generate infinite, immersive game worlds with realistic terrain and ecosystems.",
        CreatedAt = DateTime.UtcNow.AddDays(-25),
        UpdatedAt = DateTime.UtcNow.AddDays(-2),
        Type = ProjectType.SPECIAL,
        ImageUrl = "https://example.com/world-generator.png",
        Conversations = new List<ConversationModel>
        {
            new ConversationModel
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                ProjectId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Title = "Terrain Generation Ideas",
                CreatedAt = DateTime.UtcNow.AddDays(-7),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                Messages = new List<MessageModel>
                {
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        Content = "How can I create more realistic mountain ranges in my world generation?",
                        CreatedAt = DateTime.UtcNow.AddDays(-7),
                        UpdatedAt = DateTime.UtcNow.AddDays(-7),
                        Role = ChatRole.User
                    },
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                        Content = "For realistic mountain ranges, consider using Perlin noise combined with erosion algorithms. Here's a sample implementation.",
                        CreatedAt = DateTime.UtcNow.AddDays(-7).AddMinutes(5),
                        UpdatedAt = DateTime.UtcNow.AddDays(-7).AddMinutes(5),
                        Role = ChatRole.Assistant,
                        Assets = new AssetsModel
                        {
                            Id = Guid.NewGuid(),
                            MessageId = Guid.NewGuid(),
                            Name = "terrain_algorithm.cs",
                            Type = AssetsType.Model,
                            Url = "https://example.com/assets/terrain_algorithm.cs",
                            CreatedAt = DateTime.UtcNow.AddDays(-7),
                            UpdatedAt = DateTime.UtcNow.AddDays(-7)
                        }
                    }
                }
            }
        }
    },
    new ProjectModel
    {
        Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
        Name = "Smart NPC Behavior Engine",
        Description = "Create intelligent NPCs that adapt to player behavior and provide dynamic storytelling.",
        CreatedAt = DateTime.UtcNow.AddDays(-20),
        UpdatedAt = DateTime.UtcNow.AddDays(-1),
        Type = ProjectType.DEFAULT,
        ImageUrl = "https://example.com/npc-behavior.png",
        Conversations = new List<ConversationModel>
        {
            new ConversationModel
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                ProjectId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "NPC Decision Making",
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddHours(-6),
                Messages = new List<MessageModel>
                {
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                        Content = "What's the best approach for NPC dialogue trees that feel natural?",
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        UpdatedAt = DateTime.UtcNow.AddDays(-5),
                        Role = ChatRole.User
                    },
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                        Content = "Natural dialogue requires context awareness and personality consistency. Here's an audio example of dynamic NPC interaction.",
                        CreatedAt = DateTime.UtcNow.AddDays(-5).AddMinutes(3),
                        UpdatedAt = DateTime.UtcNow.AddDays(-5).AddMinutes(3),
                        Role = ChatRole.Assistant,
                        Assets = new AssetsModel
                        {
                            Id = Guid.NewGuid(),
                            MessageId = Guid.NewGuid(),
                            Name = "npc_dialogue_sample.mp3",
                            Type = AssetsType.Audio,
                            Url = "https://example.com/assets/npc_dialogue_sample.mp3",
                            CreatedAt = DateTime.UtcNow.AddDays(-5),
                            UpdatedAt = DateTime.UtcNow.AddDays(-5)
                        }
                    }
                }
            },
            new ConversationModel
            {
                Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                ProjectId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Title = "Behavior State Machines",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddHours(-2),
                Messages = new List<MessageModel>
                {
                    new MessageModel
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                        Content = "Can you explain finite state machines for NPC behavior?",
                        CreatedAt = DateTime.UtcNow.AddDays(-3),
                        UpdatedAt = DateTime.UtcNow.AddDays(-3),
                        Role = ChatRole.User
                    }
                }
            }
        }
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
        Conversations = new List<ConversationModel>()
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
}
