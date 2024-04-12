using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class TripDocumentMember
{
    [Key]
    public Guid Id { get; set; }

    public TripDocument Document { get; set; }

    public Guid TripDocumentId { get; set; }

    public AppUser Member { get; set; }

    public string MemberId { get; set; }
}