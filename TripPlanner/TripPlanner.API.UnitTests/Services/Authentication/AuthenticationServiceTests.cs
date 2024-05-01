using Microsoft.AspNetCore.Identity;
using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Services.Authentication;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.Authentication;

public class AuthenticationServiceTests
{
    private readonly Mock<IUserManagerWrapper> _userManagerMock;
    private readonly Mock<IJwtTokenService> _jwtTokenServiceMock;
    private readonly Mock<IRepository<Notification>> _notificationRepositoryMock;
    private readonly Mock<IRepository<Traveller>> _travellerRepositoryMock;
    private readonly AuthenticationService _service;

    public AuthenticationServiceTests()
    {
        _userManagerMock = new Mock<IUserManagerWrapper>();
        _jwtTokenServiceMock = new Mock<IJwtTokenService>();
        _notificationRepositoryMock = new Mock<IRepository<Notification>>();
        _travellerRepositoryMock = new Mock<IRepository<Traveller>>();

        _service = new AuthenticationService(_userManagerMock.Object, _jwtTokenServiceMock.Object, _notificationRepositoryMock.Object, _travellerRepositoryMock.Object);
    }

    [Fact]
    public async Task Login_GivenValidData_ShouldReturnExpectedLoginData()
    {
        var user = new AppUser { UserName = "testusername", Id = "test" };
        var expectedAccessToken = "access";
        var expectedRefreshToken = "refresh";

        _userManagerMock.Setup(v => v.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(user);
        _userManagerMock.Setup(v => v.CheckPasswordAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
            .ReturnsAsync(true);
        _userManagerMock.Setup(v => v.GetRolesAsync(It.IsAny<AppUser>()))
            .ReturnsAsync(new List<string>());
        _jwtTokenServiceMock.Setup(v => v.CreateTokens(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<IEnumerable<string>>()))
            .Returns(() => (expectedAccessToken, expectedRefreshToken));

        var result = await _service.Login(new LoginDto("", ""));
        var data = result.Data;

        Assert.True(result.Success);
        Assert.True(data?.AccessToken == expectedAccessToken);
        Assert.True(data.RefreshToken == expectedRefreshToken);
    }

    [Fact]
    public async Task Register_WhenGivenCorrectInformation_ShouldReturnSuccessWithDataOfRegistration()
    {
        var user = new AppUser { UserName = "testusername", Id = "test" };
        var expectedAccessToken = "access";
        var expectedRefreshToken = "refresh";
        var notifications = new List<Notification>() { new Notification { UserId = user.Id } };
        var travellers = new List<Traveller>() { new Traveller() };

        _userManagerMock.Setup(v => v.CreateAsync(It.IsAny<AppUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
        _notificationRepositoryMock.Setup(v => v.GetListByConditionAsync(It.IsAny<Expression<Func<Notification, bool>>>()))
            .ReturnsAsync(notifications);
        _travellerRepositoryMock.Setup(v => v.GetListByConditionAsync(It.IsAny<Expression<Func<Traveller, bool>>>()))
            .ReturnsAsync(travellers);

        var result = await _service.Register(new RegisterUserDto("name", "surname", "email", "password"));

        Assert.True(result.Success);
        Assert.True(result.Data?.Email == "email");
    }

    [Fact]
    public async Task Logout_WhenGivenRefreshToken_ShouldSucceed()
    {
        _jwtTokenServiceMock.Setup(v => v.RevokeToken(It.IsAny<string>()))
            .ReturnsAsync(true);

        var result = await _service.Logout(new RefreshTokenDto("test"));

        Assert.True(result.Success);
    }

    [Fact]
    public async Task RefreshToken_WhenGivenCorrectData_ShouldRefreshToken()
    {
        _jwtTokenServiceMock.Setup(v => v.RefreshTokensAsync(It.IsAny<string>()))
            .ReturnsAsync((string refreshToken) => (AccessToken: "access", RefreshToken: "refresh"));

        var result = await _service.RefreshToken(new RefreshTokenDto("refreshToken"));

        Assert.True(result.Success);
        Assert.True(result.Data?.RefreshToken == "refresh");
    }
}