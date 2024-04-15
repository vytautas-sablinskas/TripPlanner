using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Dtos.TripTravellers;
using TripPlanner.API.Services.AzureBlobStorage;

namespace TripPlanner.API.Services.TripDocuments;

public class TripDocumentService : ITripDocumentService
{
    private readonly IAzureBlobStorageService _azureBlobStorageService;
    private readonly IRepository<TripDocument> _tripDocumentRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IRepository<TripDocumentMember> _tripDocumentMemberRepository;

    public TripDocumentService(IAzureBlobStorageService azureBlobStorageService, IRepository<TripDocument> tripDocumentRepository, IRepository<AppUser> appUserRepository, IRepository<TripDocumentMember> tripDocumentMemberRepository)
    {
        _azureBlobStorageService = azureBlobStorageService;
        _tripDocumentRepository = tripDocumentRepository;
        _appUserRepository = appUserRepository;
        _tripDocumentMemberRepository = tripDocumentMemberRepository;
    }

    public async Task<IEnumerable<TripDocumentDto>> GetUserDocuments(string userId)
    {
        var documents = await _tripDocumentRepository.FindByCondition(t => t.CreatorId == userId)
            .ToListAsync();

        return documents.Select(d => new TripDocumentDto(d.Name, d.LinkToFile, d.Id, d.TypeOfFile, d.CreatorId));
    }

    public async Task<(bool, TripDocumentDto?)> AddNewDocument(string userId, Guid tripDetailId, AddNewTripDocumentDto dto)
    {
        var (isSuccess, uri) = await _azureBlobStorageService.UploadFileAsync(dto.Document);
        if (!isSuccess)
        {
            return (false, null);
        }

        var tripDocument = new TripDocument
        {
            CreatorId = userId,
            LinkToFile = uri,
            Name = dto.Name,
            TripDetailId = tripDetailId,
            TypeOfFile = dto.Document.ContentType,
            Members = new List<TripDocumentMember>(),
            IsPrivateDocument = dto.IsPrivate,
        };

        var document = _tripDocumentRepository.Create(tripDocument);

        var members = await _appUserRepository.FindByCondition(u => dto.MemberIds.Contains(u.Id))
            .Select(m => new TripDocumentMember
            {
                MemberId = m.Id,
                TripDocumentId = document.Id

            })
            .ToListAsync();
        foreach (var member in members)
        {
            _tripDocumentMemberRepository.Create(member);
        }

        return (true, new TripDocumentDto(document.Name, document.LinkToFile, document.Id, document.TypeOfFile, document.CreatorId));
    }

    public async Task<TripDocumentAndMemberDto> GetDocumentMembers(Guid documentId)
    {
        var document = await _tripDocumentRepository.FindByCondition(d => d.Id == documentId)
            .Include(d => d.Members)
            .FirstOrDefaultAsync();

        var dto = new TripDocumentAndMemberDto(
            document.IsPrivateDocument,
            document.Members.Select(m => m.MemberId)
        );

        return dto;
    }

    public async Task<bool> EditDocument(Guid documentId, EditDocumentDto dto)
    {
        var document = await _tripDocumentRepository.FindByCondition(t => t.Id == documentId)
            .FirstOrDefaultAsync();
        if (document == null)
        {
            return false;
        }

        var members = await _tripDocumentMemberRepository.FindByCondition(m => m.TripDocumentId == documentId)
            .ToListAsync();
        foreach (var member in members)
        {
            await _tripDocumentMemberRepository.Delete(member);
        }

        foreach (var newMemberId in dto.MemberIds)
        {
            _tripDocumentMemberRepository.Create(new TripDocumentMember
            {
                MemberId = newMemberId,
                TripDocumentId = documentId
            });
        }

        document.Name = dto.Name;
        document.IsPrivateDocument = dto.IsPrivate;
        await _tripDocumentRepository.Update(document);
        
        return true;
    }

    public async Task<bool> DeleteDocument(Guid documentId)
    {

        var document = await _tripDocumentRepository.FindByCondition(t => t.Id == documentId)
            .FirstOrDefaultAsync();
        if (document == null)
        {
            return false;
        }

        await _tripDocumentRepository.Delete(document);
        await _azureBlobStorageService.DeleteFileAsync(document.LinkToFile);
       
        return true;
    }
}