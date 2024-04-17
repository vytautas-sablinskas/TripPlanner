using Microsoft.EntityFrameworkCore;

namespace TripPlanner.API.Database.Entities;

public class TripInformationShare
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string? DescriptionHtml { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public IEnumerable<TripSharePhoto> Photos { get; set; } = new List<TripSharePhoto>();
    
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public Trip? Trip { get; set; }

    public Guid? TripId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public AppUser User { get; set; }

    public string UserId { get; set; }

    public Guid? LinkGuid { get; set; }
}