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
    }
}