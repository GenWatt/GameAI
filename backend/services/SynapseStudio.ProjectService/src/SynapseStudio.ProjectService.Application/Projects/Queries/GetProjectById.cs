using MediatR;
using SynapseStudio.ProjectService.Application.Abstractions;
using SynapseStudio.ProjectService.Application.Projects.Models;

namespace SynapseStudio.ProjectService.Application.Projects.Queries;

public sealed record GetProjectByIdQuery(Guid Id) : IRequest<ProjectDto?>;

internal sealed class GetProjectByIdHandler : IRequestHandler<GetProjectByIdQuery, ProjectDto?>
{
    private readonly IProjectRepository _repo;
    public GetProjectByIdHandler(IProjectRepository repo) => _repo = repo;

    public async Task<ProjectDto?> Handle(GetProjectByIdQuery request, CancellationToken ct)
    {
        var item = await _repo.GetAsync(request.Id, ct);
        return item is null ? null : ProjectDto.From(item);
    }
}
