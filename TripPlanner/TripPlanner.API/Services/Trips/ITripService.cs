﻿using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public interface ITripService
{
    Task<Guid> CreateNewTrip(CreateTripDto tripDto, string userId);

    Task EditTrip(EditTripDto tripDto, Guid tripId);

    Task DeleteTrip(Guid tripId);

    TripDto GetTrip(Guid tripId);

    TripTimeDto GetTripTime(Guid tripId);

    Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page);
}