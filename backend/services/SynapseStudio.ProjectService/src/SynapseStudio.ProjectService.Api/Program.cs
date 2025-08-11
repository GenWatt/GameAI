using FluentValidation;
using FluentValidation.AspNetCore;
using SynapseStudio.ProjectService.Core.Extensions;
using SynapseStudio.Shared.Observability.Extensions;
using MediatR;
using SynapseStudio.ProjectService.Application.Validation;
using SynapseStudio.ProjectService.Core.Persistence;
using SynapseStudio.ProjectService.Application.Projects.Commands;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(o => { o.JsonSerializerOptions.PropertyNamingPolicy = null; });
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(typeof(CreateProjectValidator).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

builder.Services.AddProjectServiceCore(builder.Configuration);

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

// Ensure DB is created (dev only)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ProjectDbContext>();
        db.Database.EnsureCreated();
    }
    catch { }
}

app.MapObservability();
app.UseHttpsRedirection();
app.MapHealthChecks("/api/health");
app.MapHealthChecks("/api/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
app.MapHealthChecks("/api/health/live", new HealthCheckOptions
{
    Predicate = _ => true
});

app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (ValidationException vex)
    {
        ctx.Response.StatusCode = StatusCodes.Status400BadRequest;
        await ctx.Response.WriteAsJsonAsync(new { error = "ValidationFailed", details = vex.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }) });
    }
    catch (InvalidOperationException ioex)
    {
        ctx.Response.StatusCode = StatusCodes.Status409Conflict;
        await ctx.Response.WriteAsJsonAsync(new { error = "Conflict", message = ioex.Message });
    }
    catch (Exception ex)
    {
        ctx.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await ctx.Response.WriteAsJsonAsync(new { error = "ServerError", message = ex.Message });
    }
});

app.UseAuthorization();
app.MapControllers();

app.Run();
