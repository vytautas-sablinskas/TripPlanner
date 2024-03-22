using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedStatusToTraveller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Permission",
                table: "Traveller",
                newName: "Status");

            migrationBuilder.AddColumn<int>(
                name: "Permissions",
                table: "Traveller",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Permissions",
                table: "Traveller");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Traveller",
                newName: "Permission");
        }
    }
}
