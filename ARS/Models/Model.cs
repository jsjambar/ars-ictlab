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
        public long userid { get; set; }
        public string username { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string password { get; set; }
        public int roleid { get; set; }
    }

    public class Classroom
    {
        public long classroomid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public DateTime starttime { get; set; }
        public DateTime endtime { get; set; }
        public bool isdisabled { get; set; } 
        public int locationid { get; set; }

    }

    public class Location
    {
        public long locationid { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }

    public class Role
    {
        public long roleid { get; set; }
        public string name { get; set; }
    }

    public class Reservation
    {
        public long reservationid { get; set; }
        public DateTime date { get; set; }
        public DateTime starttime { get; set; }
        public DateTime endtime { get; set; }  
        public int userid { get; set; }
        public User user { get; set; }
        public int classroomid { get; set; }

    }

    public class Problem
    {
        public long problemid { get; set; }
        public string name { get; set; }
    }

    public class Ticket
    {
        public long ticketid { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public string image { get; set;}
    }

}