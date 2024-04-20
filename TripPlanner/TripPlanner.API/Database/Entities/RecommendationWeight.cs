using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class RecommendationWeight
{
    [Key]
    public string Name { get; set; }

    public int Value { get; set; }
}