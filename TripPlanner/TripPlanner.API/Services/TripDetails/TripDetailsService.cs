using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripDetails;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripDetails;

public class TripDetailsService : ITripDetailsService
{
    private readonly IRepository<TripDetail> _tripDetailsRepository;
    private readonly IRepository<Trip> _tripRepository;
    private readonly IRepository<TripBudget> _tripBudgetRepository;
    private readonly IRepository<Traveller> _travellerRepository;
    private readonly IRepository<TripDocument> _tripDocumentRepository;
    private readonly IMapper _mapper;

    public TripDetailsService(IRepository<TripDetail> tripDetailsRepository, IRepository<Trip> tripRepository, IRepository<TripBudget> tripBudgetRepository, IRepository<Traveller> travellerRepository, IRepository<TripDocument> tripDocumentRepository, IMapper mapper)
    {
        _tripDetailsRepository = tripDetailsRepository;
        _tripRepository = tripRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _travellerRepository = travellerRepository;
        _tripDocumentRepository = tripDocumentRepository;
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
        var trip = await _tripDetailsRepository.FindByCondition(c => c.Id == tripDto.Id)
            .FirstOrDefaultAsync();
        _mapper.Map(tripDto, trip);

        await _tripDetailsRepository.Update(trip);
    }

    public async Task DeleteTripDetail(Guid id)
    {
        var tripDetail = await _tripDetailsRepository.FindByCondition(t => t.Id == id)
            .FirstOrDefaultAsync();

        var documents = await _tripDocumentRepository.FindByCondition(t => t.TripDetailId == tripDetail.Id)
            .ToListAsync();

        foreach (var document in documents)
        {
            await _tripDocumentRepository.Delete(document);
        }

        await _tripDetailsRepository.Delete(tripDetail);
    }

    public async Task<TripDetailsDto> GetTripDetails(Guid tripId, string userId)
    {
        var details = await _tripDetailsRepository.FindByCondition(t => t.TripId == tripId)
            .ToListAsync();
        var trip = await _tripRepository.FindByCondition(t => t.Id == tripId)
            .FirstOrDefaultAsync();
        var budgetIds = await _tripBudgetRepository.FindByCondition(t => t.TripId == tripId && t.BudgetMembers.Any(b => b.UserId == userId))
            .Include(t => t.BudgetMembers)
            .Select(t => new TripBudgetMinimalDto(t.Id, t.Name))
            .ToListAsync();

        var detailsDto = details.Select(_mapper.Map<TripDetailMinimalDto>);
        var tripDto = _mapper.Map<TripDto>(trip);

        return new TripDetailsDto(detailsDto, tripDto, budgetIds);
    }

    public async Task<GetEditTripDetailsDto> GetTripDetailById(Guid tripId, Guid detailId)
    {
        var trip = await _tripRepository.FindByCondition(t => t.Id == tripId)
            .FirstOrDefaultAsync();

        var detail = await _tripDetailsRepository.FindByCondition(t => t.Id == detailId)
            .FirstOrDefaultAsync();

        var editDetailsDto = _mapper.Map<GetEditTripDetailsDto>(detail);
        editDetailsDto.TripStartTime = trip.StartDate;
        editDetailsDto.TripEndTime = trip.EndDate;

        return editDetailsDto;
    }

    public async Task<(bool, TripDetailViewDto)> GetTripDetailView(string userId, Guid tripId, Guid detailId)
    {
        var tripDetail = await _tripDetailsRepository.FindByCondition(t => t.Id == detailId)
            .Include(t => t.Documents)
            .ThenInclude(t => t.Members)
            .FirstOrDefaultAsync();

        if (tripDetail == null)
        {
            return (false, null);
        }

        var travellers = _travellerRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);
        var travellerMinimalDtos = await travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}", t.User.PhotoUri))
            .ToListAsync();
        var documents = tripDetail.Documents
            .Where(d => !d.IsPrivateDocument || d.CreatorId == userId || d.Members.Any(m => m.MemberId == userId))
            .Select(d => new TripDocumentDto(d.Name, d.LinkToFile, d.Id, d.TypeOfFile));
        var tripDetailViewDto = new TripDetailViewDto(tripDetail.Name, tripDetail.Address, tripDetail.PhoneNumber, tripDetail.Website, tripDetail.Notes, documents, travellerMinimalDtos);

        return (true, tripDetailViewDto);
    }
}