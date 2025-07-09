
namespace SynapseStudio.Shared.Abstractions.Api;

public class ApiError
{
    public string Message { get; set; } = null!;
    public string Code { get; set; } = null!;
    public int? Status { get; set; }
    public object? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
