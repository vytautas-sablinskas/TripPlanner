using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    [HttpGet("/profile")]
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
}