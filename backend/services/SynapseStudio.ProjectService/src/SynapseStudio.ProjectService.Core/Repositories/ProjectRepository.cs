using Microsoft.EntityFrameworkCore;
using SynapseStudio.ProjectService.Application.Abstractions;
using SynapseStudio.ProjectService.Core.Persistence;
using SynapseStudio.ProjectService.Domain.Entities;

namespace SynapseStudio.ProjectService.Core.Repositories;

internal sealed class ProjectRepository : IProjectRepository
{
    private readonly ProjectDbContext _db;
    public ProjectRepository(ProjectDbContext db) => _db = db;

    public async Task AddAsync(Project project, CancellationToken ct = default)
    {
        await _db.Projects.AddAsync(project, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
        => await _db.Projects.AnyAsync(p => p.Name == name, ct);

    public async Task<Project?> GetAsync(Guid id, CancellationToken ct = default)
        => await _db.Projects.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<Project>> ListAsync(CancellationToken ct = default)
        => await _db.Projects.AsNoTracking().OrderByDescending(p => p.UpdatedAt).ToListAsync(ct);
}
