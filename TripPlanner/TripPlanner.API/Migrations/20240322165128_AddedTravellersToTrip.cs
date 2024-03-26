using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedTravellersToTrip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Traveller_AspNetUsers_UserId",
                table: "Traveller");

            migrationBuilder.DropForeignKey(
                name: "FK_Traveller_Trips_TripId",
                table: "Traveller");

            migrationBuilder.AddForeignKey(
                name: "FK_Traveller_AspNetUsers_UserId",
                table: "Traveller",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Traveller_Trips_TripId",
                table: "Traveller",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Traveller_AspNetUsers_UserId",
                table: "Traveller");

            migrationBuilder.DropForeignKey(
                name: "FK_Traveller_Trips_TripId",
                table: "Traveller");

            migrationBuilder.AddForeignKey(
                name: "FK_Traveller_AspNetUsers_UserId",
                table: "Traveller",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Traveller_Trips_TripId",
                table: "Traveller",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
