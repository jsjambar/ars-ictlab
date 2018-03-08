using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ARS.Controllers
{

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly databaseContext context;

        public UserController(databaseContext context){
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
            // User user1 = new User();
            // user1.Id = 1;
            // user1.Username = "Jef";
            // user1.Password = "Supersecret";

            // User[] users = new User[] { user1 };
            // // User[] users = new User[] { };

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
