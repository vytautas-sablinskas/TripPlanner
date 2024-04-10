using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TripBudgetId",
                table: "Expenses",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_TripBudgetId",
                table: "Expenses",
                column: "TripBudgetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_TripBudgets_TripBudgetId",
                table: "Expenses",
                column: "TripBudgetId",
                principalTable: "TripBudgets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_TripBudgets_TripBudgetId",
                table: "Expenses");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_TripBudgetId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "TripBudgetId",
                table: "Expenses");
        }
    }
}
