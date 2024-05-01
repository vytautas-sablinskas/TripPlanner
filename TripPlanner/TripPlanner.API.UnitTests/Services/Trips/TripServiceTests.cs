using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Services.Trips;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.UnitTests.Services.Trips;

public class TripServiceTests
{
    private readonly Mock<IRepository<Trip>> _tripRepositoryMock;
    private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IAzureBlobStorageService> _azureBlobStorageServiceMock;
    private readonly Mock<IRepository<TripInformationShare>> _tripInformationShareRepositoryMock;
    private readonly Mock<IRepository<TripSharePhoto>> _tripSharePhotoRepositoryMock;
    private readonly Mock<IRepository<TripDetail>> _tripDetailRepositoryMock;
    private readonly Mock<IRepository<Traveller>> _travellerRepositoryMock;
    private readonly TripService _service;

    public TripServiceTests()
    {
        _tripRepositoryMock = new Mock<IRepository<Trip>>();
        _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
        _mapperMock = new Mock<IMapper>();
        _azureBlobStorageServiceMock = new Mock<IAzureBlobStorageService>();
        _tripInformationShareRepositoryMock = new Mock<IRepository<TripInformationShare>>();
        _tripSharePhotoRepositoryMock = new Mock<IRepository<TripSharePhoto>>();
        _tripDetailRepositoryMock = new Mock<IRepository<TripDetail>>();
        _travellerRepositoryMock = new Mock<IRepository<Traveller>>();

        _service = new TripService(_tripRepositoryMock.Object, _appUserRepositoryMock.Object, _mapperMock.Object, _azureBlobStorageServiceMock.Object, _tripInformationShareRepositoryMock.Object, _tripSharePhotoRepositoryMock.Object, _tripDetailRepositoryMock.Object, _travellerRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateNewTrip_ValidInput_CreatesNewTrip()
    {
        var tripDto = new CreateTripDto("title", "description", "country", null, DateTime.UtcNow, DateTime.UtcNow);
        var userId = "user123";

        _azureBlobStorageServiceMock.Setup(service => service.UploadImageAsync(It.IsAny<IFormFile>()))
                                   .ReturnsAsync("imageUri");
        _mapperMock.Setup(mapper => mapper.Map<Trip>(tripDto))
                  .Returns(new Trip { Id = Guid.NewGuid() });
        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
                             .ReturnsAsync(new AppUser { Id = userId });
        _tripRepositoryMock.Setup(repo => repo.Create(It.IsAny<Trip>()))
                          .Returns(new Trip { Id = Guid.NewGuid() });
        _tripInformationShareRepositoryMock.Setup(repo => repo.Create(It.IsAny<TripInformationShare>()));

        var result = await _service.CreateNewTrip(tripDto, userId);

        Assert.NotEqual(Guid.Empty, result);
        _tripRepositoryMock.Verify(repo => repo.Create(It.IsAny<Trip>()), Times.Once);
        _tripInformationShareRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripInformationShare>()), Times.Once);
    }

    [Fact]
    public async Task EditTrip_With_Valid_Input_Edits_Trip()
    {
        var tripDto = new EditTripDto("title", "description", "country", new FormFile(Stream.Null, 0, 0, "testImage", "test.jpg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/jpeg"
        }, DateTime.UtcNow, DateTime.UtcNow);
        var tripId = Guid.NewGuid();
        var trip = new Trip { Id = tripId, PhotoUri = "" };

        _azureBlobStorageServiceMock.Setup(service => service.UploadImageAsync(It.IsAny<IFormFile>()))
                                   .ReturnsAsync("imageUri");
        _azureBlobStorageServiceMock.Setup(service => service.DeleteFileAsync(It.IsAny<string>()))
                                   .Returns(Task.CompletedTask);

        _mapperMock.Setup(mapper => mapper.Map(tripDto, trip));

        _tripRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
                          .ReturnsAsync(trip);
        _tripRepositoryMock.Setup(repo => repo.Update(It.IsAny<Trip>()));

        await _service.EditTrip(tripDto, tripId);

        _tripRepositoryMock.Verify(repo => repo.Update(It.IsAny<Trip>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTrip_User_Not_Administrator_Deletes_User_Traveller_Entry()
    {
        var tripId = Guid.NewGuid();
        var userId = "user1";

        var trip = new Trip { Id = tripId, PhotoUri = "/default/photo.jpg" };
        var userTraveller = new Traveller { UserId = userId, TripId = tripId, Permissions = TripPermissions.View };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                          .Returns(new[] { trip }.AsQueryable());
        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Traveller, bool>>>()))
                                 .ReturnsAsync(userTraveller);

        await _service.DeleteTrip(tripId, userId);

        _travellerRepositoryMock.Verify(repo => repo.Delete(userTraveller), Times.Once);
        _azureBlobStorageServiceMock.Verify(service => service.DeleteFileAsync(It.IsAny<string>()), Times.Never);
        _tripRepositoryMock.Verify(repo => repo.Delete(trip), Times.Never);
    }

    [Fact]
    public async Task DeleteTrip_User_Is_Administrator_Deletes_Trip_And_Photo()
    {
        var tripId = Guid.NewGuid();
        var userId = "admin1";

        var trip = new Trip { Id = tripId, PhotoUri = "/custom/photo.jpg" };
        var userTraveller = new Traveller { UserId = userId, TripId = tripId, Permissions = TripPermissions.Administrator };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                          .Returns(new[] { trip }.AsQueryable());
        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Traveller, bool>>>()))
                                 .ReturnsAsync(userTraveller);
        _azureBlobStorageServiceMock.Setup(service => service.DeleteFileAsync(It.IsAny<string>()))
                                     .Returns(Task.CompletedTask);

        await _service.DeleteTrip(tripId, userId);

        _travellerRepositoryMock.Verify(repo => repo.Delete(userTraveller), Times.Never);
        _azureBlobStorageServiceMock.Verify(service => service.DeleteFileAsync(trip.PhotoUri), Times.Once);
        _tripRepositoryMock.Verify(repo => repo.Delete(trip), Times.Once);
    }

    [Fact]
    public async Task GetTrip_ShouldReturnCorrectDto()
    {
        var tripId = Guid.NewGuid();
        var expectedTripDto = new TripDto { Id = tripId };
        var trip = new Trip { Id = tripId };

        _tripRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .ReturnsAsync(trip);
        _mapperMock.Setup(mapper => mapper.Map<TripDto>(trip))
                   .Returns(expectedTripDto);

        var result = await _service.GetTrip(tripId);

        Assert.Equal(expectedTripDto, result);
    }

    [Fact]
    public async Task GetTripTime_ShouldReturnCorrectDto()
    {
        var trip = new Trip { Id = Guid.NewGuid() };

        _tripRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .ReturnsAsync(trip);
        _mapperMock.Setup(mapper => mapper.Map<TripTimeDto>(trip))
                   .Returns(new TripTimeDto(DateTime.UtcNow, DateTime.UtcNow));

        var result = await _service.GetTripTime(trip.Id);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetTripShareInformation_Returns_Not_Null()
    {
        var tripId = Guid.NewGuid();
        var userId = "user123";

        var shareInformation = new TripInformationShare
        {
            Title = "Trip Title",
            DescriptionHtml = "Trip Description",
            Photos = new List<TripSharePhoto>
            {
                new TripSharePhoto { PhotoUri = "photo1.jpg" },
                new TripSharePhoto { PhotoUri = "photo2.jpg" }
            },
            LinkGuid = Guid.NewGuid()
        };

        _tripInformationShareRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripInformationShare, bool>>>()))
                                           .Returns(new List<TripInformationShare> { shareInformation }.AsQueryable());

        var result = await _service.GetTripShareInformation(tripId, userId);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetUserTrips_WhenGivenUpcomingFilter_ShouldReturnUpcomingTrips()
    {
        var userId = "user123";
        var filter = TripFilter.Upcoming;
        var page = 1;

        var trips = new List<Trip>
        {
            new Trip
            {
                Id = Guid.NewGuid(),
                StartDate = DateTime.MaxValue.AddDays(-1),
                EndDate = DateTime.MaxValue,
                Travellers = new List<Traveller>(),
            },
            new Trip
            {
                StartDate = DateTime.MaxValue.AddDays(-1),
                EndDate = DateTime.MaxValue
            }
        };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .Returns(trips.AsQueryable());

        _mapperMock.Setup(mapper => mapper.Map<TripDto>(It.IsAny<Trip>()))
                   .Returns(new TripDto());

        var result = await _service.GetUserTrips(userId, filter, page);

        Assert.NotNull(result);
        Assert.Equal(2, result.Trips.Count());
    }

    [Fact]
    public async Task GetUserTrips_WhenGivenPastFilter_ShouldReturnPastTrips()
    {
        var userId = "user123";
        var filter = TripFilter.Past;
        var page = 1;

        var trips = new List<Trip>
        {
            new Trip
            {
                Id = Guid.NewGuid(),
                StartDate = DateTime.MinValue,
                EndDate = DateTime.MinValue.AddDays(1),
                Travellers = new List<Traveller>(),
            },
            new Trip
            {
                StartDate = DateTime.MinValue,
                EndDate = DateTime.MinValue.AddDays(1)
            }
        };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .Returns(trips.AsQueryable());

        _mapperMock.Setup(mapper => mapper.Map<TripDto>(It.IsAny<Trip>()))
                   .Returns(new TripDto());

        var result = await _service.GetUserTrips(userId, filter, page);

        Assert.NotNull(result);
        Assert.Equal(2, result.Trips.Count());
    }

    [Fact]
    public async Task GetAllUserTrips_Returns_CorrectTrips()
    {
        var userId = "user123";

        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
                             .ReturnsAsync(new AppUser { Id = userId });

        var trips = new List<Trip>
        {
            new Trip { Id = Guid.NewGuid(), Travellers = new List<Traveller> { new Traveller { UserId = userId, Permissions = TripPermissions.Administrator } } },
        };
        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                          .Returns(trips.AsQueryable());

        var mapperMock = new Mock<IMapper>();
        mapperMock.Setup(mapper => mapper.Map<TripDto>(It.IsAny<Trip>()))
                  .Returns(new TripDto { IsCreator = false });

        var result = await _service.GetAllUserTrips(userId);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task UpdateShareTripInformation_Successfully_Updates()
    {
        var userId = "user123";
        var tripId = Guid.NewGuid();
        var dto = new UpdateTripShareInformationDto("New Title", "New description in HTML",
                                                    new List<IFormFile> { new FormFile(null, 0, 0, "image", "image.jpg") { Headers = new HeaderDictionary { { "Content-Type", "image/jpeg" } } } },
                                                    new List<string> { "existing_photo_uri.jpg" });

        var shareInformation = new TripInformationShare
        {
            UserId = userId,
            TripId = tripId,
            Title = "Old Trip Title",
            DescriptionHtml = "Old trip description",
            Photos = new List<TripSharePhoto> { new TripSharePhoto { PhotoUri = "existing_photo_uri.jpg" } }
        };

        _tripInformationShareRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripInformationShare, bool>>>()))
                                           .Returns(new List<TripInformationShare> { shareInformation }.AsQueryable());
        _tripInformationShareRepositoryMock.Setup(repo => repo.Update(It.IsAny<TripInformationShare>()))
                                           .Returns(Task.CompletedTask);

        _azureBlobStorageServiceMock.Setup(service => service.UploadImageAsync(It.IsAny<IFormFile>()))
                                   .ReturnsAsync("http://example.com/uploadedimage.jpg");
        _azureBlobStorageServiceMock.Setup(service => service.DeleteFileAsync(It.IsAny<string>()))
                                   .Returns(Task.CompletedTask);

        var result = await _service.UpdateShareTripInformation(userId, tripId, dto);

        Assert.True(result);
        Assert.Equal(dto.Title, shareInformation.Title);
        Assert.Equal(dto.DescriptionInHtml, shareInformation.DescriptionHtml);

        _azureBlobStorageServiceMock.Verify(service => service.DeleteFileAsync(It.IsAny<string>()), Times.Never());
        _azureBlobStorageServiceMock.Verify(service => service.UploadImageAsync(It.IsAny<IFormFile>()), Times.Once());
        _tripSharePhotoRepositoryMock.Verify(repo => repo.Delete(It.IsAny<TripSharePhoto>()), Times.Never());
        _tripSharePhotoRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripSharePhoto>()), Times.Exactly(2));
    }

    [Fact]
    public async Task UpdateTripShareInformationLink_Returns_New_Link()
    {
        var tripId = Guid.NewGuid();
        var userId = "user123";
        var shareInformation = new TripInformationShare
        {
            TripId = tripId,
            UserId = userId,
            LinkGuid = null
        };

        _tripInformationShareRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripInformationShare, bool>>>()))
                                            .ReturnsAsync(shareInformation);
        _tripInformationShareRepositoryMock.Setup(repo => repo.Update(It.IsAny<TripInformationShare>()))
                                            .Returns(Task.CompletedTask);

        var result = await _service.UpdateTripShareInformationLink(tripId, userId);

        Assert.NotNull(result);
        Assert.StartsWith("http://localhost:5173/trips/shared/", result);
    }

    [Fact]
    public async Task GetShareTripViewInformation_Returns_View_Information()
    {
        var linkId = Guid.NewGuid();
        var shareInformation = new TripInformationShare
        {
            LinkGuid = linkId,
            TripId = Guid.NewGuid(),
            Title = "Trip Title",
            DescriptionHtml = "Trip Description",
            Photos = new List<TripSharePhoto> { new TripSharePhoto { PhotoUri = "http://example.com/photo.jpg" } },
            User = new AppUser { Name = "John", Surname = "Doe" }
        };

        var trip = new Trip { Id = shareInformation.TripId.Value };
        var tripDetails = new List<TripDetail> { new TripDetail() };

        _tripInformationShareRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripInformationShare, bool>>>()))
                                            .Returns(new List<TripInformationShare> { shareInformation }.AsQueryable());
        _tripRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .ReturnsAsync(trip);
        _tripDetailRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
                                 .ReturnsAsync(tripDetails);
        _mapperMock.Setup(mapper => mapper.Map<TripDto>(It.IsAny<Trip>()))
                   .Returns(new TripDto());
        _mapperMock.Setup(mapper => mapper.Map<TripDetailMinimalDto>(It.IsAny<TripDetail>()))
                   .Returns(new TripDetailMinimalDto(Guid.NewGuid(), "name", Database.Enums.TripDetailTypes.Activity, "address", 1, 2, DateTime.UtcNow, DateTime.UtcNow));

        var result = await _service.GetShareTripViewInformation(linkId);

        Assert.NotNull(result);
        Assert.Equal($"{shareInformation.User.Name} {shareInformation.User.Surname}", result.UserDisplayName);
    }

}