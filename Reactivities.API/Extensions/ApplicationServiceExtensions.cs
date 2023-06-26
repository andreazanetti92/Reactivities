using MediatR;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Reactivities.Application.Activities;
using Reactivities.Application.Core;
using Reactivities.Application.Interfaces;
using Reactivities.Infrastructure.Security;
using Reactivities.Persistence;
using System;


namespace Reactivities.API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Reactivities.API", Version = "v1" });
            });

            services.AddDbContext<DataContext>(opt =>
            {
                //opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
                var conn = new SqliteConnection(config.GetConnectionString("DefaultConnection"));
                opt.UseSqlite(conn);
                //opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });

            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}
