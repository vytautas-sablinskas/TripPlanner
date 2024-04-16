using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.Notifications;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.Email;

namespace TripPlanner.API.Services.TripTravellers;

public class TripTravellersService : ITripTravellersService
{
    private readonly IRepository<Trip> _tripRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<Traveller> _travellerRepository;
    private readonly IEmailService _emailService;

    public TripTravellersService(IRepository<Trip> tripRepository, IRepository<AppUser> appUserRepository, IRepository<Traveller> travellerRepository, IRepository<Notification> notificationRepository, IEmailService emailService)
    {
        _tripRepository = tripRepository;
        _appUserRepository = appUserRepository;
        _travellerRepository = travellerRepository;
        _notificationRepository = notificationRepository;
        _emailService = emailService;
    }

    public TravellersDto GetTravellers(Guid tripId, string userId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .Include(t => t.Travellers)
                .ThenInclude(traveller => traveller.User)
            .FirstOrDefault();

        var travellerDtos = trip.Travellers
            .Where(t => t.User != null)
            .Select(t => new TravellerDto
            {
                Email = t.User.Email,
                FullName = t.User != null ? $"{t.User.Name} {t.User.Surname}" : "",
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
        foreach (var email in invitationDto.Invites)
        {
            var user = usersToInvite.Find(t => t.Email == email);
            if (trip.Travellers.Any(t => user != null && t.UserId == user.Id))
            {
                continue;
            }

            var inviter = _appUserRepository.FindByCondition(t => t.Id == userId)
                    .FirstOrDefault();


            updatedTravelers.Add(new Traveller
            {
                Permissions = invitationDto.Permissions,
                Status = TravellerStatus.Invited,
                UserId = user?.Id,
                Email = email,
            });

            var presentNotification = await _notificationRepository.FindByCondition(n => n.Email != null && n.Email.ToLower() == email.ToLower() && n.TripId == tripId)
                .FirstOrDefaultAsync();

            if (presentNotification == null)
            {
                var notification = new Notification()
                {
                    Message = invitationDto.Message,
                    Title = $"Invitation to trip from {inviter.Name} {inviter.Surname}",
                    TripId = tripId,
                    UserId = user?.Id,
                    Email = email,
                    Status = NotificationStatus.Unread,
                };

                _notificationRepository.Create(notification);
            }

            if (presentNotification == null)
            {
                var message = new MailMessage
                {
                    From = new MailAddress("triplog.services@gmail.com"),
                    Subject = "[TripLog]: Invitation to trip",
                    Body = $"<h3>Invitation To Trip From {inviter.Name} {inviter.Surname}</h3><p>Message from user: {invitationDto.Message}</p><p>Click <a href='http://www.localhost:5173/notifications'>here</a> to check invitation</p>",
                    IsBodyHtml = true
                };

                await _emailService.SendEmailAsync(message, email);
            }
        }

        
        trip.Travellers = updatedTravelers;
        await _tripRepository.Update(trip);
    }

    public async Task UpdateTravellerInformation(Guid tripId, Guid travellerId, UpdateTravellerInfoDto dto, string userId)
    {
        var requester = _travellerRepository.FindByCondition(t => t.UserId == userId && t.TripId == tripId)
            .FirstOrDefault();
        if (requester is null || requester.Permissions != TripPermissions.Administrator)
        {
            return;
        }

        var traveller = _travellerRepository.FindByCondition(t => t.Id == travellerId)
            .FirstOrDefault();
        if (traveller != null)
        {
            traveller.Permissions = dto.Permissions;
            await _travellerRepository.Update(traveller);
        }
    }

    public async Task UpdateTripStatus(Guid notificationId, UpdateInvitationDto dto, string userId)
    {
        var notification = _notificationRepository.FindByCondition(t => t.Id == notificationId)
            .FirstOrDefault();
        var traveller = _travellerRepository.FindByCondition(t => t.UserId == userId && t.TripId == notification.TripId)
            .FirstOrDefault();

        if (dto.Status == InvitationUpdateStatus.Declined)
        {
            await RejectInvitation(notification, traveller);
        }

        if (dto.Status == InvitationUpdateStatus.Accepted)
        {
            await AcceptInvitation(notification, traveller);
        }
    }

    private async Task RejectInvitation(Notification? notification, Traveller? traveller)
    {
        if (notification != null)
        {
            await _notificationRepository.Delete(notification);
        }

        if (traveller != null)
        {
            await _travellerRepository.Delete(traveller);
        }
    }

    private async Task AcceptInvitation(Notification? notification, Traveller? traveller)
    {
        if (traveller == null)
        {
            return;
        }

        traveller.Status = TravellerStatus.Joined;
        await _travellerRepository.Update(traveller);

        if (notification != null)
        {
            await _notificationRepository.Delete(notification);
        }
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