using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models.Contexts
{
    public class RoleContext: DbContext
    {
        public RoleContext(DbContextOptions<UserContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
    }
}
