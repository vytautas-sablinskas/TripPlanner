using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Extensions;
using TripPlanner.API.Services.TripPlaceRecommendations;

namespace TripPlanner.API.Services.TripPLaceRecommendations;

public class TripPlaceRecommendationService : ITripPlaceRecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _googleApiKey;
    private readonly IRepository<RecommendationWeight> _recommendationWeightRepository;

    private readonly List<RecommendationWeightDto> DEFAULT_WEIGHTS = new List<RecommendationWeightDto>()
     {
            new RecommendationWeightDto { Name = "RatingNotImportant", Value = 30 },
            new RecommendationWeightDto { Name = "RatingModeratelyImportant", Value = 60 },
            new RecommendationWeightDto { Name = "RatingImportant", Value = 90 },
            new RecommendationWeightDto { Name = "RatingCountNotImportant", Value = 30 },
            new RecommendationWeightDto { Name = "RatingCountModeratelyImportant", Value = 60 },
            new RecommendationWeightDto { Name = "RatingCountImportant", Value = 90 },
            new RecommendationWeightDto { Name = "DistanceNotImportant", Value = 30 },
            new RecommendationWeightDto { Name = "DistanceModeratelyImportant", Value = 60 },
            new RecommendationWeightDto { Name = "DistanceImportant", Value = 90 },
            new RecommendationWeightDto { Name = "Price", Value = 20 },
            new RecommendationWeightDto { Name = "NoPriceFound", Value = 50 }
     };

    public TripPlaceRecommendationService(HttpClient httpClient, IConfiguration configuration, IRepository<RecommendationWeight> recommendationWeightRepository)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _googleApiKey = _configuration["Google:Key"];
        _recommendationWeightRepository = recommendationWeightRepository;
    }

    public async Task<IEnumerable<CategoryRecommendation>> GetRecommendations(TripPlaceRecommendationRequestDto dto)
    {
        _httpClient.DefaultRequestHeaders.Add("X-Goog-Api-Key", _googleApiKey);
        _httpClient.DefaultRequestHeaders.Add("X-Goog-FieldMask", "places.rating,places.userRatingCount,places.priceLevel,places.types,places.googleMapsUri,places.photos.name,places.displayName.text,places.formattedAddress,places.internationalPhoneNumber,places.primaryTypeDisplayName.text,places.regularOpeningHours.weekdayDescriptions,places.websiteUri,places.location");

        var allCategoryRecommendations = new List<CategoryRecommendation>();
        foreach (var category in dto.Categories)
        {
            var response = await FetchPlacesByCategory(dto, category);
            if (response == null || !response.Places.Any())
            {
                allCategoryRecommendations.Add(new CategoryRecommendation
                {
                    Category = category.ToString(),
                    Recommendations = new List<PlaceRecommendation>()
                });

                continue;
            }

            var recommendations = await GenerateRecommendations(response.Places, dto, category);
            allCategoryRecommendations.Add(new CategoryRecommendation
            {
                Category = category.ToString(),
                Recommendations = recommendations
            });
        }

        await FetchAndAssignPhotos(allCategoryRecommendations);

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
                ""maxResultCount"": 20,
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
            if (string.IsNullOrEmpty(responseBody))
            {
                return null;
            }

            var placesResponse = JsonConvert.DeserializeObject<PlacesResponse>(responseBody);

            return placesResponse;
        }
        catch
        {
            return null;
        }
    }

    private async Task<IEnumerable<PlaceRecommendation>> GenerateRecommendations(IEnumerable<Place> places, TripPlaceRecommendationRequestDto dto, RecommendationCategories mainCategory)
    {
        var ratingPlacesOrdered = places.OrderByDescending(r => r.Rating).ToList();
        var ratingCountPlacesOrdered = places.OrderByDescending(r => r.UserRatingCount).ToList();
        var mainCategoryFormatted = mainCategory.ToString().SeparateByUpperAndAddSpaces();
        var ratingWeightRecommendation = await _recommendationWeightRepository.FindByCondition(t => t.Name == dto.RatingWeight)
            .FirstOrDefaultAsync();
        var ratingCountWeightRecommendation = await _recommendationWeightRepository.FindByCondition(t => t.Name == dto.RatingCountWeight)
            .FirstOrDefaultAsync();
        var distanceWeightRecommendation = await _recommendationWeightRepository.FindByCondition(t => t.Name == dto.DistanceWeight)
            .FirstOrDefaultAsync();

        double actualRatingWeight = ratingWeightRecommendation == null ? 0d : ratingWeightRecommendation.Value / 100d;
        double actualRatingCountWeight = ratingCountWeightRecommendation == null ? 0d : ratingCountWeightRecommendation.Value / 100d;
        double actualDistanceWeight = distanceWeightRecommendation == null ? 0d : distanceWeightRecommendation.Value / 100d;

        var totalCount = places.Count();
        var recommendations = places
            .Where(p => p.Rating > 0)
            .Select((place, index) => new PlaceRecommendation
        {
            Place = new PlaceMinimal
            {
                GoogleMapsUri = place.GoogleMapsUri,
                Rating = place.Rating,
                Types = place.Types,
                UserRatingCount = place.UserRatingCount,
                FormattedAddress = place.FormattedAddress,
                InternationalPhoneNumber = place.InternationalPhoneNumber,
                DisplayName = place.DisplayName?.Text,
                PrimaryType = place.PrimaryFieldType?.Type,
                WeekdayDescriptions = place.OpeningHours?.WeekdayDescriptions,
                Website = place.WebsiteUri,
                PriceLevel = GetPriceLevel(place.PriceLevel),
                Location = place.Location
            },
            Score = (actualRatingWeight * GetScoreFromOrderedList(ratingPlacesOrdered, place)) +
                    (actualRatingCountWeight * GetScoreFromOrderedList(ratingCountPlacesOrdered, place)) +
                    (actualDistanceWeight * CalculatePositionScoreBeforeWeight(index, totalCount)) +
                    CalculatePriceWeight(dto.PriceLevel, place.PriceLevel),
            PhotoUri = place.Photos.Count > 0 ? place.Photos[0].Name : null,
        }).ToList();

        recommendations = recommendations
            .OrderByDescending(p => p.Place.PrimaryType == mainCategoryFormatted)
            .ThenByDescending(r => r.Score)
            .Take(3)
            .ToList();

        return recommendations;
    }

    private double CalculatePriceWeight(GooglePriceLevel preferedPriceLevel, string? actualPriceLevel)
    {
        if (preferedPriceLevel == GooglePriceLevel.NO_RATING)
        {
            return 0;
        }

        if (string.IsNullOrEmpty(actualPriceLevel))
        {
            var priceWeightWhenNotFound = _recommendationWeightRepository.FindByCondition(t => t.Name == "NoPriceFound")
                .FirstOrDefault();
            if (priceWeightWhenNotFound == null)
            {
                return 0;
            }

            return priceWeightWhenNotFound.Value / (double)100;
        }

        var priceWeight = _recommendationWeightRepository.FindByCondition(t => t.Name == "Price")
            .FirstOrDefault();
        if (priceWeight == null)
        {
            return 0;
        }

        var actualPriceLevelEnum = ConvertToPriceLevelEnum(actualPriceLevel);
        var distance = Math.Abs((int)preferedPriceLevel - (int)actualPriceLevelEnum);

        var score = 1 - ((priceWeight.Value / (double)100) * distance);

        return score;
    }

    private static double GetScoreFromOrderedList(List<Place> orderedList, Place place)
    {
        var placeIndex = orderedList.FindIndex(p => p == place);

        return CalculatePositionScoreBeforeWeight(placeIndex, orderedList.Count);
    }

    private static double CalculatePositionScoreBeforeWeight(int index, int totalCount)
    {
        if (totalCount == 0) return 0;

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

    private static GooglePriceLevel ConvertToPriceLevelEnum(string? priceLevel)
    {
        if (string.IsNullOrEmpty(priceLevel))
        {
            return GooglePriceLevel.UNKNOWN;
        }

        switch (priceLevel)
        {
            case "FREE":
                    return GooglePriceLevel.FREE;
            case "PRICE_LEVEL_INEXPENSIVE":
                return GooglePriceLevel.INEXPENSIVE;
            case "PRICE_LEVEL_MODERATE":
                return GooglePriceLevel.MODERATE;
            case "PRICE_LEVEL_EXPENSIVE":
                return GooglePriceLevel.EXPENSIVE;
            case "PRICE_LEVEL_VERY_EXPENSIVE":
                return GooglePriceLevel.VERY_EXPENSIVE;
            default:
                return GooglePriceLevel.UNKNOWN;
        }
    }

    private static string GetPriceLevel(string? priceLevel)
    {
        if (string.IsNullOrEmpty(priceLevel))
        {
            return null;
        }

        switch (priceLevel)
        {
            case "FREE":
                return "Free";
            case "PRICE_LEVEL_INEXPENSIVE":
                return "Inexpensive";
            case "PRICE_LEVEL_MODERATE":
                return "Moderate";
            case "PRICE_LEVEL_EXPENSIVE":
                return "Expensive";
            case "PRICE_LEVEL_VERY_EXPENSIVE":
                return "Very Expensive";
            default:
                return null;
        }
    }

    public async Task<IEnumerable<RecommendationWeightDto>> GetRecommendationWeights()
    {
        var weights = await _recommendationWeightRepository.FindAll()
            .ToListAsync();
        foreach (var weight in DEFAULT_WEIGHTS)
        {
            var weightInRepo = await _recommendationWeightRepository.FindByCondition(t => t.Name == weight.Name)
                .FirstOrDefaultAsync();
            if (weightInRepo == null)
            {
                _recommendationWeightRepository.Create(new RecommendationWeight
                {
                    Name = weight.Name,
                    Value = weight.Value
                });
            }
        }

        if (weights == null || weights.Count == 0)
        {
            return DEFAULT_WEIGHTS;
        }

        return weights.Select(w => new RecommendationWeightDto
        {
            Name = w.Name,
            Value = w.Value
        });
    }

    public async Task EditRecommendationWeights(EditTripRecommendationDto dto)
    {
        foreach (var weight in dto.RecommendationWeights)
        {
            var weightInRepo = await _recommendationWeightRepository.FindByCondition(t => t.Name == weight.Name)
                .FirstOrDefaultAsync();
            if (weightInRepo == null)
            {
                _recommendationWeightRepository.Create(new RecommendationWeight
                {
                    Name = weight.Name,
                    Value = weight.Value
                });
            }
            else
            {
                weightInRepo.Value = weight.Value;
                await _recommendationWeightRepository.Update(weightInRepo);
            }
        }
    }
}