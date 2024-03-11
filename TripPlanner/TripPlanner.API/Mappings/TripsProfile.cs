using AutoMapper;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Mappings;

public class TripsProfile : Profile
{
    public TripsProfile()
    {
        CreateMap<CreateTripDto, Trip>();
        CreateMap<Trip, TripDto>();
    }
}