using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.TripDetails;

public class GetEditTripDetailsDto
{
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public TripDetailTypes EventType { get; set; }

    public string? Address { get; set; }

    public string? Notes { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Website { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime TripStartTime { get; set; }

    public DateTime TripEndTime { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }
}