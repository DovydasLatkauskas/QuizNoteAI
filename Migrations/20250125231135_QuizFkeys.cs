using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiTemplate.Migrations
{
    /// <inheritdoc />
    public partial class QuizFkeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Groups_GroupId",
                table: "Quizzes");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Quizzes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Groups_GroupId",
                table: "Quizzes",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Groups_GroupId",
                table: "Quizzes");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Quizzes",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Groups_GroupId",
                table: "Quizzes",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
