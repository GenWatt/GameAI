using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using SynapseStudio.Shared.Observability.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddObservability();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapHealthChecks("/api/health");
app.MapHealthChecks("/api/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
app.MapHealthChecks("/api/health/live", new HealthCheckOptions
{
    Predicate = _ => true
});

app.MapObservability();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
