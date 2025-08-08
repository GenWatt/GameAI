using MediatR;
using SynapseStudio.ProjectService.Application.Abstractions;
using SynapseStudio.ProjectService.Application.Projects.Models;

namespace SynapseStudio.ProjectService.Application.Projects.Queries;

public sealed record GetProjectsQuery() : IRequest<IReadOnlyList<ProjectDto>>;

internal sealed class GetProjectsHandler : IRequestHandler<GetProjectsQuery, IReadOnlyList<ProjectDto>>
{
    private readonly IProjectRepository _repo;
    public GetProjectsHandler(IProjectRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken ct)
    {
        var items = await _repo.ListAsync(ct);
        return items.Select(ProjectDto.From).ToList();
    }
}
