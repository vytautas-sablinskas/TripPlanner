using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedTripInformationShare : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TripInformationShares",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionHtml = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripInformationShares", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripInformationShares_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TripInformationShares_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TripSharePhotos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PhotoUri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TripInformationShareId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripSharePhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripSharePhotos_TripInformationShares_TripInformationShareId",
                        column: x => x.TripInformationShareId,
                        principalTable: "TripInformationShares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripInformationShares_TripId",
                table: "TripInformationShares",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripInformationShares_UserId",
                table: "TripInformationShares",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TripSharePhotos_TripInformationShareId",
                table: "TripSharePhotos",
                column: "TripInformationShareId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripSharePhotos");

            migrationBuilder.DropTable(
                name: "TripInformationShares");
        }
    }
}
