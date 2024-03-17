﻿using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.TripDetails;

public record CreateTripDetailDto(
    [Required]
    string Name,

    [Required]
    TripDetailTypes EventType,

    string? Address,

    string? Notes,

    DateTime StartTime,

    DateTime? EndTime,

    Guid TripId
);