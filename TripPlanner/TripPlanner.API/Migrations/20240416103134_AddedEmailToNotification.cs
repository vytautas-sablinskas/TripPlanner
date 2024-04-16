using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedEmailToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "NotificationDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "NotificationDetails");
        }
    }
}
