using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace ARS.Migrations
{
    public partial class SomeIdUpdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Temperature_TemperatureId1",
                table: "Classrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Classrooms_ClassroomId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Classrooms_ClassroomId1",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ClassroomId1",
                table: "Reservations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_TemperatureId1",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "ClassroomId1",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ClassRoomId",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "ClassroomId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "TemperatureId1",
                table: "Classrooms");

            migrationBuilder.RenameColumn(
                name: "ClassroomId",
                table: "Problems",
                newName: "ClassRoomId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_ClassroomId",
                table: "Problems",
                newName: "IX_Problems_ClassRoomId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Locations",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Classrooms",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Available",
                table: "Classrooms",
                newName: "available");

            migrationBuilder.RenameColumn(
                name: "TemperatureId",
                table: "Classrooms",
                newName: "temperature_id");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Classrooms",
                newName: "start_time");

            migrationBuilder.RenameColumn(
                name: "Public",
                table: "Classrooms",
                newName: "is_public");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Classrooms",
                newName: "location_id");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Classrooms",
                newName: "end_time");

            migrationBuilder.AlterColumn<int>(
                name: "ClassRoomId",
                table: "Problems",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameColumn(
                name: "ClassRoomId",
                table: "Problems",
                newName: "ClassroomId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_ClassRoomId",
                table: "Problems",
                newName: "IX_Problems_ClassroomId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Locations",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Classrooms",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "available",
                table: "Classrooms",
                newName: "Available");

            migrationBuilder.RenameColumn(
                name: "temperature_id",
                table: "Classrooms",
                newName: "TemperatureId");

            migrationBuilder.RenameColumn(
                name: "start_time",
                table: "Classrooms",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "location_id",
                table: "Classrooms",
                newName: "LocationId");

            migrationBuilder.RenameColumn(
                name: "is_public",
                table: "Classrooms",
                newName: "Public");

            migrationBuilder.RenameColumn(
                name: "end_time",
                table: "Classrooms",
                newName: "EndTime");

            migrationBuilder.AddColumn<long>(
                name: "ClassroomId1",
                table: "Reservations",
                nullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "ClassroomId",
                table: "Problems",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "ClassRoomId",
                table: "Problems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "LocationId",
                table: "Locations",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Locations",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ClassroomId",
                table: "Classrooms",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Classrooms",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "Classrooms",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "TemperatureId1",
                table: "Classrooms",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "LocationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Classrooms",
                table: "Classrooms",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ClassroomId1",
                table: "Reservations",
                column: "ClassroomId1");

            migrationBuilder.CreateIndex(
                name: "IX_Classrooms_TemperatureId1",
                table: "Classrooms",
                column: "TemperatureId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Temperature_TemperatureId1",
                table: "Classrooms",
                column: "TemperatureId1",
                principalTable: "Temperature",
                principalColumn: "TemperatureId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Classrooms_ClassroomId",
                table: "Problems",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "ClassroomId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Classrooms_ClassroomId1",
                table: "Reservations",
                column: "ClassroomId1",
                principalTable: "Classrooms",
                principalColumn: "ClassroomId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
