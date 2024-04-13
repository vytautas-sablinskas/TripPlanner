using Newtonsoft.Json;
using System.Text;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripPlaceRecommendations;

namespace TripPlanner.API.Services.TripPLaceRecommendations;

public class TripPlaceRecommendationService : ITripPlaceRecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _googleApiKey;

    public TripPlaceRecommendationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _googleApiKey = _configuration["Google:Key"];
    }

    public async Task<IEnumerable<CategoryRecommendation>> GetRecommendations(TripPlaceRecommendationRequestDto dto)
    {
        _httpClient.DefaultRequestHeaders.Add("X-Goog-Api-Key", _googleApiKey);
        _httpClient.DefaultRequestHeaders.Add("X-Goog-FieldMask", "places.rating,places.userRatingCount,places.priceLevel,places.types,places.googleMapsUri,places.photos.name");

        var allCategoryRecommendations = new List<CategoryRecommendation>();
        foreach (var category in dto.Categories)
        {
            var response = await FetchPlacesByCategory(dto, category);
            if (response == null || !response.Places.Any())
            {
                continue;
            }

            var recommendations = GenerateRecommendations(response.Places);
            allCategoryRecommendations.Add(new CategoryRecommendation
            {
                Category = category.ToString(),
                Recommendations = recommendations
            });
        }

        // await FetchAndAssignPhotos(allCategoryRecommendations);

        return allCategoryRecommendations;
    }

    private async Task<PlacesResponse?> FetchPlacesByCategory(TripPlaceRecommendationRequestDto dto, RecommendationCategories category)
    {
        var requestUrl = "https://places.googleapis.com/v1/places:searchNearby";
        var categoryFormatted = category.ToString().FormatCategoryToLowerCasesSeparatedByUnderscore();

        try
        {
            var jsonPayload = @$"
            {{
                ""includedTypes"": [""{categoryFormatted}""],
                ""maxResultCount"": 10,
                ""rankPreference"": ""DISTANCE"",
                ""locationRestriction"": {{
                    ""circle"": {{
                        ""center"": {{
                            ""latitude"": {dto.Latitude},
                            ""longitude"": {dto.Longitude}
                        }},
                        ""radius"": {dto.Radius}
                    }}
                }}
            }}";

            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(requestUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var placesResponse = JsonConvert.DeserializeObject<PlacesResponse>(responseBody);

            return placesResponse;
        }
        catch
        {
            return null;
        }
    }

    private static IEnumerable<PlaceRecommendation> GenerateRecommendations(IEnumerable<Place> places)
    {
        double maxRating = places.Max(p => p.Rating ?? 0);
        double maxUserRatingCount = places.Max(p => p.UserRatingCount ?? 0);

        double ratingWeight = 0.3;
        double userRatingCountWeight = 0.5;
        double positionWeight = 0.2;
        var totalCount = places.Count();

        var recommendations = places.Select((place, index) => new PlaceRecommendation
        {
            Place = place,
            Score = (ratingWeight * (place.Rating.GetValueOrDefault() / maxRating)) +
                    (userRatingCountWeight * (place.UserRatingCount.GetValueOrDefault() / maxUserRatingCount)) +
                    (positionWeight * CalculatePositionScoreBeforeWeight(index, totalCount)),
            PhotoUri = place.Photos.Count > 0 ? place.Photos[0].Name : null,
        }).ToList();

        recommendations = recommendations
            .OrderByDescending(r => r.Score)
            .Take(3)
            .ToList();

        return recommendations;
    }

    private static double CalculatePositionScoreBeforeWeight(int index, int totalCount)
    {
        return (totalCount - index) / (double)totalCount;
    }

    private async Task FetchAndAssignPhotos(List<CategoryRecommendation> recommendations)
    {
        _httpClient.DefaultRequestHeaders.Remove("X-Goog-FieldMask");
        _httpClient.DefaultRequestHeaders.Remove("X-Goog-Api-Key");

        try
        {
            foreach (var categoryRecommendation in recommendations)
            {
                foreach (var recommendation in categoryRecommendation.Recommendations)
                {
                    if (recommendation.PhotoUri == null) continue;

                    var requestUrl = "https://places.googleapis.com/v1/" + recommendation.PhotoUri + "/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=" + _googleApiKey;

                    var response = await _httpClient.GetAsync(requestUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        recommendation.PhotoUri = null;
                        return;
                    }

                    var responseBody = await response.Content.ReadAsStringAsync();
                    var placePhotoResponse = JsonConvert.DeserializeObject<PlacePhotoResponse>(responseBody);

                    if (placePhotoResponse != null)
                    {
                        recommendation.PhotoUri = placePhotoResponse.PhotoUri;
                    }
                }
            }
        } catch
        {

        }
    }
}