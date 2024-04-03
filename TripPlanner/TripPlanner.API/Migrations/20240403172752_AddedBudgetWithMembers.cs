using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedBudgetWithMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TripId",
                table: "TripBudgets",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TripBudgets_TripId",
                table: "TripBudgets",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_TripBudgets_Trips_TripId",
                table: "TripBudgets",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripBudgets_Trips_TripId",
                table: "TripBudgets");

            migrationBuilder.DropIndex(
                name: "IX_TripBudgets_TripId",
                table: "TripBudgets");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "TripBudgets");
        }
    }
}
