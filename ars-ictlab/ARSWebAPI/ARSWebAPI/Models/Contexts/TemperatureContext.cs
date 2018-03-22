using ARSWebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class TemperatureContext: DbContext
{
    public TemperatureContext(DbContextOptions<TemperatureContext> options) : base(options)
    {
    }

    public DbSet<Temperature> Temperatures { get; set; }
}
