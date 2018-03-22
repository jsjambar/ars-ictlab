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
    [Route("api/Role")]
    public class RoleController : Controller
    {
        private readonly DatabaseContext Context;

        public RoleController(DatabaseContext context)
        {
            this.Context = context;

            if (this.Context.Roles.Count() == 0)
            {
                this.Context.Roles.Add(new Role
                {
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] Role role)
        {
            if (role == null)
            {
                return BadRequest();
            }

            this.Context.Roles.Add(role);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetLocation", new {  }, role);
        }

        //[HttpGet]
        //public IEnumerable<Location> GetAll()
        //{
        //    return this.Context.Roles.ToList();
        //}

        //[HttpGet("{id}", Name = "GetRole")]
        //public IActionResult GetById(long id)
        //{
        //    Location item = this.Context.Roles.FirstOrDefault(c => c.Id == id);

        //    if (item == null)
        //    {
        //        return NotFound();
        //    }

        //    return new ObjectResult(item);
        //}

        //[HttpPut("{id}")]
        //public IActionResult Update(long id, [FromBody] Role role)
        //{
        //    if (role == null || role.Id != id)
        //    {
        //        return BadRequest();
        //    }

        //    Role updatedRole = this.Context.Roles.FirstOrDefault(t => t.Id == id);

        //    if (updatedRole == null)
        //    {
        //        return NotFound();
        //    }

        //    this.Context.Roles.Update(updatedRole);
        //    this.Context.SaveChanges();

        //    return new NoContentResult();
        //}

        //[HttpDelete("{id}")]
        //public IActionResult Delete(long id)
        //{
        //    Role role = this.Context.Roles.FirstOrDefault(c => c.Id == id);

        //    if (role == null)
        //    {
        //        return NotFound();
        //    }

        //    this.Context.Locations.Remove(role);
        //    this.Context.SaveChanges();

        //    return new NoContentResult();
        //}
    }
}