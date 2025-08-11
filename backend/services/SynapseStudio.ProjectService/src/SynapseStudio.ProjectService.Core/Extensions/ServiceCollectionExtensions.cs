using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SynapseStudio.ProjectService.Application.Abstractions;
using SynapseStudio.ProjectService.Application.Projects.Commands;
using SynapseStudio.ProjectService.Core.Persistence;
using SynapseStudio.ProjectService.Core.Repositories;
using SynapseStudio.ProjectService.Application.Contracts;

namespace SynapseStudio.ProjectService.Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddProjectServiceCore(this IServiceCollection services, IConfiguration cfg)
    {
        services.AddDbContext<ProjectDbContext>(opt =>
        {
            var host = cfg["POSTGRES_HOST"];
            var db = cfg["POSTGRES_DB"];
            var user = cfg["POSTGRES_USER"];
            var pass = cfg["POSTGRES_PASSWORD"];
            var cs = $"Host={host};Port=5432;Database={db};Username={user};Password={pass}";

            Console.WriteLine($"Using postgres connection: Host={host};Port=5432;Database={db};Username={user}");

            if (cs.Contains("Data Source=projects.db"))
            {
                Console.WriteLine("Using SQLLITE " + cs);
                opt.UseSqlite(cs);
            }
            else
            {
                Console.WriteLine("Using postgres " + cs);
                opt.UseNpgsql(cs);
            }
        });

        // Repositories
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddMediatR(cfgM => cfgM.AsSingleton(), typeof(CreateProjectCommand).Assembly);

        // MassTransit bus
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();
            x.UsingRabbitMq((context, cfgRabbit) =>
            {
                var configuration = context.GetRequiredService<IConfiguration>();
                Console.WriteLine($"Host is: {configuration["Rabbit:Host"]}");
                cfgRabbit.Host(configuration["Rabbit:Host"] ?? "localhost", "/", h =>
                {
                    h.Username(configuration["Rabbit:User"] ?? "guest");
                    h.Password(configuration["Rabbit:Pass"] ?? "guest");
                });

                cfgRabbit.Message<ProjectCreatedV1>(m =>
                {
                    m.SetEntityName("project.created.v1");
                });

                cfgRabbit.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}