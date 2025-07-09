
namespace SynapseStudio.Shared.Abstractions.Api;

public class ApiResponse<T>
{
    public T Data { get; set; }
    public string? Message { get; set; }
    public bool Success { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}