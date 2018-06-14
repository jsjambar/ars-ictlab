using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;
using ARS.Helpers;

namespace ARS.Controllers
{
    [Produces("application/json")]
    [Route("api/User")]
    public class UserController : Controller
    {
        private readonly DatabaseContext Context;

        public UserController(DatabaseContext context)
        {
            this.Context = context;

            if (this.Context.Users.Count() == 0)
            {
                this.Context.Users.Add(new User
                {
                    first_name = "Global",
                    last_name = "Admin",
                    username = "123@hr.nl",
                    password = "tset:HawaianJase",
                    role_id = 1
                });

                this.Context.Users.Add(new User
                {
                    first_name = "Global",
                    last_name = "User",
                    username = "12345@hr.nl",
                    password = "tset:HawaianJase",
                    role_id = 2
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost("add")]
        public IActionResult Create([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            user.password = Helper.HashPassword(user.password);

            this.Context.Users.Add(user);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetUser", new { id = user.id }, user);
        }

        [HttpPost("login")]
        public JsonResult Login([FromBody] LoginObject content)
        {
            User user = this.Context.Users.FirstOrDefault(u => u.username == content.username && u.password == Helper.HashPassword(content.password));
            if(user == null)
                return Json(new {response = 0});
            Response.Cookies.Append("login", user.id.ToString());
            return Json(new {response = 1});
        }

        [HttpGet("logout")]
        public void Logout()
        {
            Response.Cookies.Delete("login");
        }

        [HttpGet("all")]
        public IEnumerable<User> GetAll()
        {
            return this.Context.Users.ToList();
        }

        [HttpGet("{id}", Name = "GetUser")]
        public IActionResult GetById(long id)
        {
            User item = this.Context.Users.FirstOrDefault(c => c.id == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpGet("finduser/{username}")]
        public User GetByUsername(string username) => this.Context.Users.FirstOrDefault(u => u.username == username);

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] User user)
        {
            if (user == null || user.id != id)
            {
                return BadRequest();
            }

            User updatedUser = this.Context.Users.FirstOrDefault(t => t.id == id);

            if (updatedUser == null)
            {
                return NotFound();
            }

            updatedUser.first_name = user.first_name;
            updatedUser.last_name = user.last_name;

            this.Context.Users.Update(updatedUser);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            User user = this.Context.Users.FirstOrDefault(c => c.id == id);

            if (user == null)
            {
                return NotFound();
            }

            this.Context.Users.Remove(user);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpGet("/user/{username}")]
        public User GetByName(string username) => this.Context.Users.FirstOrDefault(u => u.username == username);
    }

    public class LoginObject {
        public string username { get; set; }
        public string password { get; set; }
    }
}