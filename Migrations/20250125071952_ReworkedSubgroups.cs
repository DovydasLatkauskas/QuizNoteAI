using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiTemplate.Migrations
{
    /// <inheritdoc />
    public partial class ReworkedSubgroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subgroups",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "SubgroupPath",
                table: "ContentFiles");

            migrationBuilder.DropColumn(
                name: "Summary",
                table: "ContentFiles");

            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "Groups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SubgroupId",
                table: "ContentFiles",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subgroup",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subgroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subgroup_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentFiles_SubgroupId",
                table: "ContentFiles",
                column: "SubgroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Subgroup_GroupId",
                table: "Subgroup",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentFiles_Subgroup_SubgroupId",
                table: "ContentFiles",
                column: "SubgroupId",
                principalTable: "Subgroup",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentFiles_Subgroup_SubgroupId",
                table: "ContentFiles");

            migrationBuilder.DropTable(
                name: "Subgroup");

            migrationBuilder.DropIndex(
                name: "IX_ContentFiles_SubgroupId",
                table: "ContentFiles");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "SubgroupId",
                table: "ContentFiles");

            migrationBuilder.AddColumn<List<string>>(
                name: "Subgroups",
                table: "Groups",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "SubgroupPath",
                table: "ContentFiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "ContentFiles",
                type: "text",
                nullable: true);
        }
    }
}
