using AutoMapper;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Mappings;

public class TripsProfile : Profile
{
    public TripsProfile()
    {
        CreateMap<CreateTripDto, Trip>();
        CreateMap<EditTripDto, Trip>();
        CreateMap<Trip, TripDto>();
        CreateMap<Trip, TripTimeDto>();
    }
}