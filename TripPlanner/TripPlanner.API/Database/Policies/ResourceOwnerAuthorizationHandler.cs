using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using TripPlanner.API.Database.Roles;

namespace TripPlanner.API.Database.Policies
{
    public record ResourceOwnerRequirement : IAuthorizationRequirement;

    public interface IUserOwnedResource { public string UserId { get; } }

    public class ResourceOwnerAuthorizationHandler : AuthorizationHandler<ResourceOwnerRequirement, IUserOwnedResource>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ResourceOwnerRequirement requirement, IUserOwnedResource resource)
        {
            if (context.User.IsInRole(UserRoles.Admin) || context.User.FindFirstValue(JwtRegisteredClaimNames.Sub) == resource.UserId)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
