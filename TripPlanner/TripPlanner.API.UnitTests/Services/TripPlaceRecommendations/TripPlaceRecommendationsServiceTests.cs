using Microsoft.Extensions.Configuration;
using Moq;
using Newtonsoft.Json;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPlaceRecommendations;
using TripPlanner.API.Services.TripPLaceRecommendations;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.TripPlaceRecommendations;

public class TripPlaceRecommendationsServiceTests
{
    private readonly Mock<IHttpClientWrapper> _httpClientMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Mock<IRepository<RecommendationWeight>> _recommendationWeightRepositoryMock;
    private readonly TripPlaceRecommendationService _service;

    public TripPlaceRecommendationsServiceTests()
    {
        _httpClientMock = new Mock<IHttpClientWrapper>();
        _configurationMock = new Mock<IConfiguration>();
        _recommendationWeightRepositoryMock = new Mock<IRepository<RecommendationWeight>>();

        _service = new TripPlaceRecommendationService(
            _httpClientMock.Object,
            _configurationMock.Object,
            _recommendationWeightRepositoryMock.Object
        );
    }

    [Fact]
    public async Task GetRecommendations_GivenValidInput_ShouldReturnRecommendations()
    {
        var dto = new TripPlaceRecommendationRequestDto(5000, 456.2, 412.2, "RatingNotImportant", "RatingCountNotImportant", "DistanceImportant", new List<RecommendationCategories> { RecommendationCategories.Restaurant }, GooglePriceLevel.FREE);

        var mockResponse = new List<Place>
        {
            new Place
            {
                Types = new List<string> { "restaurant" },
                GoogleMapsUri = "https://maps.google.com",
                Rating = 4.2,
                PriceLevel = "PRICE_LEVEL_EXPENSIVE",
                UserRatingCount = 120,
                Photos = new List<PhotosField> { new PhotosField { Name = "photo1.jpg" } },
                PrimaryFieldType = new PrimaryFieldType { Type = "restaurant" },
                DisplayName = new PlaceDisplayName { Text = "Restaurant A" },
                OpeningHours = new OpeningHoursField { WeekdayDescriptions = new List<string> { "Monday-Friday: 8AM-10PM", "Saturday-Sunday: 9AM-11PM" } },
                Location = new LocationField { Latitude = 40.7128, Longitude = -74.0060 },
                FormattedAddress = "123 Main St, New York, NY 10001",
                WebsiteUri = "https://www.restaurantA.com",
                InternationalPhoneNumber = "+1 123-456-7890"
            },
            new Place
            {
                Types = new List<string> { "cafe" },
                GoogleMapsUri = "https://maps.google.com",
                Rating = 4.5,
                PriceLevel = "PRICE_LEVEL_VERY_EXPENSIVE",
                UserRatingCount = 80,
                Photos = new List<PhotosField> { new PhotosField { Name = "photo2.jpg" } },
                PrimaryFieldType = new PrimaryFieldType { Type = "cafe" },
                DisplayName = new PlaceDisplayName { Text = "Cafe B" },
                OpeningHours = new OpeningHoursField { WeekdayDescriptions = new List<string> { "Monday-Friday: 7AM-8PM", "Saturday-Sunday: 8AM-7PM" } },
                Location = new LocationField { Latitude = 34.0522, Longitude = -118.2437 },
                FormattedAddress = "456 Elm St, Los Angeles, CA 90001",
                WebsiteUri = "https://www.cafeB.com",
                InternationalPhoneNumber = "+1 987-654-3210"
            },
        };

        var placesResponse = new PlacesResponse { Places = mockResponse };

        _httpClientMock.Setup(x => x.PostAsync(It.IsAny<string>(), It.IsAny<StringContent>()))
            .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(placesResponse))
            });

        _recommendationWeightRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<RecommendationWeight, bool>>>()))
            .ReturnsAsync(new RecommendationWeight { Name = "RatingNotImportant", Value = 25 });
        _recommendationWeightRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<RecommendationWeight, bool>>>()))
            .ReturnsAsync(new RecommendationWeight { Name = "RatingCountNotImportant", Value = 35 });
        _recommendationWeightRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<RecommendationWeight, bool>>>()))
            .ReturnsAsync(new RecommendationWeight { Name = "DistanceImportant", Value = 70 });

        var responseBody = @"{""PhotoUri"":""updated_photo_uri""}";
        var httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(responseBody)
        };
        _httpClientMock.SetupSequence(x => x.GetAsync(It.IsAny<string>()))
            .ReturnsAsync(httpResponseMessage)
            .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.NotFound));

        var recommendations = await _service.GetRecommendations(dto);

        var firstRecommendation = recommendations.FirstOrDefault();
        Assert.NotNull(recommendations);
        Assert.True(recommendations.Count() == 1);
        Assert.NotNull(firstRecommendation);
        Assert.True(firstRecommendation.Recommendations.Count() == 2);
    }

    [Fact]
    public async Task GetRecommendationWeights_WhenNoWeightsFound_ReturnDefaultOnes()
    {
        _recommendationWeightRepositoryMock.Setup(repo => repo.FindAll())
            .ReturnsAsync(new List<RecommendationWeight>());

        var result = await _service.GetRecommendationWeights();

        Assert.True(result.Count() == 11);
    }

    [Fact]
    public async Task GetRecommendationWeights_WhenWeightsExist_ShouldReturnWeightsFromRepository()
    {
        var weightsInRepo = new List<RecommendationWeight>
        {
            new RecommendationWeight { Name = "RatingNotImportant", Value = 50 },
            new RecommendationWeight { Name = "RatingModeratelyImportant", Value = 70 },
        };
        
        _recommendationWeightRepositoryMock.Setup(repo => repo.FindAll()).ReturnsAsync(weightsInRepo);

        var result = await _service.GetRecommendationWeights();

        Assert.Equal(weightsInRepo.Count, result.Count());
        Assert.All(result, weightDto =>
        {
            var weightInRepo = weightsInRepo.FirstOrDefault(w => w.Name == weightDto.Name);
            Assert.NotNull(weightInRepo);
            Assert.Equal(weightInRepo.Value, weightDto.Value);
        });
    }

    [Fact]
    public async Task EditRecommendationWeights_WhenWeightDoesntExist_ShouldCreateNewOnes()
    {
        var dto = new EditTripRecommendationDto(new List<RecommendationWeightDto>
            {
                new RecommendationWeightDto { Name = "RatingNotImportant", Value = 30 },
            });

        _recommendationWeightRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<RecommendationWeight, bool>>>()))
                                          .ReturnsAsync((RecommendationWeight)null);

        await _service.EditRecommendationWeights(dto);

        _recommendationWeightRepositoryMock.Verify(repo => repo.Create(It.IsAny<RecommendationWeight>()), Times.Exactly(dto.RecommendationWeights.Count()));
        _recommendationWeightRepositoryMock.Verify(repo => repo.Update(It.IsAny<RecommendationWeight>()), Times.Never);
    }

    [Fact]
    public async Task EditRecommendationWeights_WhenWeightsAlreadyExists_ShouldUpdateThem()
    {
        var existingWeight = new RecommendationWeight { Name = "RatingNotImportant", Value = 50 };
        var dto = new EditTripRecommendationDto(new List<RecommendationWeightDto>
            {
                new RecommendationWeightDto { Name = "RatingNotImportant", Value = 30 },
            });

        _recommendationWeightRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<RecommendationWeight, bool>>>()))
                                          .ReturnsAsync(existingWeight);

        await _service.EditRecommendationWeights(dto);

        _recommendationWeightRepositoryMock.Verify(repo => repo.Create(It.IsAny<RecommendationWeight>()), Times.Never);
        _recommendationWeightRepositoryMock.Verify(repo => repo.Update(It.IsAny<RecommendationWeight>()), Times.Exactly(dto.RecommendationWeights.Count()));
    }
}