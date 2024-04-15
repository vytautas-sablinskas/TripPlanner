using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Database.Entities;

public class TripDetail
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; }

    public TripDetailTypes EventType { get; set; }

    public string? Address { get; set; }

    public string? Notes { get; set; }

    public string? Website { get; set; }

    public string? PhoneNumber { get; set; }

    public DateTime StartTime { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public DateTime? EndTime { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual Trip? Trip { get; set; }

    public Guid? TripId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual AppUser Creator { get; set; }

    public string CreatorId { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual IEnumerable<TripDocument> Documents { get; set; }
}