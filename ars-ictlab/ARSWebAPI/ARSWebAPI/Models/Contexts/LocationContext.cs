using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models.Contexts
{
    public class LocationContext : DbContext
    {
        public LocationContext(DbContextOptions<ReservationContext> options) : base(options)
        {
        }

        public DbSet<Location> Locations { get; set; }
    }
}
