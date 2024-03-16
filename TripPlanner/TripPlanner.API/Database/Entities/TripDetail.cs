using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Database.Entities;

public class TripDetail
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; }

    public TripDetailTypes EventType { get; set; }

    public string? Description { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public virtual Trip? Trip { get; set; }

    public Guid? TripId { get; set; }

    public virtual AppUser Creator { get; set; }

    public string CreatorId { get; set; }
}