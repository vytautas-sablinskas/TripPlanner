using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Constants;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public class TripService : ITripService
{
    private readonly IRepository<Trip> _tripRepository;
    private readonly IMapper _mapper;

    public TripService(IRepository<Trip> tripRepository, IMapper mapper)
    {
        _tripRepository = tripRepository;
        _mapper = mapper;
    }

    public Guid CreateNewTrip(CreateTripDto tripDto, string userId)
    {
        var trip = _mapper.Map<Trip>(tripDto);
        trip.Id = Guid.NewGuid();
        trip.GroupAdminId = userId;

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