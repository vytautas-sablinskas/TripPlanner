﻿using System.ComponentModel.DataAnnotations;
using TripPlanner.API.Dtos.Trips;

namespace TripPlanner.API.Annotations.Trips;

public class EndDateValidationEditTripAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var dto = (EditTripDto)validationContext.ObjectInstance;

        if (dto.EndDate.Date < dto.StartDate.Date)
        {
            return new ValidationResult("End date has to be higher than start date!");
        }

        return ValidationResult.Success;
    }
}