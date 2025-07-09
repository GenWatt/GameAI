
namespace SynapseStudio.Shared.Abstractions.Api;

public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new List<T>();
    public PaginationInfo Pagination { get; set; } = null!;
}

