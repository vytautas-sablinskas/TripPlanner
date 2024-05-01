using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.Authentication;
using TripPlanner.API.Services.Authentication;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService _authService;

    public AuthenticationController(IAuthenticationService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var result = await _authService.Login(loginDto);
        if (!result.Success)
            return BadRequest(new { errorMessage = result.Message });

        return Ok(result.Data);
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterUserDto registerDto)
    {
        var result = await _authService.Register(registerDto);
        if (!result.Success)
            return BadRequest(new { errorMessage = result.Message });

        return CreatedAtAction(nameof(Register), result.Data);
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenDto tokenDto)
    {
        var result = await _authService.Logout(tokenDto);
        if (!result.Success)
            return BadRequest(new { errorMessage = result.Message });

        return Ok(result.Message);
    }

    [HttpPost]
    [Route("refreshToken")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto tokenDto)
    {
        var result = await _authService.RefreshToken(tokenDto);
        if (!result.Success)
            return BadRequest(new { errorMessage = result.Message });

        return Ok(result.Message);
    }
}