using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {}

        public DbSet<User> Users { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
    }

    public class User
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
    }

    public class Classroom
    {
        public long ClassroomId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsDisabled { get; set; } 
        public int LocationId { get; set; }
        public Location Location { get; set; }
    }

    public class Location
    {
        public long LocationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class Role
    {
        public long RoleId { get; set; }
        public string Name { get; set; }
    }

    public class Reservation
    {
        public long ReservationId { get; set; }
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }  
        public int UserId { get; set; }
        public User User { get; set; }
        public int ClassroomId { get; set; }
        public Classroom Classroom { get; set; }

    }

    public class Problem
    {
        public long ProblemId { get; set; }
        public string Name { get; set; }
    }

    public class Ticket
    {
        public long TicketId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Image { get; set;}
    }

}