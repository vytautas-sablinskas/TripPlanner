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

    public async Task<IEnumerable<GetEditTripDetailsDto>> GetUnselectedTripDetails(string userId)
    {
        var tripDetails = await _tripDetailsRepository.GetListByConditionAsync(t => t.CreatorId == userId && t.TripId == null);

        var detailsDto = tripDetails.Select(_mapper.Map<GetEditTripDetailsDto>);

        return detailsDto;
    }

    public async Task EditTripDetail(EditTripDetailDto tripDto)
    {
        var trip = await _tripDetailsRepository.GetFirstOrDefaultAsync(c => c.Id == tripDto.Id);
        
        _mapper.Map(tripDto, trip);

        await _tripDetailsRepository.Update(trip);
    }

    public async Task DeleteTripDetail(Guid id)
    {
        var tripDetail = await _tripDetailsRepository.GetFirstOrDefaultAsync(t => t.Id == id);

        var documents = await _tripDocumentRepository.GetListByConditionAsync(t => t.TripDetailId == tripDetail.Id);

        foreach (var document in documents)
        {
            await _tripDocumentRepository.Delete(document);
        }

        await _tripDetailsRepository.Delete(tripDetail);
    }

    public async Task<TripDetailsDto> GetTripDetails(Guid tripId, string userId)
    {
        var details = await _tripDetailsRepository.GetListByConditionAsync(t => t.TripId == tripId);
        var trip = await _tripRepository.GetFirstOrDefaultAsync(t => t.Id == tripId);
        var budgetIds = _tripBudgetRepository.FindByCondition(t => t.TripId == tripId && t.BudgetMembers.Any(b => b.UserId == userId))
            .Include(t => t.BudgetMembers)
            .Select(t => new TripBudgetMinimalDto(t.Id, t.Name))
            .ToList();

        var detailsDto = details.Select(_mapper.Map<TripDetailMinimalDto>);
        var tripDto = _mapper.Map<TripDto>(trip);

        var traveller = await _travellerRepository.GetFirstOrDefaultAsync(t => t.UserId == userId && t.TripId == tripId);

        return new TripDetailsDto(detailsDto, tripDto, budgetIds, traveller.Permissions);
    }

    public async Task<GetEditTripDetailsDto> GetTripDetailById(Guid tripId, Guid detailId)
    {
        var trip = await _tripRepository.GetFirstOrDefaultAsync(t => t.Id == tripId);

        var detail = await _tripDetailsRepository.GetFirstOrDefaultAsync(t => t.Id == detailId);

        var editDetailsDto = _mapper.Map<GetEditTripDetailsDto>(detail);
        editDetailsDto.TripStartTime = trip.StartDate;
        editDetailsDto.TripEndTime = trip.EndDate;

        return editDetailsDto;
    }

    public async Task<(bool, TripDetailViewDto)> GetTripDetailView(string userId, Guid tripId, Guid detailId)
    {
        var tripDetail = _tripDetailsRepository.FindByCondition(t => t.Id == detailId)
            .Include(t => t.Trip)
            .Include(t => t.Documents)
            .ThenInclude(t => t.Members)
            .FirstOrDefault();

        if (tripDetail == null)
        {
            return (false, null);
        }

        var travellers = _travellerRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);
        var travellerMinimalDtos = travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}", t.User.PhotoUri))
            .ToList();
        var documents = tripDetail.Documents
            .Where(d => !d.IsPrivateDocument || d.CreatorId == userId || d.Members.Any(m => m.MemberId == userId))
            .Select(d => new TripDocumentDto(d.Name, d.LinkToFile, d.Id, d.TypeOfFile, d.CreatorId));
        var activeDocumentsCount = _tripDocumentRepository.FindByCondition(t => t.CreatorId == userId).Count();

        var traveller = travellers.FirstOrDefault(t => t.UserId == userId && t.TripId == tripId);

        var tripDetailViewDto = new TripDetailViewDto(tripDetail.Name, tripDetail.Address, tripDetail.PhoneNumber, tripDetail.Website, tripDetail.Notes, activeDocumentsCount, traveller.Permissions, tripDetail.StartTime, tripDetail.EndTime, documents, travellerMinimalDtos);

        return (true, tripDetailViewDto);
    }

    public async Task AddToTripTripDetail(AddToTripTripDetailDto dto)
    {
        var tripDetail = await _tripDetailsRepository.GetFirstOrDefaultAsync(t => t.Id == dto.Id);
        if (tripDetail == null)
        {
            return;
        }

        tripDetail.StartTime = dto.StartDate;
        tripDetail.TripId = dto.TripId;

        await _tripDetailsRepository.Update(tripDetail);
    }
}