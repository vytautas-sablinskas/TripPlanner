﻿using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailMinimalDto (
    Guid Id,

    [Required]
    string Name,

    [Required]
    TripDetailTypes EventType,

    string? Address,

    DateTime? StartTime,

    DateTime? EndTime
);