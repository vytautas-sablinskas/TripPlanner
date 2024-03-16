using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripDetails;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripDetailController : ControllerBase
{
    private readonly ITripDetailsService _tripDetailsService;

    public TripDetailController(ITripDetailsService tripDetailsService)
    {
        _tripDetailsService = tripDetailsService;
    }

    [HttpGet("tripDetails/{tripId}")]
    public async Task<IActionResult> GetTripDetails(Guid tripId)
    {
        var details = await _tripDetailsService.GetTripDetails(tripId);

        return Ok(details);
    }

    [HttpPost("tripDetails")]
    public IActionResult CreateTripDetail([FromBody] CreateTripDetailDto dto)
    {
        _tripDetailsService.CreateTripDetail(dto, User.GetUserId());

        return Ok();
    }   
}