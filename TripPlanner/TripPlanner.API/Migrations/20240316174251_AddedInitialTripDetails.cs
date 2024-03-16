using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedInitialTripDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TripDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventType = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatorId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripDetails_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TripDetails_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripDetails_CreatorId",
                table: "TripDetails",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_TripDetails_TripId",
                table: "TripDetails",
                column: "TripId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TripDetails");
        }
    }
}
