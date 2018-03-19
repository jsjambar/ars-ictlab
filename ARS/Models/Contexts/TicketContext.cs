using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models.Contexts
{
    public class TicketContext: DbContext
    {
        public TicketContext(DbContextOptions<TicketContext> options) : base(options)
        {
        }

        public DbSet<Ticket> Tickets { get; set; }
    }
}
