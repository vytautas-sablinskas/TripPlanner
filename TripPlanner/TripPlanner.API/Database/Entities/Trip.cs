using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class Trip
{
    [Key]
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string DestinationCountry { get; set; }

    public string PhotoUri { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual IEnumerable<TripDetail> TripDetails { get; set; } = new List<TripDetail>();

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual IEnumerable<Traveller> Travellers { get; set; } = new List<Traveller>();

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual IEnumerable<TripInformationShare> TripInformationShares { get; set; } = new List<TripInformationShare>();
}