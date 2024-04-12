namespace TripPlanner.API.Dtos.TripDocuments;

public record TripDocumentAndMemberDto(
    bool IsPrivate,
    IEnumerable<string> MemberIds
);