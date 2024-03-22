using Microsoft.AspNetCore.Mvc;
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
    public IActionResult GetTravellers(Guid tripId)
    {
        var travellerDtos = _tripTravellersService.GetTravellers(tripId);

        return Ok(travellerDtos);
    }
}