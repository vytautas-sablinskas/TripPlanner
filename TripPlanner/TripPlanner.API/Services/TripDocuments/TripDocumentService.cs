using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDocuments;
using TripPlanner.API.Services.AzureBlobStorage;

namespace TripPlanner.API.Services.TripDocuments;

public class TripDocumentService : ITripDocumentService
{
    private readonly IAzureBlobStorageService _azureBlobStorageService;
    private readonly IRepository<TripDocument> _tripDocumentRepository;

    public TripDocumentService(IAzureBlobStorageService azureBlobStorageService, IRepository<TripDocument> tripDocumentRepository)
    {
        _azureBlobStorageService = azureBlobStorageService;
        _tripDocumentRepository = tripDocumentRepository;
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
        };

        var document = _tripDocumentRepository.Create(tripDocument);

        return (true, new TripDocumentDto(document.Name, document.LinkToFile, document.Id, document.TypeOfFile));
    }
}