using FluentValidation;
using MediatR;
using MassTransit;
using SynapseStudio.ProjectService.Application.Abstractions;
using SynapseStudio.ProjectService.Application.Contracts;
using SynapseStudio.ProjectService.Application.Projects.Models;
using SynapseStudio.ProjectService.Domain.Entities;
using SynapseStudio.ProjectService.Domain.Models;

namespace SynapseStudio.ProjectService.Application.Projects.Commands;

public sealed record CreateProjectCommand(string Name, string? Description, ProjectType Type, string? ImageUrl) : IRequest<ProjectDto>;

public sealed class CreateProjectValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.ImageUrl).MaximumLength(1024).When(x => !string.IsNullOrWhiteSpace(x.ImageUrl));
    }
}

internal sealed class CreateProjectHandler : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    private readonly IProjectRepository _repo;
    private readonly IPublishEndpoint _publisher;

    public CreateProjectHandler(IProjectRepository repo, IPublishEndpoint publisher)
    {
        _repo = repo; _publisher = publisher;
    }

    public async Task<ProjectDto> Handle(CreateProjectCommand request, CancellationToken ct)
    {
        if (await _repo.ExistsByNameAsync(request.Name, ct))
            throw new InvalidOperationException($"Project with name '{request.Name}' already exists.");

        var project = new Project(Guid.NewGuid(), request.Name, request.Description, request.Type, request.ImageUrl);
        await _repo.AddAsync(project, ct);

        await _publisher.Publish<ProjectCreatedV1>(new
        {
            ProjectId = project.Id,
            project.Name,
            Description = project.Description,
            ImageUrl = project.ImageUrl,
            Type = project.Type.ToString(),
            CreatedAt = project.CreatedAt
        }, ct);

        return ProjectDto.From(project);
    }
}
