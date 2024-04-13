using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPlaceRecommendations;
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

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetTripPlaceRecommendations()
    {
        var recommendations = await _tripPlaceRecommendationService.GetRecommendations(new TripPlaceRecommendationRequestDto(500, -122.3965, 37.7937, 0.5, 0.5, 0.5, new List<RecommendationCategories> { RecommendationCategories.Restaurant, RecommendationCategories.Supermarket }));

        return Ok(recommendations);
    }
}