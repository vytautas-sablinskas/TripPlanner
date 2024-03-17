using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTripToHaveDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDetails_Trips_TripId",
                table: "TripDetails");

            migrationBuilder.AddForeignKey(
                name: "FK_TripDetails_Trips_TripId",
                table: "TripDetails",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDetails_Trips_TripId",
                table: "TripDetails");

            migrationBuilder.AddForeignKey(
                name: "FK_TripDetails_Trips_TripId",
                table: "TripDetails",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id");
        }
    }
}
