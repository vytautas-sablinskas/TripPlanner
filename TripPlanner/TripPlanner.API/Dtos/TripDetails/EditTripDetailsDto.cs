using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.TripDetails;

public record EditTripDetailDto(
    Guid Id,

    [Required]
    string Name,

    [Required]
    TripDetailTypes EventType,

    string? Address,

    string? Notes,

    string? Website,

    string? PhoneNumber,

    DateTime StartTime,

    DateTime? EndTime
);