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

    [HttpGet("trips")]
    [Authorize]
    public async Task<IActionResult> GetTrips([FromQuery] TripFilter filter, [FromQuery] int page)
    {
        var trips = await _tripService.GetUserTrips(User.GetUserId(), filter, page);

        return Ok(trips);
    }

    [HttpGet("trips/{id}")]
    [Authorize]
    public IActionResult GetTrip(Guid id)
    {
        var tripDto = _tripService.GetTrip(id);

        return Ok(tripDto);
    }

    [HttpGet("trips/{id}/shareInformation")]
    [Authorize]
    public async Task<IActionResult> GetTripShareInformation(Guid id)
    {
        var shareInformationDto = await _tripService.GetTripShareInformation(id, User.GetUserId());

        return Ok(shareInformationDto);
    }

    [HttpPut("trips/{id}/shareInformation")]
    [Authorize]
    public async Task<IActionResult> UpdateTripShareInformation(Guid id, [FromForm] UpdateTripShareInformationDto dto)
    {
        await _tripService.UpdateShareTripInformation(User.GetUserId(), id, dto);

        return Ok();
    }

    [HttpPost("trips/{id}/shareInformation/link")]
    [Authorize]
    public async Task<IActionResult> UpdateTripShareInformationLink(Guid id)
    {
        var guid = await _tripService.UpdateTripShareInformationLink(id, User.GetUserId());

        return Ok(new { link = guid });
    }

    [HttpGet("trips/{id}/time")]
    [Authorize]
    public IActionResult GetTripTime(Guid id)
    {
        var timeDto = _tripService.GetTripTime(id);

        return Ok(timeDto);
    }

    [HttpPut("trips/{id}")]
    [Authorize]
    public async Task<IActionResult> EditTrip(Guid id, [FromForm] EditTripDto editDto)
    {
        await _tripService.EditTrip(editDto, id);

        return Ok();
    }

    [HttpDelete("trips/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteTrip(Guid id)
    {
        await _tripService.DeleteTrip(id);

        return NoContent();
    }

    [HttpPost("trips")]
    [Authorize]
    public async Task<IActionResult> CreateTrip([FromForm] CreateTripDto tripDto)
    {
        var tripId = await _tripService.CreateNewTrip(tripDto, User.GetUserId());

        return Ok(tripId);
    }
}