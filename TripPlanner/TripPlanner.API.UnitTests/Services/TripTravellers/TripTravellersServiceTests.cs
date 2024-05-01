using Moq;
using System.Linq.Expressions;
using System.Net.Mail;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.Email;
using TripPlanner.API.Services.Trips;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.UnitTests.Services.TripTravellers;

public class TripTravellersServiceTests
{
    private readonly Mock<IRepository<Trip>> _tripRepositoryMock;
    private readonly Mock<IRepository<AppUser>> _appUserRepositoryMock;
    private readonly Mock<IRepository<Notification>> _notificationRepositoryMock;
    private readonly Mock<IRepository<Traveller>> _travellerRepositoryMock;
    private readonly Mock<IRepository<TripInformationShare>> _tripInformationShareRepositoryMock;
    private readonly Mock<IEmailService> _emailServiceMock;

    private readonly TripTravellersService _service;

    public TripTravellersServiceTests()
    {
        _tripRepositoryMock = new Mock<IRepository<Trip>>();
        _appUserRepositoryMock = new Mock<IRepository<AppUser>>();
        _notificationRepositoryMock = new Mock<IRepository<Notification>>();
        _travellerRepositoryMock = new Mock<IRepository<Traveller>>();
        _tripInformationShareRepositoryMock = new Mock<IRepository<TripInformationShare>>();
        _emailServiceMock = new Mock<IEmailService>();

        _service = new TripTravellersService(_tripRepositoryMock.Object, _appUserRepositoryMock.Object, _travellerRepositoryMock.Object, _notificationRepositoryMock.Object, _tripInformationShareRepositoryMock.Object, _emailServiceMock.Object);
    }

    [Fact]
    public void GetTravellers_ShouldReturnTravellersWithPermissions()
    {
        var tripId = Guid.NewGuid();
        var userId = "user123";

        var travellers = new List<Traveller>
        {
            new Traveller { UserId = "user123", Status = TravellerStatus.Joined, Permissions = TripPermissions.Administrator, User = new AppUser { Email = "user1@example.com", Name = "John", Surname = "Doe" } },
            new Traveller { UserId = "user456", Status = TravellerStatus.Invited, Permissions = TripPermissions.View, User = new AppUser { Email = "user2@example.com", Name = "Jane", Surname = "Smith" } },
        };

        var trip = new Trip { Id = tripId, Travellers = travellers };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .Returns(new List<Trip> { trip }.AsQueryable());

        var result = _service.GetTravellers(tripId, userId);

        Assert.NotNull(result);
        var expectedUserPermissions = travellers.FirstOrDefault(t => t.UserId == userId)?.Permissions ?? TripPermissions.Administrator;
        Assert.Equal(expectedUserPermissions, result.RequesterPermissions);
    }

    [Fact]
    public async Task InviteTripTraveller_Sends_Invitations_And_Updates_Travellers()
    {
        var tripId = Guid.NewGuid();
        var userId = "user123";

        var invitationDto = new TravellerInvitationDto(new List<string> { "user1@example.com", "user2@example.com" }, "Join us on this trip", TripPermissions.View);

        var trip = new Trip
        {
            Id = tripId,
            Travellers = new List<Traveller>
            {
                new Traveller { UserId = "user456", Email = "user3@example.com" },
            }
        };

        var invitedUsers = new List<AppUser>
        {
            new AppUser { Id = "user1", Email = "user1@example.com" },
            new AppUser { Id = "user2", Email = "user2@example.com" }
        };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .Returns(new List<Trip> { trip }.AsQueryable());



        _appUserRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
                              .ReturnsAsync(invitedUsers);

        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
            .ReturnsAsync(new AppUser { Name = "FirstName", Surname = "SecondName" });

        _notificationRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Notification, bool>>>()))
                                    .ReturnsAsync((Notification)null);

        _tripRepositoryMock.Setup(repo => repo.Update(It.IsAny<Trip>()))
                           .Returns(Task.CompletedTask);

        _emailServiceMock.Setup(service => service.SendEmailAsync(It.IsAny<MailMessage>(), It.IsAny<string>()))
                         .Returns(Task.CompletedTask);

        await _service.InviteTripTraveller(tripId, invitationDto, userId);

        _notificationRepositoryMock.Verify(repo => repo.Create(It.IsAny<Notification>()), Times.Exactly(2));
        _emailServiceMock.Verify(service => service.SendEmailAsync(It.IsAny<MailMessage>(), "user1@example.com"), Times.Once());
        _emailServiceMock.Verify(service => service.SendEmailAsync(It.IsAny<MailMessage>(), "user2@example.com"), Times.Once());
    }

    [Fact]
    public async Task UpdateTravellerInformation_Updates_Traveller_Information()
    {
        var tripId = Guid.NewGuid();
        var travellerId = Guid.NewGuid();
        var userId = "user123";

        var dto = new UpdateTravellerInfoDto(TripPermissions.View);

        var requesterTraveller = new Traveller
        {
            UserId = userId,
            Permissions = TripPermissions.Administrator,
            TripId = tripId
        };

        var traveller = new Traveller
        {
            Id = travellerId,
            Permissions = TripPermissions.View
        };

        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.UserId == userId && t.TripId == tripId))
                                 .ReturnsAsync(requesterTraveller);

        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.Id == travellerId))
                                 .ReturnsAsync(traveller);

        _travellerRepositoryMock.Setup(repo => repo.Update(It.IsAny<Traveller>()))
                                 .Returns(Task.CompletedTask);

        await _service.UpdateTravellerInformation(tripId, travellerId, dto, userId);

        _travellerRepositoryMock.Verify(repo => repo.Update(traveller), Times.Once());
    }

    [Fact]
    public async Task UpdateTripStatus_Accepts_Invitation()
    {
        var notificationId = Guid.NewGuid();
        var userId = "user123";
        var dto = new UpdateInvitationDto(InvitationUpdateStatus.Accepted);

        var notification = new Notification { Id = notificationId, UserId = userId, TripId = Guid.NewGuid() };
        var traveller = new Traveller { UserId = userId, TripId = notification.TripId.Value };

        _notificationRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.Id == notificationId))
                                   .ReturnsAsync(notification);

        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.UserId == userId && t.TripId == notification.TripId))
                                 .ReturnsAsync(traveller);

        _travellerRepositoryMock.Setup(repo => repo.Update(It.IsAny<Traveller>()))
                                 .Returns(Task.CompletedTask);

        _tripInformationShareRepositoryMock.Setup(repo => repo.Create(It.IsAny<TripInformationShare>()));

        _notificationRepositoryMock.Setup(repo => repo.Delete(It.IsAny<Notification>()))
                                   .Returns(Task.CompletedTask);

        await _service.UpdateTripStatus(notificationId, dto, userId);

        _travellerRepositoryMock.Verify(repo => repo.Update(traveller), Times.Once());
        _tripInformationShareRepositoryMock.Verify(repo => repo.Create(It.IsAny<TripInformationShare>()), Times.Once());
        _notificationRepositoryMock.Verify(repo => repo.Delete(notification), Times.Once());
    }

    [Fact]
    public async Task UpdateTripStatus_Rejects_Invitation()
    {
        var notificationId = Guid.NewGuid();
        var userId = "user123";
        var dto = new UpdateInvitationDto(InvitationUpdateStatus.Declined);

        var notification = new Notification { Id = notificationId, UserId = userId, TripId = Guid.NewGuid() };
        var traveller = new Traveller { UserId = userId, TripId = notification.TripId.Value };

        _notificationRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.Id == notificationId))
                                   .ReturnsAsync(notification);

        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(t => t.UserId == userId && t.TripId == notification.TripId))
                                 .ReturnsAsync(traveller);

        _notificationRepositoryMock.Setup(repo => repo.Delete(It.IsAny<Notification>()))
                                   .Returns(Task.CompletedTask);

        _travellerRepositoryMock.Setup(repo => repo.Delete(It.IsAny<Traveller>()))
                                 .Returns(Task.CompletedTask);

        await _service.UpdateTripStatus(notificationId, dto, userId);

        _notificationRepositoryMock.Verify(repo => repo.Delete(notification), Times.Once());
        _travellerRepositoryMock.Verify(repo => repo.Delete(traveller), Times.Once());
    }

    [Fact]
    public async Task RemoveTravellerFromTrip_Removes_Traveller_And_Notification()
    {
        var tripId = Guid.NewGuid();
        var userToDeleteEmail = "user@example.com";
        var userId = Guid.NewGuid().ToString();

        var trip = new Trip { Id = tripId };
        var traveller = new Traveller { UserId = userId, TripId = tripId };
        var user = new AppUser { Id = userId, UserName = userToDeleteEmail };
        var notification = new Notification { TripId = tripId, UserId = userId };

        _tripRepositoryMock.Setup(repo => repo.FindByCondition(It.IsAny<Expression<Func<Trip, bool>>>()))
                           .Returns(new List<Trip> { trip }.AsQueryable());

        _appUserRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<AppUser, bool>>>()))
                              .ReturnsAsync(user);

        _travellerRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Traveller, bool>>>()))
                                 .ReturnsAsync(traveller);

        _travellerRepositoryMock.Setup(repo => repo.Delete(It.IsAny<Traveller>()))
                                 .Returns(Task.CompletedTask);

        _notificationRepositoryMock.Setup(repo => repo.GetFirstOrDefaultAsync(It.IsAny<Expression<Func<Notification, bool>>>()))
                                    .ReturnsAsync(notification);

        _notificationRepositoryMock.Setup(repo => repo.Delete(It.IsAny<Notification>()))
                                    .Returns(Task.CompletedTask);

        await _service.RemoveTravellerFromTrip(tripId, userToDeleteEmail);

        _travellerRepositoryMock.Verify(repo => repo.Delete(traveller), Times.Once());
        _notificationRepositoryMock.Verify(repo => repo.Delete(notification), Times.Once());
    }
}