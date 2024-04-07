using TripPlanner.API.Dtos.User;

namespace TripPlanner.API.Services.User
{
    public interface IUserService
    {
        Task<UserInformationDto> GetUserInformation(string userId);
    }
}