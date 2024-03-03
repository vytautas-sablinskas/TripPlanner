using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Utils;

namespace TripPlanner.API.Services.Authentication;

public interface IAuthenticationService
{
    Task<Result<SuccessfulLoginDto>> Login(LoginDto loginDto);

    Task<Result<UserDto>> Register(RegisterUserDto userDto);

    Result Logout(RefreshTokenDto tokenDto);

    Task<Result<SuccessfulLoginDto>> RefreshToken(RefreshTokenDto tokenDto);
}