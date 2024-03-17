using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.TripDetails;

public class TripDetailsService : ITripDetailsService
{
    private readonly IRepository<TripDetail> _tripDetailsRepository;
    private readonly IRepository<Trip> _tripRepository;
    private readonly IMapper _mapper;

    public TripDetailsService(IRepository<TripDetail> tripDetailsRepository, IRepository<Trip> tripRepository, IMapper mapper)
    {
        _tripDetailsRepository = tripDetailsRepository;
        _tripRepository = tripRepository;
        _mapper = mapper;
    }

    public void CreateTripDetail(CreateTripDetailDto tripDto, string userId)
    {
        var trip = _mapper.Map<TripDetail>(tripDto);
        trip.CreatorId = userId;

        _tripDetailsRepository.Create(trip);
    }

    public async Task<TripDetailsDto> GetTripDetails(Guid tripId)
    {
        var details = await _tripDetailsRepository.FindByCondition(t => t.TripId == tripId)
            .ToListAsync();
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .FirstOrDefault();

        var detailsDto = details.Select(_mapper.Map<TripDetailMinimalDto>);
        var tripDto = _mapper.Map<TripDto>(trip);

        return new TripDetailsDto(detailsDto, tripDto);
    }
}