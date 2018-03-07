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
    [Route("api/User")]
    public class UserController : Controller
    {
        private readonly UserContext Context;

        public UserController(UserContext context)
        {
            this.Context = context;

            if (this.Context.Users.Count() == 0)
            {
                this.Context.Users.Add(new User
                {
                    FirstName = "Mark",
                    LastName = "Thal"
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            this.Context.Users.Add(user);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetUser", new { id = user.Id }, user);
        }

        [HttpGet]
        public IEnumerable<User> GetAll()
        {
            return this.Context.Users.ToList();
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetById(long id)
        {
            User item = this.Context.Users.FirstOrDefault(c => c.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] User user)
        {
            if (user == null || user.Id != id)
            {
                return BadRequest();
            }

            User updatedUser = this.Context.Users.FirstOrDefault(t => t.Id == id);

            if (updatedUser == null)
            {
                return NotFound();
            }

            updatedUser.FirstName = user.FirstName;
            updatedUser.LastName = user.LastName;

            this.Context.Users.Update(updatedUser);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            User user = this.Context.Users.FirstOrDefault(c => c.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            this.Context.Users.Remove(user);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}