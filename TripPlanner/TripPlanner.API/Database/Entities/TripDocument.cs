using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.Database.Entities;

public class TripDocument
{
    [Key]
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string LinkToFile { get; set; }

    public string TypeOfFile { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public TripDetail TripDetail { get; set; }

    public Guid TripDetailId { get; set; }

    public bool IsPrivateDocument { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public virtual AppUser Creator { get; set; }

    public string CreatorId { get; set; }

    [DeleteBehavior(DeleteBehavior.Cascade)]
    public virtual ICollection<TripDocumentMember> Members { get; set; }
}