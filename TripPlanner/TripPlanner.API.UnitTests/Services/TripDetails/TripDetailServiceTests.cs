using AutoMapper;
using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.TripDetails;

namespace TripPlanner.API.UnitTests.Services.TripDetails;

public class TripDetailServiceTests
{
    private readonly Mock<IRepository<TripDetail>> _tripDetailsRepositoryMock;
    private readonly Mock<IRepository<Trip>> _tripRepositoryMock;
    private readonly Mock<IRepository<TripBudget>> _tripBudgetRepositoryMock;
    private readonly Mock<IRepository<Traveller>> _travellerRepositoryMock;
    private readonly Mock<IRepository<TripDocument>> _tripDocumentRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TripDetailsService _service;

    public TripDetailServiceTests()
    {
        _tripDetailsRepositoryMock = new Mock<IRepository<TripDetail>>();
        _tripRepositoryMock = new Mock<IRepository<Trip>>();
        _tripBudgetRepositoryMock = new Mock<IRepository<TripBudget>>();
        _travellerRepositoryMock = new Mock<IRepository<Traveller>>();
        _tripDocumentRepositoryMock = new Mock<IRepository<TripDocument>>();
        _mapperMock = new Mock<IMapper>();

        _service = new TripDetailsService(_tripDetailsRepositoryMock.Object, _tripRepositoryMock.Object, _tripBudgetRepositoryMock.Object, _travellerRepositoryMock.Object, _tripDocumentRepositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public void CreateTripDetail_ShouldCallRepositoryCreateMethod()
    {
        _mapperMock.Setup(v => v.Map<TripDetail>(It.IsAny<CreateTripDetailDto>()))
            .Returns(new TripDetail());

        _service.CreateTripDetail(new CreateTripDetailDto("name", TripDetailTypes.Travel, "address", "notes", "website", "phone", 23, 25, DateTime.UtcNow, DateTime.UtcNow, Guid.NewGuid()), "userId");

        _tripDetailsRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripDetail>()), Times.Once);
    }

    [Fact]
    public async Task GetUnselectedTripDetails_ShouldReturnTripDetailsMapped()
    {
        _tripDetailsRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(new List<TripDetail> { new TripDetail { } });
        _mapperMock.Setup(m => m.Map<GetEditTripDetailsDto>(It.IsAny<TripDetail>()))
            .Returns(new GetEditTripDetailsDto());

        var result = await _service.GetUnselectedTripDetails("userId");

        Assert.NotNull(result);
    }

    [Fact]
    public async Task EditTripDetail_ShouldCallCorrectDependencies()
    {
        _tripDetailsRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(new TripDetail());

        await _service.EditTripDetail(new EditTripDetailDto(Guid.NewGuid(), "", TripDetailTypes.Activity, "", "", "", "", 1, 2, DateTime.UtcNow, DateTime.UtcNow));

        _tripDetailsRepositoryMock.Verify(repo => repo.Update(It.IsAny<TripDetail>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTripDetail_RemovesTripDetailAndRelatedDocuments()
    {
        var tripDetailId = Guid.NewGuid();
        var tripDetail = new TripDetail { Id = tripDetailId };
        var documents = new[]
        {
                new TripDocument { Id = Guid.NewGuid(), TripDetailId = tripDetailId },
                new TripDocument { Id = Guid.NewGuid(), TripDetailId = tripDetailId }
            };

        _tripDetailsRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(tripDetail);
        _tripDocumentRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .ReturnsAsync(documents);

        await _service.DeleteTripDetail(tripDetailId);

        _tripDocumentRepositoryMock.Verify(repo => repo.Delete(It.IsAny<TripDocument>()), Times.Exactly(2));
        _tripDetailsRepositoryMock.Verify(repo => repo.Delete(tripDetail), Times.Once);
    }

    [Fact]
    public async Task GetTripDetails_ReturnsTripDetailsDto()
    {
        var tripId = Guid.NewGuid();
        var userId = "user123";

        var tripDetails = new List<TripDetail>
            {
                new TripDetail { Id = Guid.NewGuid(), TripId = tripId },
                new TripDetail { Id = Guid.NewGuid(), TripId = tripId }
            };
        var trip = new Trip { Id = tripId };
        var budgetIds = new List<TripBudgetMinimalDto>
            {
                new TripBudgetMinimalDto(Guid.NewGuid(), "Budget 1"),
                new TripBudgetMinimalDto(Guid.NewGuid(), "Budget 2")
            };
        var traveller = new Traveller { UserId = userId, TripId = tripId, Permissions = API.Services.TripTravellers.TripPermissions.View };

        _tripDetailsRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(tripDetails);
        _tripRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
            .ReturnsAsync(trip);
        _tripBudgetRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<TripBudget, bool>>>()))
            .Returns(new List<TripBudget> { new TripBudget { Id = Guid.NewGuid(), Name = "Budget 1" } }.AsQueryable());
        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Traveller, bool>>>()))
            .ReturnsAsync(traveller);
        _mapperMock.Setup(mapper => mapper.Map<TripDetailMinimalDto>(It.IsAny<TripDetail>()))
            .Returns(new TripDetailMinimalDto(Guid.NewGuid(), "", TripDetailTypes.Activity, "", 1, 2, DateTime.UtcNow, DateTime.UtcNow));

        var result = await _service.GetTripDetails(tripId, userId);

        Assert.NotNull(result);
        Assert.Equal(traveller.Permissions, result.TripPermissions);
        Assert.Equal(result.budgets.Count(), 1);
    }

    [Fact]
    public async Task GetTripDetailById_WithValidIds_ReturnsDto()
    {
        var tripId = Guid.NewGuid();
        var detailId = Guid.NewGuid();
        var tripStartDate = DateTime.UtcNow.AddDays(-1);
        var tripEndDate = DateTime.UtcNow.AddDays(1);

        var trip = new Trip { Id = tripId, StartDate = tripStartDate, EndDate = tripEndDate };
        var detail = new TripDetail { Id = detailId };

        var expectedDto = new GetEditTripDetailsDto();
        _mapperMock.Setup(m => m.Map<GetEditTripDetailsDto>(detail)).Returns(expectedDto);

        _tripRepositoryMock.Setup(r => r.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Trip, bool>>>()))
            .ReturnsAsync(trip);

        _tripDetailsRepositoryMock.Setup(r => r.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(detail);

        var result = await _service.GetTripDetailById(tripId, detailId);

        Assert.Equal(expectedDto, result);
    }

    [Fact]
    public async Task GetTripDetailView_WithValidIds_ReturnsTrueAndDto()
    {
        var userId = "user1";
        var tripId = Guid.NewGuid();
        var detailId = Guid.NewGuid();
        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow.AddDays(1);

        var tripDocuments = new List<TripDocument>
            {
                new TripDocument { Name = "Doc1", LinkToFile = "link1", Id = Guid.NewGuid(), IsPrivateDocument = false, TypeOfFile = "type1", CreatorId = "creator1" },
                new TripDocument { Name = "Doc2", LinkToFile = "link2", Id = Guid.NewGuid(), IsPrivateDocument = false, TypeOfFile = "Type2", CreatorId = "creator2" }
            };

        var tripDetail = new TripDetail
        {
            Id = detailId,
            Name = "Test Detail",
            Address = "address",
            PhoneNumber = "phone",
            Website = "web",
            Notes = "notes",
            Trip = new Trip { Id = tripId, StartDate = startDate, EndDate = endDate },
            Documents = tripDocuments
        };

        var travellers = new List<Traveller>
            {
                new Traveller { UserId = userId, TripId = tripId, User = new AppUser { Id = "id", Email = "email", Name = "Name", Surname = "Surname", PhotoUri = "photo" } }
            };

        var expectedDto = new TripDetailViewDto(tripDetail.Name, "", "", "", "", 0, API.Services.TripTravellers.TripPermissions.View, DateTime.UtcNow, DateTime.UtcNow, tripDocuments.Select(d => new TripDocumentDto(d.Name, d.LinkToFile, d.Id, d.TypeOfFile, d.CreatorId)), travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}", t.User.PhotoUri)));

        _tripDetailsRepositoryMock.Setup(r => r.FindByCondition(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .Returns(new List<TripDetail> { tripDetail }.AsQueryable());

        _travellerRepositoryMock.Setup(r => r.FindByCondition(It.IsAny<Expression<Func<Traveller, bool>>>()))
            .Returns(travellers.AsQueryable());

        _tripDocumentRepositoryMock.Setup(r => r.FindByCondition(It.IsAny<Expression<Func<TripDocument, bool>>>()))
            .Returns(tripDocuments.AsQueryable());

        var result = await _service.GetTripDetailView(userId, tripId, detailId);

        Assert.True(result.Item1);
        Assert.NotNull(result.Item2);
    }

    [Fact]
    public async Task AddToTripTripDetail_WithValidDto_ShouldUpdateTripDetail()
    {
        var dto = new AddToTripTripDetailDto(DateTime.UtcNow, Guid.NewGuid(), Guid.NewGuid());

        var tripDetail = new TripDetail
        {
            Id = dto.Id,
            StartTime = DateTime.UtcNow.AddDays(-1)
        };

        _tripDetailsRepositoryMock.Setup(r => r.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<TripDetail, bool>>>()))
            .ReturnsAsync(tripDetail);

        await _service.AddToTripTripDetail(dto);

        _tripDetailsRepositoryMock.Verify(r => r.Update(tripDetail), Times.Once);
    }
}