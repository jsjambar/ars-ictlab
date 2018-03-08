using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using New_Reservation_System.Models;

namespace New_Reservation_System.Controllers
{

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly DatabaseContext context;

        public UserController(DatabaseContext context){
            this.context = context;
        }

        [HttpGet("test")]
        public string Api_test()
        {
            return "test success";
        }

        [HttpGet("all")]
        public IEnumerable<User> Get_users()
        {
            // User user1 = new User();
            // user1.UserId = 1;
            // user1.Username = "Jef";
            // user1.Password = "Supersecret";

            // return new User[] { user1 };

            return context.Users; 
        }

        [HttpPost]
        public string Set_user([FromBody] User user){
            context.Users.Add(user);
            context.SaveChanges();
            return "User registered";
        }
    }
}
