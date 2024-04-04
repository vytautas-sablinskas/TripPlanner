using AutoMapper;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.TripBudgets;

namespace TripPlanner.API.Mappings;

public class TripBudgetProfile : Profile
{
    public TripBudgetProfile() 
    {
        CreateMap<TripBudget, TripBudgetDto>()
               .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Budget));
    }
}