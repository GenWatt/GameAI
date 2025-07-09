
namespace SynapseStudio.Shared.Abstractions.Api;

public class QueryParams
{
    public int? Page { get; set; } = 1;
    public int? Limit { get; set; } = 10;
    public string? Sort { get; set; }
    public string? Order { get; set; } // "asc" or "desc"
    public string? Search { get; set; }
}
