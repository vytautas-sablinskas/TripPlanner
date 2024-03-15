using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.Trips;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [HttpGet]
    [Route("trips")]
    [Authorize]
    public async Task<IActionResult> GetTrips([FromQuery] TripFilter filter, [FromQuery] int page)
    {
        var trips = await _tripService.GetUserTrips(User.GetUserId(), filter, page);

        return Ok(trips);
    }

    [HttpPost]
    [Route("trips")]
    [Authorize]
    public async Task<IActionResult> CreateTrip([FromForm] CreateTripDto tripDto)
    {
        var tripId = await _tripService.CreateNewTrip(tripDto, tripDto.Image, User.GetUserId());

        return Ok(tripId);
    }
}