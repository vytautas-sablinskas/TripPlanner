using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
}