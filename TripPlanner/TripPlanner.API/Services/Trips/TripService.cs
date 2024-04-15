using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Constants;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Services.AzureBlobStorage;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Services.Trips;

public class TripService : ITripService
{
    private readonly IRepository<Trip> _tripRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IMapper _mapper;
    private readonly IAzureBlobStorageService _azureBlobStorageService;
    private readonly IRepository<TripInformationShare> _tripInformationShareRepository;
    private readonly IRepository<TripSharePhoto> _tripSharePhotoRepository;
    private readonly IRepository<TripDetail> _tripDetailRepository;

    public TripService(IRepository<Trip> tripRepository, IRepository<AppUser> appUserRepository, IMapper mapper, IAzureBlobStorageService azureBlobStorageService, IRepository<TripInformationShare> tripInformationShareRepository, IRepository<TripSharePhoto> tripSharePhotoRepository, IRepository<TripDetail> tripDetailRepository)
    {
        _tripRepository = tripRepository;
        _appUserRepository = appUserRepository;
        _mapper = mapper;
        _azureBlobStorageService = azureBlobStorageService;
        _tripInformationShareRepository = tripInformationShareRepository;
        _tripSharePhotoRepository = tripSharePhotoRepository;
        _tripDetailRepository = tripDetailRepository;
    }

    public async Task<Guid> CreateNewTrip(CreateTripDto tripDto, string userId)
    {
        var imageUri = await _azureBlobStorageService.UploadImageAsync(tripDto.Image);

        var trip = _mapper.Map<Trip>(tripDto);
        trip.PhotoUri = imageUri;

        var user = _appUserRepository.FindByCondition(t => t.Id == userId)
                                     .FirstOrDefault();
        if (user != null)
        {
            var traveller = new Traveller
            {
                Permissions = TripPermissions.Administrator,
                Status = TravellerStatus.Joined,
                UserId = userId,
            };

            trip.Travellers = new List<Traveller> { traveller };
        }

        var createdTrip = _tripRepository.Create(trip);

        _tripInformationShareRepository.Create(new TripInformationShare
        {
            DescriptionHtml = "",
            Photos = new List<TripSharePhoto>(),
            Title = "",
            UserId = userId,
            TripId = createdTrip.Id
        });

        return trip.Id;
    }

    public async Task EditTrip(EditTripDto tripDto, Guid tripId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
                                  .FirstOrDefault();

        if (tripDto.Image != null)
        {
            if (!trip.PhotoUri.StartsWith("/default"))
            {
                await _azureBlobStorageService.DeleteFileAsync(trip.PhotoUri);
            }
            
            trip.PhotoUri = await _azureBlobStorageService.UploadImageAsync(tripDto.Image);
        }

        _mapper.Map(tripDto, trip);
        await _tripRepository.Update(trip);
    }

    public async Task DeleteTrip(Guid tripId)
    {
        var trip = await _tripRepository.FindByCondition(t => t.Id == tripId)
                                  .Include(t => t.TripDetails)
                                  .FirstOrDefaultAsync();

        if (!trip.PhotoUri.StartsWith("/default"))
        {
            await _azureBlobStorageService.DeleteFileAsync(trip.PhotoUri);
        }

        await _tripRepository.Delete(trip);
    }

    public TripDto GetTrip(Guid tripId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId).FirstOrDefault();
        var tripDto = _mapper.Map<TripDto>(trip);

        return tripDto;
    }

    public TripTimeDto GetTripTime(Guid tripId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId).FirstOrDefault();
        var tripTimeDto = _mapper.Map<TripTimeDto>(trip);

        return tripTimeDto;
    }

    public async Task<TripShareInformationDto> GetTripShareInformation(Guid tripId, string userId)
    {
        var shareInformation = await _tripInformationShareRepository.FindByCondition(t => t.TripId == tripId && t.UserId == userId)
            .Include(t => t.Photos)
            .FirstOrDefaultAsync();

        var shareInformationDto = new TripShareInformationDto(shareInformation.Title, shareInformation.DescriptionHtml, shareInformation.Photos.Select(p => p.PhotoUri), shareInformation.LinkGuid != null ? $"http://localhost:5173/trips/shared/{shareInformation.LinkGuid}" : null);

        return shareInformationDto;
    }

    public async Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page)
    {
        var tripsQuery = _tripRepository.FindByCondition(t => t.Travellers.Any(traveller => traveller.UserId == userId && traveller.Status == TravellerStatus.Joined))
            .Include(t => t.Travellers);

        switch (filter)
        {
            case TripFilter.Upcoming:
                return await GetUpcomingTrips(tripsQuery, page);
            case TripFilter.Past:
                return await GetPastTrips(tripsQuery, page);
            default:
                break;
        }

        return new TripsDto(new List<TripDto>(), TotalTripCount: 0);
    }

    public async Task<IEnumerable<TripDto>> GetAllUserTrips(string userId)
    {
        var trips = await _tripRepository.FindByCondition(t => t.Travellers.Any(traveller => traveller.UserId == userId && traveller.Status == TravellerStatus.Joined && t.EndDate > DateTime.UtcNow))
            .ToListAsync();

        var mappedTrips = trips.Select(_mapper.Map<TripDto>);

        return mappedTrips;
    }

    public async Task<bool> UpdateShareTripInformation(string userId, Guid tripId, UpdateTripShareInformationDto dto)
    {
        var shareInformation = await _tripInformationShareRepository.FindByCondition(t => t.UserId == userId && t.TripId == tripId)
            .Include(t => t.Photos)
            .FirstOrDefaultAsync();
        if (shareInformation == null)
        {
            return false;
        }

        var newPhotos = new List<string>();
        if (dto.Photos != null)
        {
            foreach (var image in dto.Photos)
            {
                var imageUri = await _azureBlobStorageService.UploadImageAsync(image);
                newPhotos.Add(imageUri);
            }
        }

        if (shareInformation.Photos != null)
        {
            var copyOfPhotos = shareInformation.Photos.Select(p => p);
            foreach (var photo in copyOfPhotos)
            {
                if (dto.ExistingPhotos != null && dto.ExistingPhotos.Contains(photo.PhotoUri))
                {
                    newPhotos.Add(photo.PhotoUri);
                }
                else
                {
                    await _azureBlobStorageService.DeleteFileAsync(photo.PhotoUri);
                }
            }
        }

        var allPhotos = await _tripSharePhotoRepository.FindByCondition(t => t.TripInformationShareId == shareInformation.Id)
            .ToListAsync();
        foreach (var photo in allPhotos)
        {
            await _tripSharePhotoRepository.Delete(photo);
        }

        foreach (var photo in newPhotos)
        {
            var newPhotoEntity = new TripSharePhoto { PhotoUri = photo, TripInformationShareId = shareInformation.Id };
            _tripSharePhotoRepository.Create(newPhotoEntity);
        }

        shareInformation.Title = dto.Title;
        shareInformation.DescriptionHtml = dto.DescriptionInHtml;

        await _tripInformationShareRepository.Update(shareInformation);

        return true;
    }

    public async Task<string?> UpdateTripShareInformationLink(Guid tripId, string userId)
    {
        var shareInformation = await _tripInformationShareRepository.FindByCondition(t => t.TripId == tripId && t.UserId == userId)
            .FirstOrDefaultAsync();
        if (shareInformation == null)
        {
            return null;
        }

        var newGuid = Guid.NewGuid();
        if (shareInformation.LinkGuid == null)
        {
            shareInformation.LinkGuid = newGuid;
        }
        else
        {
            shareInformation.LinkGuid = null;
        }

        await _tripInformationShareRepository.Update(shareInformation);

        return shareInformation.LinkGuid == null ? null : $"http://localhost:5173/trips/shared/{newGuid}";
    }

    public async Task<TripShareInformationViewDto> GetShareTripViewInformation(Guid linkId)
    {
        var shareInformation = await _tripInformationShareRepository.FindByCondition(t => t.LinkGuid == linkId)
            .Include(p => p.Photos)
            .Include(p => p.User)
            .FirstOrDefaultAsync();
        if (shareInformation == null)
        {
            return null;
        }

        var trip = await _tripRepository.FindByCondition(t => t.Id == shareInformation.TripId)
            .FirstOrDefaultAsync();
        if (trip == null)
        {
            return null;
        }

        var tripDetails = await _tripDetailRepository.FindByCondition(t => t.TripId == shareInformation.TripId)
            .ToListAsync();

        var detailsDto = tripDetails.Select(_mapper.Map<TripDetailMinimalDto>);
        var tripDto = _mapper.Map<TripDto>(trip);
        var shareInformationDto = new TripShareInformationDto(shareInformation.Title, shareInformation.DescriptionHtml, shareInformation.Photos.Select(p => p.PhotoUri), null);

        return new TripShareInformationViewDto(detailsDto, tripDto, shareInformationDto, $"{shareInformation.User.Name} {shareInformation.User.Surname}");
    }

    private async Task<TripsDto> GetUpcomingTrips(IQueryable<Trip> tripsQuery, int page)
    {
        var tripsCount = await tripsQuery.Where(t => t.EndDate > DateTime.UtcNow)
                                   .CountAsync();

        var trips = await tripsQuery.Where(t => t.EndDate > DateTime.UtcNow)
                        .Skip((page - 1) * FetchSizes.DEFAULT_SIZE)
                        .Take(FetchSizes.DEFAULT_SIZE)
                        .ToListAsync();

        var mappedTrips = trips.Select(_mapper.Map<TripDto>);

        return new TripsDto(mappedTrips, tripsCount);
    }

    private async Task<TripsDto> GetPastTrips(IQueryable<Trip> tripsQuery, int page)
    {
        var tripsCount = await tripsQuery.Where(t => t.EndDate <= DateTime.UtcNow)
                                   .CountAsync();

        var trips = await tripsQuery.Where(t => t.EndDate <= DateTime.UtcNow)
                         .Skip((page - 1) * FetchSizes.DEFAULT_SIZE)
                         .Take(FetchSizes.DEFAULT_SIZE)
                         .ToListAsync();

        var mappedTrips = trips.Select(_mapper.Map<TripDto>);

        return new TripsDto(mappedTrips, tripsCount);
    }
}