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
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Temperature> Temperatures {get; set;}
    }
}
