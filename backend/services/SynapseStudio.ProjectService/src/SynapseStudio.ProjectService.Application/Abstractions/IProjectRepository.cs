using SynapseStudio.ProjectService.Domain.Entities;

namespace SynapseStudio.ProjectService.Application.Abstractions;

public interface IProjectRepository
{
    Task<Project?> GetAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Project>> ListAsync(CancellationToken ct = default);
    Task AddAsync(Project project, CancellationToken ct = default);
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
}
