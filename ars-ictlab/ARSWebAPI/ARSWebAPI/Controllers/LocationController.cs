using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARSWebAPI.Models.Contexts;
using ARSWebAPI.Models;

namespace ARSWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/location")]
    public class LocationController : Controller
    {
        private readonly LocationContext Context;

        public LocationController(LocationContext context)
        {
            this.Context = context;

            if (this.Context.Locations.Count() == 0)
            {
                this.Context.Locations.Add(new Location
                {
                    Name = "Wijnhaven",
                    Description = "Best Hogeschool Rotterdam Location"
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

            return CreatedAtRoute("GetLocation", new { id = location.LocationId }, location);
        }

        [HttpGet]
        public IEnumerable<Location> GetAll()
        {
            return this.Context.Locations.ToList();
        }

        [HttpGet("{id}", Name = "GetLocation")]
        public IActionResult GetById(long id)
        {
            Location item = this.Context.Locations.FirstOrDefault(c => c.LocationId == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Location location)
        {
            if (location == null || location.LocationId != id)
            {
                return BadRequest();
            }

            Location updatedLocation = this.Context.Locations.FirstOrDefault(t => t.LocationId == id);

            if (updatedLocation == null)
            {
                return NotFound();
            }

            updatedLocation.Name = location.Name;
            updatedLocation.Description = location.Description;

            this.Context.Locations.Update(updatedLocation);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Location location = this.Context.Locations.FirstOrDefault(c => c.LocationId  == id);

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