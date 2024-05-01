using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Roles;
using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Utils;

namespace TripPlanner.API.Services.Authentication;

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserManagerWrapper _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<Traveller> _travellerRepository;

    public AuthenticationService(IUserManagerWrapper userManager, IJwtTokenService jwtTokenService, IRepository<Notification> notificationRepository, IRepository<Traveller> travellerRepository)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _notificationRepository = notificationRepository;
        _travellerRepository = travellerRepository;
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

        var notifications = await _notificationRepository.FindByCondition(n => n.Email != null && n.Email.ToLower() == userDto.Email.ToLower())
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.UserId = newUser.Id;
            await _notificationRepository.Update(notification);
        }

        var travellers = await _travellerRepository.FindByCondition(t => t.Email.ToLower() == userDto.Email.ToLower())
            .ToListAsync();
        foreach (var traveller in travellers)
        {
            traveller.UserId = newUser.Id;
            await _travellerRepository.Update(traveller);
        }

        return new Result<UserDto>(Success: true, Message: "", Data: new UserDto(newUser.Id, newUser.UserName, newUser.Email));
    }

    public async Task<Result> Logout(RefreshTokenDto tokenDto)
    {
        if (string.IsNullOrEmpty(tokenDto.RefreshToken))
            return new Result(Success: false, Message: "Refresh token is required.");

        var tokenWasRevoked = await _jwtTokenService.RevokeToken(tokenDto.RefreshToken);
        if (!tokenWasRevoked)
            return new Result(Success: false, Message: "Invalid token or token not found.");

        return new Result(Success: true, Message: "Successfully logged out.");
    }

    public async Task<Result<SuccessfulLoginDto>> RefreshToken(RefreshTokenDto tokenDto)
    {
        if (string.IsNullOrEmpty(tokenDto.RefreshToken))
            return new Result<SuccessfulLoginDto>(Success: false, Message: "Refresh token is required.", Data: null);

        var refreshedTokens = await _jwtTokenService.RefreshTokensAsync(tokenDto.RefreshToken);

        if (refreshedTokens == null)
            return new Result<SuccessfulLoginDto>(Success: false, Message: "Invalid or expired refresh token", Data: null);

        var refreshedInformation = new SuccessfulLoginDto(AccessToken: refreshedTokens.Value.AccessToken,
                                       RefreshToken: refreshedTokens.Value.RefreshToken);

        return new Result<SuccessfulLoginDto>(Success: true, Message: "", Data: refreshedInformation);
    }
}