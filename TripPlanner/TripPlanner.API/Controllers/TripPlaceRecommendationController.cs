using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPLaceRecommendations;

namespace TripPlanner.API.Controllers;

[Route("api/v1/")]
[ApiController]
public class TripPlaceRecommendationController : ControllerBase
{
    private readonly ITripPlaceRecommendationService _tripPlaceRecommendationService;

    public TripPlaceRecommendationController(ITripPlaceRecommendationService tripPlaceRecommendationService)
    {
        _tripPlaceRecommendationService = tripPlaceRecommendationService;
    }

    [HttpPost("recommendations")]
    public async Task<IActionResult> GetTripPlaceRecommendations([FromBody] TripPlaceRecommendationRequestDto dto)
    {
        var recommendations = await _tripPlaceRecommendationService.GetRecommendations(dto);
        return Ok(recommendations);
    }
}