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

    public DateTime? EndTime { get; set;}
}