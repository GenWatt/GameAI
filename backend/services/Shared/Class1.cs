
namespace GameAI.Shared;

public class ApiResponse<T>
{
    public T Data { get; set; }
    public string? Message { get; set; }
    public bool Success { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class ApiError
{
    public string Message { get; set; } = null!;
    public string Code { get; set; } = null!;
    public int? Status { get; set; }
    public object? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new List<T>();
    public PaginationInfo Pagination { get; set; } = null!;
}

public class PaginationInfo
{
    public int Page { get; set; }
    public int Limit { get; set; }
    public int Total { get; set; }
    public int TotalPages { get; set; }
}

public class QueryParams
{
    public int? Page { get; set; } = 1;
    public int? Limit { get; set; } = 10;
    public string? Sort { get; set; }
    public string? Order { get; set; } // "asc" or "desc"
    public string? Search { get; set; }
}

public class ProjectDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

