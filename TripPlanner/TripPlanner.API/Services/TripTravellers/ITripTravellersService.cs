using TripPlanner.API.Dtos.Notifications;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers;

public interface ITripTravellersService
{
    TravellersDto GetTravellers(Guid tripId, string userId);

    Task InviteTripTraveller(Guid tripId, TravellerInvitationDto invitationDto, string userId);

    Task UpdateTravellerInformation(Guid tripId, Guid travellerId, UpdateTravellerInfoDto dto, string userId);

    Task UpdateTripStatus(Guid notificationId, UpdateInvitationDto dto, string userId);

    Task RemoveTravellerFromTrip(Guid tripId, string userToDeleteEmail);
}