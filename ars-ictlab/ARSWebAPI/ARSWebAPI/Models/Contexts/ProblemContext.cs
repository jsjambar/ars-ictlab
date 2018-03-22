using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models.Contexts
{
    public class ProblemContext
    {
        public class LocationContext : DbContext
        {
            public LocationContext(DbContextOptions<LocationContext> options) : base(options)
            {
            }

            public DbSet<Problem> Problems { get; set; }
        }
    }
}
