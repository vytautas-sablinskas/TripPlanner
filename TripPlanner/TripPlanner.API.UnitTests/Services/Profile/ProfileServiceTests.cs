using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Profile;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Services.Profile;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.Profile;

public class ProfileServiceTests
{
    private readonly Mock<IUserManagerWrapper> _userManagerMock;
    private readonly Mock<IAzureBlobStorageService> _azureBlobStorageServiceMock;
    private readonly ProfileService _profileService;

    public ProfileServiceTests()
    {
        _userManagerMock = new Mock<IUserManagerWrapper>();
        _azureBlobStorageServiceMock = new Mock<IAzureBlobStorageService>();
        _profileService = new ProfileService(_userManagerMock.Object, _azureBlobStorageServiceMock.Object);
    }

    [Fact]
    public async Task GetUserInformation_UserExists_ReturnsProfileInformation()
    {
        var userId = "userId";
        var user = new AppUser { Id = userId, Name = "John", Surname = "Doe", UserName = "john.doe@example.com", PhotoUri = "photo.jpg" };
        _userManagerMock.Setup(manager => manager.FindByIdAsync(userId)).ReturnsAsync(user);

        var result = await _profileService.GetUserInformation(userId);

        Assert.NotNull(result);
        Assert.Equal("John", result.Name);
        Assert.Equal("Doe", result.Surname);
        Assert.Equal("photo.jpg", result.Photo);
    }

    [Fact]
    public async Task ChangePassword_UserExists_ReturnsTrue()
    {
        var userId = "userId";
        var user = new AppUser { Id = userId };
        var dto = new ChangePasswordDto("oldPassword", "newPassword");
        var identityResult = IdentityResult.Success;
        _userManagerMock.Setup(manager => manager.FindByIdAsync(userId)).ReturnsAsync(user);
        _userManagerMock.Setup(manager => manager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword)).ReturnsAsync(identityResult);

        var result = await _profileService.ChangePassword(userId, dto);

        Assert.True(result);
    }

    [Fact]
    public async Task ChangeProfileInformation_UserExists_ReturnsTrue()
    {
        var userId = "userId";
        var user = new AppUser { Id = userId, PhotoUri = "oldPhoto.jpg" };

        var mockImage = new Mock<IFormFile>();
        var dto = new ChangeProfileInformationDto("John", "Doe", "john.doe@example.com", mockImage.Object);
        var identityResult = IdentityResult.Success;
        _userManagerMock.Setup(manager => manager.FindByIdAsync(userId)).ReturnsAsync(user);
        _azureBlobStorageServiceMock.Setup(service => service.DeleteFileAsync(user.PhotoUri)).Returns(Task.CompletedTask);
        _azureBlobStorageServiceMock.Setup(service => service.UploadImageAsync(dto.Image)).ReturnsAsync("newPhoto.jpg");
        _userManagerMock.Setup(manager => manager.UpdateAsync(user)).ReturnsAsync(identityResult);

        var result = await _profileService.ChangeProfileInformation(userId, dto);

        Assert.True(result);
        Assert.Equal("John", user.Name);
        Assert.Equal("Doe", user.Surname);
        Assert.Equal("john.doe@example.com", user.Email);
        Assert.Equal("john.doe@example.com", user.UserName);
        Assert.Equal("newPhoto.jpg", user.PhotoUri);
    }
}