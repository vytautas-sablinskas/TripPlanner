using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ITripTravellersService _tripTravellersService;

    public NotificationController(ITripTravellersService tripTravellersService)
    {
        _tripTravellersService = tripTravellersService;
    }

    [HttpPost("notifications/{notificationId}")]
    [Authorize]
    public async Task<IActionResult> ChangeInvitationStatus(Guid notificationId, UpdateInvitationDto dto)
    {
        await _tripTravellersService.UpdateTripStatus(notificationId, dto, User.GetUserId());

        return Ok();
    }
}