namespace TripPlanner.API.Dtos.TripDocuments;

public record AddNewTripDocumentDto (
    string Name,
    IFormFile Document,
    string MemberIds,
    bool IsPrivate
);