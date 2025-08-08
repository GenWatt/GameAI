using MediatR;
using Microsoft.AspNetCore.Mvc;
using SynapseStudio.ProjectService.Api.Dto;
using SynapseStudio.ProjectService.Application.Projects.Commands;
using SynapseStudio.ProjectService.Application.Projects.Models;
using SynapseStudio.ProjectService.Application.Projects.Queries;
using SynapseStudio.ProjectService.Domain.Models;
using SynapseStudio.Shared.Abstractions.Api;

namespace SynapseStudio.ProjectService.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProjectsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetProjects(CancellationToken ct)
    {
        var list = await _mediator.Send(new GetProjectsQuery(), ct);
        return Ok(new ApiResponse<List<ProjectDto>> { Success = true, Data = list.ToList() });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id, CancellationToken ct)
    {
        var item = await _mediator.Send(new GetProjectByIdQuery(id), ct);
        if (item is null)
            return NotFound(new ApiError { Message = "Project not found.", Code = "ProjectNotFound", Status = 404 });
        return Ok(new ApiResponse<ProjectDto> { Success = true, Data = item });
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto projectDto, CancellationToken ct)
    {
        var result = await _mediator.Send(new CreateProjectCommand(
            projectDto.Name,
            projectDto.Description,
            projectDto.projectType,
            projectDto.ImageUrl
        ), ct);

        return Created($"/api/projects/{result.Id}", new ApiResponse<ProjectDto> { Success = true, Data = result });
    }

    [HttpGet("types")]
    public IActionResult GetProjectTypes()
        => Ok(new ApiResponse<string[]> { Success = true, Data = Enum.GetNames(typeof(ProjectType)) });
}
