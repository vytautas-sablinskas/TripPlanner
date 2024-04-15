using TripPlanner.API.Dtos.TripDocuments;

namespace TripPlanner.API.Services.TripDocuments;

public interface ITripDocumentService
{
    Task<(bool, TripDocumentDto?)> AddNewDocument(string userId, Guid tripDetailId, AddNewTripDocumentDto dto);

    Task<TripDocumentAndMemberDto> GetDocumentMembers(Guid documentId);

    Task<IEnumerable<TripDocumentDto>> GetUserDocuments(string userId);

    Task<bool> EditDocument(Guid documentId, EditDocumentDto dto);

    Task<bool> DeleteDocument(Guid documentId);
}