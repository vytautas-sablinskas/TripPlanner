namespace TripPlanner.API.Dtos.Trips;

public class TripDto
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string DestinationCountry { get; set; }

    public string PhotoUri { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsCreator { get; set; }
}