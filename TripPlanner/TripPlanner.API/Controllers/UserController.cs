using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.User;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("user/information")]
    [Authorize]
    public IActionResult GetUserInformation()
    {   
        var userInformation = _userService.GetUserInformation(User.GetUserId());

        return Ok(userInformation);
    }
}