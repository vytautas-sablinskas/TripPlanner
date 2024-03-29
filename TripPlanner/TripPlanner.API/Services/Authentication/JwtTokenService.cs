﻿using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;

namespace TripPlanner.API.Services.Authentication;

public class JwtTokenService : IJwtTokenService
{
    private readonly string? _audience;
    private readonly string? _issuer;
    private readonly SymmetricSecurityKey _authSigningKey;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;

    public JwtTokenService(IConfiguration configuration, IRepository<RefreshToken> refreshTokenRepository)
    {
        _audience = configuration["JWT:ValidAudience"];
        _issuer = configuration["JWT:ValidIssuer"];
        _authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
        _refreshTokenRepository = refreshTokenRepository;
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

    public async Task<(string AccessToken, string RefreshToken)?> RefreshTokensAsync(UserManager<AppUser> userManager, string refreshToken)
    {
        var storedToken = _refreshTokenRepository.FindByCondition(r => r.Token == refreshToken).FirstOrDefault();

        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryDate <= DateTime.UtcNow)
        {
            return null;
        }

        var user = await userManager.FindByIdAsync(storedToken.UserId);
        var userRoles = await userManager.GetRolesAsync(user);
        var (newAccessToken, newRefreshToken) = CreateTokens(user.UserName, user.Id, userRoles);

        _refreshTokenRepository.Delete(storedToken);

        return (newAccessToken, newRefreshToken);
    }

    public bool RevokeToken(string refreshToken)
    {
        var storedToken = _refreshTokenRepository.FindByCondition(r => r.Token == refreshToken).FirstOrDefault();

        if (storedToken == null)
        {
            return false;
        }

        _refreshTokenRepository.Delete(storedToken);

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