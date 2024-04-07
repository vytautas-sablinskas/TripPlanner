using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Profile;
using TripPlanner.API.Services.AzureBlobStorage;

namespace TripPlanner.API.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IAzureBlobStorageService _azureBlobStorageService;

    public ProfileService(UserManager<AppUser> userManager, IAzureBlobStorageService azureBlobStorageService)
    {
        _userManager = userManager;
        _azureBlobStorageService = azureBlobStorageService;        
    }

    public async Task<ProfileInformationDto> GetUserInformation(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        var profileInformation = new ProfileInformationDto(user.Name, user.Surname, user.UserName, user.PhotoUri);
        
        return profileInformation;
    }

    public async Task<bool> ChangePassword(string userId, ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        return result.Succeeded;
    }


    public async Task<bool> ChangeProfileInformation(string userId, ChangeProfileInformationDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        if (dto.Image != null)
        {
            if (!string.IsNullOrEmpty(user.PhotoUri))
            {
                await _azureBlobStorageService.DeleteFileAsync(user.PhotoUri);
            }

            user.PhotoUri = await _azureBlobStorageService.UploadImageAsync(dto.Image);
        }

        user.Name = dto.Name;
        user.Surname = dto.Surname;
        user.Email = dto.Email;
        user.UserName = dto.Email;

        var result = await _userManager.UpdateAsync(user);

        return result.Succeeded;
    }
}