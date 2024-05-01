using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.Services.Authentication;

public class JwtTokenService : IJwtTokenService
{
    private readonly string? _audience;
    private readonly string? _issuer;
    private readonly SymmetricSecurityKey _authSigningKey;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IUserManagerWrapper userManagerWrapper;

    public JwtTokenService(IConfiguration configuration, IRepository<RefreshToken> refreshTokenRepository, IUserManagerWrapper userManagerWrapper)
    {
        _audience = configuration["JWT:ValidAudience"];
        _issuer = configuration["JWT:ValidIssuer"];
        var secretKey = configuration["JWT:Secret"];
        _authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? "987654321fqrfdggxx22ggjklqwertyu"));
        _refreshTokenRepository = refreshTokenRepository;
        this.userManagerWrapper = userManagerWrapper;
    }

    public (string AccessToken, string RefreshToken) CreateTokens(string userName, string userId, IEnumerable<string> userRoles)
    {
        var accessToken = CreateAccessToken(userName, userId, userRoles);
        var refreshTokenString = GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Token = refreshTokenString,
            ExpiryDate = DateTime.UtcNow.AddDays(7),
            UserId = userId,
            IsRevoked = false
        };

        _refreshTokenRepository.Create(refreshToken);

        return (accessToken, refreshTokenString);
    }

    public async Task<(string AccessToken, string RefreshToken)?> RefreshTokensAsync(string refreshToken)
    {
        var storedToken = _refreshTokenRepository.FindByCondition(r => r.Token == refreshToken).FirstOrDefault();

        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryDate <= DateTime.UtcNow)
        {
            return null;
        }

        var user = await userManagerWrapper.FindByIdAsync(storedToken.UserId);
        var userRoles = await userManagerWrapper.GetRolesAsync(user);
        var (newAccessToken, newRefreshToken) = CreateTokens(user.UserName, user.Id, userRoles);

        await _refreshTokenRepository.Delete(storedToken);

        return (newAccessToken, newRefreshToken);
    }

    public async Task<bool> RevokeToken(string refreshToken)
    {
        var storedToken = _refreshTokenRepository.FindByCondition(r => r.Token == refreshToken).FirstOrDefault();

        if (storedToken == null)
        {
            return false;
        }

        await _refreshTokenRepository.Delete(storedToken);

        return true;
    }



    private string CreateAccessToken(string userName, string userId, IEnumerable<string> userRoles)
    {
        var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, userId)
            };

        authClaims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        var accessSecurityToken = new JwtSecurityToken
        (
            issuer: _issuer,
            audience: _audience,
            expires: DateTime.UtcNow.AddMinutes(600),
            claims: authClaims,
            signingCredentials: new SigningCredentials(_authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(accessSecurityToken);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}