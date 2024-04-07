using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.Profile;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.Profile;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetUserInformation()
    {
        var profileInformation = await _profileService.GetUserInformation(User.GetUserId());
        if (profileInformation == null)
        {
            return BadRequest();
        }

        return Ok(profileInformation);
    }

    [HttpPut("profile/password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var isSuccess = await _profileService.ChangePassword(User.GetUserId(), dto);
        if (!isSuccess)
        {
            return BadRequest("Current password was incorrect!");
        }

        return Ok();
    }

    [HttpPut("profile/information")]
    [Authorize]
    public async Task<IActionResult> ChangeProfileInformation([FromBody] ChangeProfileInformationDto dto)
    {
        var isSuccess = await _profileService.ChangeProfileInformation(User.GetUserId(), dto);
        if (!isSuccess)
        {
            return BadRequest("Current password was incorrect!");
        }

        return Ok();
    } 
}