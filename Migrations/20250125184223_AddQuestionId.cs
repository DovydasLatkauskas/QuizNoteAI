using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApiTemplate.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentFiles_Subgroup_SubgroupId",
                table: "ContentFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Subgroup_Groups_GroupId",
                table: "Subgroup");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subgroup",
                table: "Subgroup");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Groups");

            migrationBuilder.RenameTable(
                name: "Subgroup",
                newName: "Subgroups");

            migrationBuilder.RenameIndex(
                name: "IX_Subgroup_GroupId",
                table: "Subgroups",
                newName: "IX_Subgroups_GroupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subgroups",
                table: "Subgroups",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Quizzes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ImageNumber = table.Column<int>(type: "integer", nullable: false),
                    Sources = table.Column<List<string>>(type: "text[]", nullable: false),
                    GroupId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizzes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Quizzes_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    Answers = table.Column<List<string>>(type: "jsonb", nullable: false),
                    CorrectAnswer = table.Column<string>(type: "text", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    QuizId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_QuizId",
                table: "Questions",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_GroupId",
                table: "Quizzes",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentFiles_Subgroups_SubgroupId",
                table: "ContentFiles",
                column: "SubgroupId",
                principalTable: "Subgroups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentFiles_Subgroups_SubgroupId",
                table: "ContentFiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Subgroups_Groups_GroupId",
                table: "Subgroups");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Quizzes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subgroups",
                table: "Subgroups");

            migrationBuilder.RenameTable(
                name: "Subgroups",
                newName: "Subgroup");

            migrationBuilder.RenameIndex(
                name: "IX_Subgroups_GroupId",
                table: "Subgroup",
                newName: "IX_Subgroup_GroupId");

            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "Groups",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subgroup",
                table: "Subgroup",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContentFiles_Subgroup_SubgroupId",
                table: "ContentFiles",
                column: "SubgroupId",
                principalTable: "Subgroup",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subgroup_Groups_GroupId",
                table: "Subgroup",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
