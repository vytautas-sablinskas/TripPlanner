using Microsoft.Extensions.Configuration;
using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Services.Authentication;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.Authentication;

public class JwtTokenServiceTests
{
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<IRepository<RefreshToken>> _refreshTokenRepoMock;
    private readonly Mock<IUserManagerWrapper> _userManagerWrapper;
    private readonly JwtTokenService _service;

    public JwtTokenServiceTests()
    {
        _configurationMock = new Mock<IConfiguration>();
        _refreshTokenRepoMock = new Mock<IRepository<RefreshToken>>();
        _userManagerWrapper = new Mock<IUserManagerWrapper>();
        _service = new JwtTokenService(_configurationMock.Object, _refreshTokenRepoMock.Object, _userManagerWrapper.Object);
    }

    [Fact]
    public void CreateTokens_WhenGivenValidData_ShouldCreateNewLoginTokens()
    {
        (var accessToken, var refreshToken) = _service.CreateTokens("username", "userId", new List<string>());

        Assert.True(!string.IsNullOrEmpty(accessToken));
        Assert.True(!string.IsNullOrEmpty(refreshToken));
    }

    [Fact]
    public async Task RefreshTokensAsync_WhenGivenRefreshToken_ShouldGenerateNewOnes()
    {
        _refreshTokenRepoMock.Setup(v => v.FindByCondition(It.IsAny<Expression<Func<RefreshToken, bool>>>()))
            .Returns(new List<RefreshToken> { new RefreshToken { ExpiryDate = DateTime.MaxValue, IsRevoked = false }}.AsQueryable());
        _userManagerWrapper.Setup(v => v.FindByIdAsync(It.IsAny<string>()))
            .ReturnsAsync(new AppUser { UserName = "username", Id = "Id" });
        _userManagerWrapper.Setup(v => v.GetRolesAsync(It.IsAny<AppUser>()))
            .ReturnsAsync(new List<string>());

        var result = await _service.RefreshTokensAsync("refreshToken");

        Assert.True(result.HasValue);
        Assert.True(!string.IsNullOrEmpty(result.Value.AccessToken));
    }

    [Fact]
    public async Task RevokeToken_WhenGivenToken_ShouldRevokeItIfItsInDatabase()
    {
        _refreshTokenRepoMock.Setup(v => v.FindByCondition(It.IsAny<Expression<Func<RefreshToken, bool>>>()))
            .Returns(new List<RefreshToken> { new RefreshToken { ExpiryDate = DateTime.MaxValue, IsRevoked = false }}.AsQueryable());

        var isSuccess = await _service.RevokeToken("refreshToken");

        Assert.True(isSuccess);
    }
}