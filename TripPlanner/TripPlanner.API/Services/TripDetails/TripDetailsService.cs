using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.TripDocuments;
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

    public async Task EditTripDetail(EditTripDetailDto tripDto)
    {
        var trip = _tripDetailsRepository.FindByCondition(c => c.Id == tripDto.Id)
            .FirstOrDefault();
        _mapper.Map(tripDto, trip);

        await _tripDetailsRepository.Update(trip);
    }

    public async Task DeleteTripDetail(Guid id)
    {
        var tripDetail = _tripDetailsRepository.FindByCondition(t => t.Id == id)
            .FirstOrDefault();

        await _tripDetailsRepository.Delete(tripDetail);
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

    public GetEditTripDetailsDto GetTripDetailById(Guid tripId, Guid detailId)
    {
        var trip = _tripRepository.FindByCondition(t => t.Id == tripId)
            .FirstOrDefault();

        var detail = _tripDetailsRepository.FindByCondition(t => t.Id == detailId)
            .FirstOrDefault();

        var editDetailsDto = _mapper.Map<GetEditTripDetailsDto>(detail);
        editDetailsDto.TripStartTime = trip.StartDate;
        editDetailsDto.TripEndTime = trip.EndDate;

        return editDetailsDto;
    }

    public async Task<(bool, TripDetailViewDto)> GetTripDetailView(Guid detailId)
    {
        var tripDetail = await _tripDetailsRepository.FindByCondition(t => t.Id == detailId)
            .Include(t => t.Documents)
            .FirstOrDefaultAsync();

        if (tripDetail == null)
        {
            return (false, null);
        }

        var documents = tripDetail.Documents.Select(d => new TripDocumentDto(d.Name, d.LinkToFile, d.Id, d.TypeOfFile));
        var tripDetailViewDto = new TripDetailViewDto(documents);

        return (true, tripDetailViewDto);
    }
}