using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;

namespace ARS.Controllers
{

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly DatabaseContext context;

        public UserController(DatabaseContext context){
            this.context = context;
        }

        [HttpGet("[action]")]
        public string get_test()
        {
            return "test success";
        }

        [HttpGet("all")]
        public IEnumerable<User> Get_users()
        {
            return context.Users; 
        }

        [HttpPost("register")]
        public string Set_user([FromBody] User user){
            context.Users.Add(user);
            context.SaveChanges();
            return "User: " + user.Username + "registered";
        }
    }
}
