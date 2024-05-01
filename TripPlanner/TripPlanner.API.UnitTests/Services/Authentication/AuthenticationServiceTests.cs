using Moq;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Services.Authentication;

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
    public async Task Test()
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
}