﻿// <auto-generated />
using ARS.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace ARS.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125");

            modelBuilder.Entity("ARS.Models.Classroom", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("end_time");

                    b.Property<bool>("is_disabled");

                    b.Property<bool>("is_public");

                    b.Property<int>("location_id");

                    b.Property<string>("name");

                    b.Property<string>("qr_code");

                    b.Property<DateTime>("start_time");

                    b.HasKey("id");

                    b.ToTable("Classrooms");
                });

            modelBuilder.Entity("ARS.Models.Location", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.HasKey("id");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("ARS.Models.Notification", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("created_at");

                    b.Property<string>("description");

                    b.Property<string>("name");

                    b.Property<bool>("read");

                    b.Property<int>("role_id");

                    b.Property<long?>("roleid");

                    b.Property<int>("user_id");

                    b.Property<long?>("userid");

                    b.HasKey("id");

                    b.HasIndex("roleid");

                    b.HasIndex("userid");

                    b.ToTable("Notification");
                });

            modelBuilder.Entity("ARS.Models.Problem", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.HasKey("id");

                    b.ToTable("Problems");
                });

            modelBuilder.Entity("ARS.Models.Reservation", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<long?>("Classroomid");

                    b.Property<int>("classroom_id");

                    b.Property<DateTime>("created_at");

                    b.Property<DateTime>("end_time");

                    b.Property<DateTime>("start_time");

                    b.Property<int>("user_id");

                    b.Property<long?>("userid");

                    b.HasKey("id");

                    b.HasIndex("Classroomid");

                    b.HasIndex("userid");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("ARS.Models.Role", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.HasKey("id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("ARS.Models.Ticket", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("classroom_id");

                    b.Property<DateTime>("created_at");

                    b.Property<string>("description");

                    b.Property<string>("image");

                    b.Property<int>("problem_id");

                    b.Property<bool>("solved");

                    b.Property<int>("user_id");

                    b.HasKey("id");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("ARS.Models.User", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("first_name");

                    b.Property<string>("last_name");

                    b.Property<string>("password");

                    b.Property<int>("role_id");

                    b.Property<string>("username");

                    b.HasKey("id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ARS.Models.Notification", b =>
                {
                    b.HasOne("ARS.Models.Role", "role")
                        .WithMany()
                        .HasForeignKey("roleid");

                    b.HasOne("ARS.Models.User", "user")
                        .WithMany("notifications")
                        .HasForeignKey("userid");
                });

            modelBuilder.Entity("ARS.Models.Reservation", b =>
                {
                    b.HasOne("ARS.Models.Classroom", "Classroom")
                        .WithMany("reservations")
                        .HasForeignKey("Classroomid");

                    b.HasOne("ARS.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userid");
                });
#pragma warning restore 612, 618
        }
    }
}
