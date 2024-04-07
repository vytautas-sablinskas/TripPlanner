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
}