using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace New_Reservation_System
{
    public class databaseContext : DbContext
    {
        public databaseContext(DbContextOptions<databaseContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}