using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Constants;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Services.AzureBlobStorage;

namespace TripPlanner.API.Services.Trips;

public class TripService : ITripService
{
    private readonly IRepository<Trip> _tripRepository;
    private readonly IMapper _mapper;
    private readonly IAzureBlobStorageService _azureBlobStorageService;

    public TripService(IRepository<Trip> tripRepository, IMapper mapper, IAzureBlobStorageService azureBlobStorageService)
    {
        _tripRepository = tripRepository;
        _mapper = mapper;
        _azureBlobStorageService = azureBlobStorageService;
    }

    public async Task<Guid> CreateNewTrip(CreateTripDto tripDto, IFormFile image, string userId)
    {
        var imageUri = await _azureBlobStorageService.UploadImageAsync(image);

        var trip = _mapper.Map<Trip>(tripDto);
        trip.Id = Guid.NewGuid();
        trip.GroupAdminId = userId;
        trip.PhotoUri = imageUri;

        _tripRepository.Create(trip);

        return trip.Id;
    }

    public async Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page)
    {
        var tripsQuery = _tripRepository.FindAll()
                                        .Include(t => t.GroupAdmin)
                                        .Where(t => t.GroupAdminId == userId);
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

    private async Task<TripsDto> GetUpcomingTrips(IQueryable<Trip> tripsQuery, int page)
    {
        var tripsCount = tripsQuery.Where(t => t.EndDate > DateTime.UtcNow)
                                   .Count();

        var trips = await tripsQuery.Where(t => t.EndDate > DateTime.UtcNow)
                        .Skip((page - 1) * FetchSizes.DEFAULT_SIZE)
                        .Take(FetchSizes.DEFAULT_SIZE)
                        .ToListAsync();

        var mappedTrips = trips.Select(_mapper.Map<TripDto>);

        return new TripsDto(mappedTrips, tripsCount);
    }

    private async Task<TripsDto> GetPastTrips(IQueryable<Trip> tripsQuery, int page)
    {
        var tripsCount = tripsQuery.Where(t => t.EndDate <= DateTime.UtcNow)
                                   .Count();

        var trips = await tripsQuery.Where(t => t.EndDate <= DateTime.UtcNow)
                         .ToListAsync();

        var mappedTrips = trips.Select(_mapper.Map<TripDto>);

        return new TripsDto(mappedTrips, tripsCount);
    }
}