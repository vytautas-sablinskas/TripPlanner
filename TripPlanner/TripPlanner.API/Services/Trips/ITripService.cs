﻿using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Services.Trips;

public interface ITripService
{
    Task<Guid> CreateNewTrip(CreateTripDto tripDto, string userId);

    TripDto GetTrip(Guid tripId);

    Task<TripsDto> GetUserTrips(string userId, TripFilter filter, int page);
}