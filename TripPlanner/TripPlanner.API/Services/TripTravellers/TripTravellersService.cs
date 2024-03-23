using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers;

public class TripTravellersService : ITripTravellersService
{
    private readonly IRepository<Trip> _tripRepository;

    public TripTravellersService(IRepository<Trip> tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public TravellersDto GetTravellers(Guid tripId, string userId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .Include(t => t.Travellers)
                .ThenInclude(traveller => traveller.User)
            .FirstOrDefault();

        var travellerDtos = trip.Travellers.Select(t => new TravellerDto
        {
            Email = t.User.Email,
            FullName = $"{t.User.Name} {t.User.Surname}",
            Status = t.Status,
            Permissions = t.Permissions
        });

        var userPermissions = trip.Travellers
            .Where(t => t.UserId == userId)
            .Select(t => t.Permissions)
            .FirstOrDefault();

        return new TravellersDto(travellerDtos, userPermissions);
    }

    public void InviteTripTraveller()
    {

    }

    public void JoinTrip()
    {

    }

    public void RemoveFromTrip()
    {

    }
}