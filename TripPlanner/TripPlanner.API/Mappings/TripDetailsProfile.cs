﻿using AutoMapper;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripDetails;

namespace TripPlanner.API.Mappings;

public class TripDetailsProfile : Profile
{
    public TripDetailsProfile()
    {
        CreateMap<CreateTripDetailDto, TripDetail>();
        CreateMap<TripDetail, TripDetailDto>();
    }
}