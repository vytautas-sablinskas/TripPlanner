using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Services.Authentication;

public interface IJwtTokenService
{
    (string AccessToken, string RefreshToken) CreateTokens(string userName, string userId, IEnumerable<string> userRoles);

    Task<(string AccessToken, string RefreshToken)?> RefreshTokensAsync(UserManager<AppUser> userManager, string refreshToken);

    bool RevokeToken(string refreshToken);
}