using TripPlanner.API.Dtos.Profile;

namespace TripPlanner.API.Services.Profile;

public interface IProfileService
{
    Task<ProfileInformationDto> GetUserInformation(string userId);

    Task<bool> ChangePassword(string userId, ChangePasswordDto dto);

    Task<bool> ChangeProfileInformation(string userId, ChangeProfileInformationDto dto);
}