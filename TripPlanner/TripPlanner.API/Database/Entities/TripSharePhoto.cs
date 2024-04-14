using Microsoft.EntityFrameworkCore;

namespace TripPlanner.API.Database.Entities;

public class TripSharePhoto
{
    public Guid Id { get; set; }

    public required string PhotoUri { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public TripInformationShare TripInformationShare { get; set; }

    public Guid TripInformationShareId { get; set; }
}