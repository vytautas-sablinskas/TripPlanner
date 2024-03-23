using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripTravellersController : ControllerBase
{
    private readonly ITripTravellersService _tripTravellersService;

    public TripTravellersController(ITripTravellersService tripTravellersService)
    {
        _tripTravellersService = tripTravellersService;
    }

    [HttpGet("trips/{tripId}/travellers")]
    [Authorize]
    public IActionResult GetTravellers(Guid tripId)
    {
        var travellersDto = _tripTravellersService.GetTravellers(tripId, User.GetUserId());

        return Ok(travellersDto);
    }

    [HttpPost("trips/{tripId}/travellers/create")]
    [Authorize]
    public async Task<IActionResult> InviteTravellerToTrip(Guid tripId, TravellerInvitationDto invitationDto)
    {
        if (invitationDto.Permissions == TripPermissions.Administrator)
        {
            return BadRequest("Invalid permissions selected");
        }

        await _tripTravellersService.InviteTripTraveller(tripId, invitationDto, User.GetUserId());

        return Ok();
    }

    [HttpDelete("trips/{tripId}/travellers/{email}")]
    [Authorize]
    public async Task<IActionResult> DeleteTraveller(Guid tripId, string email)
    {
        await _tripTravellersService.RemoveTravellerFromTrip(tripId, email);

        return NoContent();
    }
}