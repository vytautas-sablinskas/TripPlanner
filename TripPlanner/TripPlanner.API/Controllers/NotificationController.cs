using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.Notifications;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ITripTravellersService _tripTravellersService;
    private readonly INotificationService _notificationService;

    public NotificationController(ITripTravellersService tripTravellersService, INotificationService notificationService)
    {
        _tripTravellersService = tripTravellersService;
        _notificationService = notificationService;
    }

    [HttpGet("notifications")]
    [Authorize]
    public async Task<IActionResult> GetUserNotifications()
    {
        var notifications = await _notificationService.GetNotifications(User.GetUserId());

        return Ok(notifications);
    }

    [HttpPost("notifications/status")]
    [Authorize]
    public async Task<IActionResult> ReadUserNotifications()
    {
        await _notificationService.ReadUserNotifications(User.GetUserId());

        return Ok();
    }

    [HttpPost("notifications/{notificationId}")]
    [Authorize]
    public async Task<IActionResult> ChangeInvitationStatus(Guid notificationId, [FromBody] UpdateInvitationDto dto)
    {
        await _tripTravellersService.UpdateTripStatus(notificationId, dto, User.GetUserId());

        return Ok();
    }
}