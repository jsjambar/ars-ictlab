using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models.Contexts;
using ARS.Models;
using ARS.Helpers;

namespace ARS.Controllers
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

            user.Password = Helper.HashPassword(user.Password);

            this.Context.Users.Add(user);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetUser", new { id = user.UserId }, user);
        }

        [HttpPost("login")]
        public JsonResult Login([FromBody] string content)
        {
            string username = HttpContext.Request.Query["Username"];
            string password = HttpContext.Request.Query["Password"];
            return Json(this.Context.Users.Where(u => u.Username == username && u.Password == Helper.HashPassword(password)));
        }

        [HttpGet("all")]
        public IEnumerable<User> GetAll()
        {
            return this.Context.Users.ToList();
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetById(long id)
        {
            User item = this.Context.Users.FirstOrDefault(c => c.UserId == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] User user)
        {
            if (user == null || user.UserId != id)
            {
                return BadRequest();
            }

            User updatedUser = this.Context.Users.FirstOrDefault(t => t.UserId == id);

            if (updatedUser == null)
            {
                return NotFound();
            }

            updatedUser.FirstName = user.FirstName;
            updatedUser.LastName = user.LastName;
            updatedUser.BirthDate = user.BirthDate;
            updatedUser.Street = user.Street;
            updatedUser.City = user.City;

            this.Context.Users.Update(updatedUser);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            User user = this.Context.Users.FirstOrDefault(c => c.UserId == id);

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