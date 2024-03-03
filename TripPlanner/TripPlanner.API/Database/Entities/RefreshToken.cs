namespace TripPlanner.API.Database.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; } = false;
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
    }
}