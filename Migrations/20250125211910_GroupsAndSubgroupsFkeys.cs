using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiTemplate.Migrations
{
    /// <inheritdoc />
    public partial class GroupsAndSubgroupsFkeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentFiles_Groups_GroupId",
                table: "ContentFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Subgroups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "ContentFiles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ContentFiles_Groups_GroupId",
                table: "ContentFiles",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentFiles_Groups_GroupId",
                table: "ContentFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Subgroups",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "ContentFiles",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentFiles_Groups_GroupId",
                table: "ContentFiles",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
