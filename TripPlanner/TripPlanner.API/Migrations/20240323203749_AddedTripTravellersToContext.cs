using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedTripTravellersToContext : Migration
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_Traveller",
                table: "Traveller");

            migrationBuilder.RenameTable(
                name: "Traveller",
                newName: "TripTravellers");

            migrationBuilder.RenameIndex(
                name: "IX_Traveller_UserId",
                table: "TripTravellers",
                newName: "IX_TripTravellers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Traveller_TripId",
                table: "TripTravellers",
                newName: "IX_TripTravellers_TripId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TripTravellers",
                table: "TripTravellers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TripTravellers_AspNetUsers_UserId",
                table: "TripTravellers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TripTravellers_Trips_TripId",
                table: "TripTravellers",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripTravellers_AspNetUsers_UserId",
                table: "TripTravellers");

            migrationBuilder.DropForeignKey(
                name: "FK_TripTravellers_Trips_TripId",
                table: "TripTravellers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TripTravellers",
                table: "TripTravellers");

            migrationBuilder.RenameTable(
                name: "TripTravellers",
                newName: "Traveller");

            migrationBuilder.RenameIndex(
                name: "IX_TripTravellers_UserId",
                table: "Traveller",
                newName: "IX_Traveller_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TripTravellers_TripId",
                table: "Traveller",
                newName: "IX_Traveller_TripId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Traveller",
                table: "Traveller",
                column: "Id");

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
    }
}
