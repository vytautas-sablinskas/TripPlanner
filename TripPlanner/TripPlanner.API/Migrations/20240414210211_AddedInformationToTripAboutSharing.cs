using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedInformationToTripAboutSharing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDocumentMembers_AspNetUsers_MemberId",
                table: "TripDocumentMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDocumentMembers_TripDocuments_TripDocumentId",
                table: "TripDocumentMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDocuments_TripDetails_TripDetailId",
                table: "TripDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_TripInformationShares_Trips_TripId",
                table: "TripInformationShares");

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocumentMembers_AspNetUsers_MemberId",
                table: "TripDocumentMembers",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocumentMembers_TripDocuments_TripDocumentId",
                table: "TripDocumentMembers",
                column: "TripDocumentId",
                principalTable: "TripDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocuments_TripDetails_TripDetailId",
                table: "TripDocuments",
                column: "TripDetailId",
                principalTable: "TripDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripInformationShares_Trips_TripId",
                table: "TripInformationShares",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDocumentMembers_AspNetUsers_MemberId",
                table: "TripDocumentMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDocumentMembers_TripDocuments_TripDocumentId",
                table: "TripDocumentMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDocuments_TripDetails_TripDetailId",
                table: "TripDocuments");

            migrationBuilder.DropForeignKey(
                name: "FK_TripInformationShares_Trips_TripId",
                table: "TripInformationShares");

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocumentMembers_AspNetUsers_MemberId",
                table: "TripDocumentMembers",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocumentMembers_TripDocuments_TripDocumentId",
                table: "TripDocumentMembers",
                column: "TripDocumentId",
                principalTable: "TripDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDocuments_TripDetails_TripDetailId",
                table: "TripDocuments",
                column: "TripDetailId",
                principalTable: "TripDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TripInformationShares_Trips_TripId",
                table: "TripInformationShares",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
