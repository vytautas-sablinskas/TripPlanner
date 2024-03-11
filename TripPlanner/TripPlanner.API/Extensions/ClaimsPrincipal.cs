using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TripPlanner.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal claims) => claims.FindFirstValue(JwtRegisteredClaimNames.Sub);
}