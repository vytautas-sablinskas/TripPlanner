using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Annotations;

public class EndDateValidationCreateTripAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var dto = (CreateTripDto)validationContext.ObjectInstance;

        if (dto.EndDate.Date < dto.StartDate.Date)
        {
            return new ValidationResult("End date has to be higher than start date!");
        }

        return ValidationResult.Success;
    }
}