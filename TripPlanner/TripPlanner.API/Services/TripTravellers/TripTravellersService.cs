using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripTravellers;

public class TripTravellersService : ITripTravellersService
{
    private readonly IRepository<Trip> _tripRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<Traveller> _travellerRepository;

    public TripTravellersService(IRepository<Trip> tripRepository, IRepository<AppUser> appUserRepository, IRepository<Traveller> travellerRepository, IRepository<Notification> notificationRepository)
    {
        _tripRepository = tripRepository;
        _appUserRepository = appUserRepository;
        _travellerRepository = travellerRepository;
        _notificationRepository = notificationRepository;
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

    public async Task InviteTripTraveller(Guid tripId, TravellerInvitationDto invitationDto, string userId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .Include(t => t.Travellers)
            .FirstOrDefault();

        var invitesLower = invitationDto.Invites.Select(i => i.ToLower());
        var usersToInvite = _appUserRepository
                .FindByCondition(t => invitesLower.Contains(t.UserName.ToLower()))
                .ToList();

        var updatedTravelers = trip.Travellers.ToList();
        foreach (var user in usersToInvite)
        {
            if (!trip.Travellers.Any(t => t.UserId == user.Id))
            {
                var inviter = _appUserRepository.FindByCondition(t => t.Id == userId)
                    .FirstOrDefault();

                updatedTravelers.Add(new Traveller
                {
                    User = user,
                    Permissions = invitationDto.Permissions,
                    Status = TravellerStatus.Invited,
                    UserId = user.Id,
                });

                var notification = new Notification()
                {
                    Message = invitationDto.Message,
                    Title = $"Invitation to trip from {inviter.Name} {inviter.Surname}",
                    TripId = tripId,
                    User = user,
                    UserId = user.Id,
                };

                _notificationRepository.Create(notification);
            }
        }

        
        trip.Travellers = updatedTravelers;
        await _tripRepository.Update(trip);
    }

    public void JoinTrip()
    {

    }

    public async Task RemoveTravellerFromTrip(Guid tripId, string userToDeleteEmail)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .Include(t => t.Travellers)
            .FirstOrDefault();

        var user = _appUserRepository.FindByCondition(a => a.UserName.ToLower() == userToDeleteEmail.ToLower())
            .FirstOrDefault();
        var traveller = _travellerRepository.FindByCondition(t => t.UserId == user.Id)
            .FirstOrDefault();
        if (traveller != null) 
        {
            await _travellerRepository.Delete(traveller);
        }

        var notificationFromThisTrip = _notificationRepository.FindByCondition(n => n.TripId == tripId && n.UserId == user.Id)
            .FirstOrDefault();
        if (notificationFromThisTrip != null)
        {
            await _notificationRepository.Delete(notificationFromThisTrip);
        }
    }
}