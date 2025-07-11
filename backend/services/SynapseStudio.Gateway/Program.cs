using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using SynapseStudio.Shared.Observability.Extensions;

var builder = WebApplication.CreateBuilder(args);
var environment = builder.Environment.EnvironmentName;
Console.WriteLine($"Environment: {environment}");
builder.Configuration.AddJsonFile($"ocelot.{environment}.json", optional: true, reloadOnChange: true);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddObservability();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowTauriApp",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapObservability();
app.UseRouting();
app.MapHealthChecks("/api/health");

app.UseCors("AllowTauriApp");
app.UseHttpsRedirection();

app.UseAuthorization();

#pragma warning disable ASP0014
app.UseEndpoints(e =>
{
    e.MapControllers();
});
#pragma warning restore ASP0014
await app.UseOcelot();

app.Run();
