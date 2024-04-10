using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Policies;
using TripPlanner.API.Database.Seeders;
using TripPlanner.API.Services.Authentication;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Services.CurrencyExchangeService;
using TripPlanner.API.Services.Expenses;
using TripPlanner.API.Services.Notifications;
using TripPlanner.API.Services.Profile;
using TripPlanner.API.Services.TripBudgets;
using TripPlanner.API.Services.TripDetails;
using TripPlanner.API.Services.TripDocuments;
using TripPlanner.API.Services.Trips;
using TripPlanner.API.Services.TripTravellers;
using TripPlanner.API.Services.User;

namespace TripPlanner.API;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        ConfigureServices(builder.Services, builder.Configuration);

        var app = builder.Build();
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<AppDbContext>();
            context.Database.Migrate();
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("AllowReactApp");
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        var dbSeeder = app.Services.CreateScope().ServiceProvider.GetRequiredService<IAuthenticationSeeder>();
        await dbSeeder.SeedAsync();

        app.Run();
    }

    private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        var blobServiceClient = new BlobServiceClient(configuration["AzureBlobStorage:ConnectionString"]);
        var blobContainerClient = blobServiceClient.GetBlobContainerClient(configuration["AzureBlobStorage:ContainerName"]);
        services.AddScoped(provider => blobContainerClient);

        services.AddHttpClient();

        services.AddScoped<IRepository<AppUser>, Repository<AppUser>>();
        services.AddScoped<IRepository<RefreshToken>, Repository<RefreshToken>>();
        services.AddScoped<IRepository<Traveller>, Repository<Traveller>>();
        services.AddScoped<IRepository<Trip>, Repository<Trip>>();
        services.AddScoped<IRepository<TripDetail>, Repository<TripDetail>>();
        services.AddScoped<IRepository<Notification>, Repository<Notification>>();
        services.AddScoped<IRepository<TripBudget>, Repository<TripBudget>>();
        services.AddScoped<IRepository<TripBudgetMember>, Repository<TripBudgetMember>>();
        services.AddScoped<IRepository<TripDocument>, Repository<TripDocument>>();
        services.AddScoped<IRepository<Expense>, Repository<Expense>>();
        services.AddScoped<IRepository<CurrencyExchangeRate>, Repository<CurrencyExchangeRate>>();

        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<ITripService, TripService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IAuthenticationSeeder, AuthenticationSeeder>();
        services.AddSingleton<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();
        services.AddScoped<IAzureBlobStorageService, AzureBlobStorageService>();
        services.AddScoped<ITripDetailsService, TripDetailsService>();
        services.AddScoped<ITripTravellersService, TripTravellersService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ITripBudgetsService, TripBudgetsService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<ITripDocumentService, TripDocumentService>();
        services.AddScoped<ICurrencyExchangeService, CurrencyExchangeService>();
        services.AddScoped<IExpenseService, ExpenseService>();

        services.AddAutoMapper(typeof(Program));

        services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

        services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["JWT:ValidIssuer"],
                ValidAudience = configuration["JWT:ValidAudience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"])),
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy(PolicyNames.ResourceOwner, policy => policy.Requirements.Add(new ResourceOwnerRequirement()));
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });

        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            var securityScheme = new OpenApiSecurityScheme
            {
                Name = "JWT Authentication",
                Description = "Enter JWT Bearer token **_only_**",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Reference = new OpenApiReference
                {
                    Id = JwtBearerDefaults.AuthenticationScheme,
                    Type = ReferenceType.SecurityScheme
                }
            };
            options.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {securityScheme, new string[] { }}
    });
        });
    }
}