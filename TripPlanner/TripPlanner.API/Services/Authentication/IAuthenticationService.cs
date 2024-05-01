using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Utils;

namespace TripPlanner.API.Services.Authentication;

public interface IAuthenticationService
{
    Task<Result<SuccessfulLoginWithUserInfoDto>> Login(LoginDto loginDto);

    Task<Result<UserDto>> Register(RegisterUserDto userDto);

    Task<Result> Logout(RefreshTokenDto tokenDto);

    Task<Result<SuccessfulLoginDto>> RefreshToken(RefreshTokenDto tokenDto);
}