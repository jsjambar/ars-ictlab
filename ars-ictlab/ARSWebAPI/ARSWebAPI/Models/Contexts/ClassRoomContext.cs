using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models.Contexts
{
    public class ClassRoomContext : DbContext
    {
        public ClassRoomContext(DbContextOptions<ClassRoomContext> options) : base(options)
        {
        }

        public DbSet<ClassRoom> ClassRooms { get; set; }
    }
}
