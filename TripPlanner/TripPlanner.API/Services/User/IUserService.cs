using TripPlanner.API.Dtos.User;

namespace TripPlanner.API.Services.User
{
    public interface IUserService
    {
        UserInformationDto GetUserInformation(string userId);
    }
}