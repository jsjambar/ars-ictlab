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
    [Route("api/location")]
    public class LocationController : Controller
    {
        private readonly DatabaseContext Context;

        public LocationController(DatabaseContext context)
        {
            this.Context = context;

            if (this.Context.Locations.Count() == 0)
            {
                this.Context.Locations.Add(new Location
                {
                    name = "Wijnhaven 61"
                });

                this.Context.Locations.Add(new Location
                {
                    name = "Wijnhaven 99"
                });

                this.Context.Locations.Add(new Location
                {
                    name = "Wijnhaven 122"
                });

                this.Context.Locations.Add(new Location
                {
                    name = "Wijnhaven 163"
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] Location location)
        {
            if (location == null)
            {
                return BadRequest();
            }

            this.Context.Locations.Add(location);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetLocation", new { id = location.id }, location);
        }

        [HttpGet("all")]
        public IEnumerable<Location> GetAll()
        {
            return this.Context.Locations.ToList();
        }

        [HttpGet("{id}", Name = "GetLocation")]
        public IActionResult GetById(long id)
        {
            Location item = this.Context.Locations.FirstOrDefault(c => c.id == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Location location)
        {
            if (location == null || location.id != id)
            {
                return BadRequest();
            }

            Location updatedLocation = this.Context.Locations.FirstOrDefault(t => t.id == id);

            if (updatedLocation == null)
            {
                return NotFound();
            }

            updatedLocation.name = location.name;

            this.Context.Locations.Update(updatedLocation);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Location location = this.Context.Locations.FirstOrDefault(c => c.id  == id);

            if (location == null)
            {
                return NotFound();
            }

            this.Context.Locations.Remove(location);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}