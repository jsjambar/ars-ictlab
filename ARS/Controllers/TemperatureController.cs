using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;

namespace ARS.Controllers
{
    [Produces("application/json")]
    [Route("api/Temperature")]
    public class TemperatureController : Controller
    {
        private readonly TemperatureContext Context;

        public TemperatureController(TemperatureContext context)
        {
            Context = context;

            if (Context.Temperatures.Count() == 0)
            {
                Context.Temperatures.Add(new Temperature { Celcius = 21f, ClassroomId = 1 });
                Context.SaveChanges();
            }
        }

        [HttpGet("{id}", Name = "GetTemperature")]
        public IActionResult GetById(long id)
        {
            var item = this.Context.Temperatures.FirstOrDefault(t => t.TemperatureId == id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
    }
}