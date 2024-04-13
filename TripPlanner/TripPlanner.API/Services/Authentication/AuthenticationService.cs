using Microsoft.AspNetCore.Identity;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Roles;
using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Utils;

namespace TripPlanner.API.Services.Authentication;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthenticationService(UserManager<AppUser> userManager, IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<Result<SuccessfulLoginWithUserInfoDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
            return new Result<SuccessfulLoginWithUserInfoDto>(Success: false, Message: "Username or password is invalid", Data: null);

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid)
            return new Result<SuccessfulLoginWithUserInfoDto>(Success: false, Message: "Username or password is invalid", Data: null);

        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, refreshToken) = _jwtTokenService.CreateTokens(user.UserName, user.Id, roles);

        return new Result<SuccessfulLoginWithUserInfoDto>(Success: true, Message: "", Data: new SuccessfulLoginWithUserInfoDto(accessToken, refreshToken, user.Id));
    }

    public async Task<Result<UserDto>> Register(RegisterUserDto userDto)
    {
        var user = await _userManager.FindByEmailAsync(userDto.Email);
        if (user != null)
            return new Result<UserDto>(Success: false, Message: "Email is already taken!", Data: null);

        var newUser = new AppUser
        {
            UserName = userDto.Email,
            Email = userDto.Email,
            Name = userDto.Name,
            Surname = userDto.Surname,
            PhotoUri = "/avatar-placeholder.png",
        };

        var createdResult = await _userManager.CreateAsync(newUser, userDto.Password);
        if (!createdResult.Succeeded)
            return new Result<UserDto>(Success: false, Message: "Unexpected error. Try again later!", Data: null);

        await _userManager.AddToRoleAsync(newUser, UserRoles.User);

        return new Result<UserDto>(Success: true, Message: "", Data: new UserDto(newUser.Id, newUser.UserName, newUser.Email));
    }

    public Result Logout(RefreshTokenDto tokenDto)
    {
        if (string.IsNullOrEmpty(tokenDto.RefreshToken))
            return new Result(Success: false, Message: "Refresh token is required.");

        var tokenWasRevoked = _jwtTokenService.RevokeToken(tokenDto.RefreshToken);
        if (!tokenWasRevoked)
            return new Result(Success: false, Message: "Invalid token or token not found.");

        return new Result(Success: true, Message: "Successfully logged out.");
    }

    public async Task<Result<SuccessfulLoginDto>> RefreshToken(RefreshTokenDto tokenDto)
    {
        if (string.IsNullOrEmpty(tokenDto.RefreshToken))
            return new Result<SuccessfulLoginDto>(Success: false, Message: "Refresh token is required.", Data: null);

        var refreshedTokens = await _jwtTokenService.RefreshTokensAsync(_userManager, tokenDto.RefreshToken);

        if (refreshedTokens == null)
            return new Result<SuccessfulLoginDto>(Success: false, Message: "Invalid or expired refresh token", Data: null);

        var refreshedInformation = new SuccessfulLoginDto(AccessToken: refreshedTokens.Value.AccessToken,
                                       RefreshToken: refreshedTokens.Value.RefreshToken);

        return new Result<SuccessfulLoginDto>(Success: true, Message: "", Data: refreshedInformation);
    }
}