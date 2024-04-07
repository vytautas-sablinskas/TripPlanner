using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedPhotoToUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoUri",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUri",
                table: "AspNetUsers");
        }
    }
}
