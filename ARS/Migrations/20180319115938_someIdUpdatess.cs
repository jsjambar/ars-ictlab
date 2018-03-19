using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ARS.Migrations
{
    public partial class someIdUpdatess : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Classrooms_ClassRoomId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Classrooms_ClassroomId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Temperature_Classrooms_ClassroomId",
                table: "Temperature");

            migrationBuilder.DropIndex(
                name: "IX_Temperature_ClassroomId",
                table: "Temperature");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ClassroomId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Problems_ClassRoomId",
                table: "Problems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "id",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "id",
                table: "Classrooms");

            migrationBuilder.AddColumn<long>(
                name: "ClassRoomId",
                table: "Reservations",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ClassRoomId1",
                table: "Problems",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "LocationId",
                table: "Locations",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<long>(
                name: "ClassRoomId",
                table: "Classrooms",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<long>(
                name: "TemperatureId",
                table: "Classrooms",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "LocationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms",
                column: "ClassRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ClassRoomId",
                table: "Reservations",
                column: "ClassRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_ClassRoomId1",
                table: "Problems",
                column: "ClassRoomId1");

            migrationBuilder.CreateIndex(
                name: "IX_Classrooms_TemperatureId",
                table: "Classrooms",
                column: "TemperatureId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Temperature_TemperatureId",
                table: "Classrooms",
                column: "TemperatureId",
                principalTable: "Temperature",
                principalColumn: "TemperatureId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Classrooms_ClassRoomId1",
                table: "Problems",
                column: "ClassRoomId1",
                principalTable: "Classrooms",
                principalColumn: "ClassRoomId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Classrooms_ClassRoomId",
                table: "Reservations",
                column: "ClassRoomId",
                principalTable: "Classrooms",
                principalColumn: "ClassRoomId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Temperature_TemperatureId",
                table: "Classrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Classrooms_ClassRoomId1",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Classrooms_ClassRoomId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ClassRoomId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Problems_ClassRoomId1",
                table: "Problems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_TemperatureId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "ClassRoomId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ClassRoomId1",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "ClassRoomId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "TemperatureId",
                table: "Classrooms");

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "Locations",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "Classrooms",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IX_Temperature_ClassroomId",
                table: "Temperature",
                column: "ClassroomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ClassroomId",
                table: "Reservations",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_ClassRoomId",
                table: "Problems",
                column: "ClassRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Classrooms_ClassRoomId",
                table: "Problems",
                column: "ClassRoomId",
                principalTable: "Classrooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Classrooms_ClassroomId",
                table: "Reservations",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Temperature_Classrooms_ClassroomId",
                table: "Temperature",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
