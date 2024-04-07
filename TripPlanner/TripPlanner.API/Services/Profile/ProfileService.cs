using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Profile;

namespace TripPlanner.API.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly UserManager<AppUser> _userManager;

    public ProfileService(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<ProfileInformationDto> GetUserInformation(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        var profileInformation = new ProfileInformationDto(user.Name, user.Surname, user.UserName);
        
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

        user.Name = dto.Name;
        user.Surname = dto.Surname;
        user.Email = dto.Email;
        user.UserName = dto.Email;

        var result = await _userManager.UpdateAsync(user);

        return result.Succeeded;
    }
}