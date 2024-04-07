using TripPlanner.API.Dtos.Profile;

namespace TripPlanner.API.Services.Profile
{
    public interface IProfileService
    {
        Task<ProfileInformationDto> GetUserInformation(string userId);
    }
}