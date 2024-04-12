using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripPlanner.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedIsPrivateAndNewMembersClassToDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentMembers_AspNetUsers_MemberId",
                table: "DocumentMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentMembers_TripDocuments_TripDocumentId",
                table: "DocumentMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DocumentMembers",
                table: "DocumentMembers");

            migrationBuilder.RenameTable(
                name: "DocumentMembers",
                newName: "TripDocumentMembers");

            migrationBuilder.RenameIndex(
                name: "IX_DocumentMembers_TripDocumentId",
                table: "TripDocumentMembers",
                newName: "IX_TripDocumentMembers_TripDocumentId");

            migrationBuilder.RenameIndex(
                name: "IX_DocumentMembers_MemberId",
                table: "TripDocumentMembers",
                newName: "IX_TripDocumentMembers_MemberId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TripDocumentMembers",
                table: "TripDocumentMembers",
                column: "Id");

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

            migrationBuilder.DropPrimaryKey(
                name: "PK_TripDocumentMembers",
                table: "TripDocumentMembers");

            migrationBuilder.RenameTable(
                name: "TripDocumentMembers",
                newName: "DocumentMembers");

            migrationBuilder.RenameIndex(
                name: "IX_TripDocumentMembers_TripDocumentId",
                table: "DocumentMembers",
                newName: "IX_DocumentMembers_TripDocumentId");

            migrationBuilder.RenameIndex(
                name: "IX_TripDocumentMembers_MemberId",
                table: "DocumentMembers",
                newName: "IX_DocumentMembers_MemberId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DocumentMembers",
                table: "DocumentMembers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentMembers_AspNetUsers_MemberId",
                table: "DocumentMembers",
                column: "MemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentMembers_TripDocuments_TripDocumentId",
                table: "DocumentMembers",
                column: "TripDocumentId",
                principalTable: "TripDocuments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
