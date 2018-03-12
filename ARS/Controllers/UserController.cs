using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;
using ARS.Json;

namespace ARS.Controllers
{

    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly DatabaseContext context;

        public UserController(DatabaseContext context){
            this.context = context;
        }

        [HttpGet("all")]
        public IEnumerable<User> Get_users()
        {
            return context.Users; 
        }

        [HttpGet("fill")]
        public JsonResponse Fill_user(){
            User u1 = new User();
            u1.Username = "0908936";
            u1.FirstName = "Jefaro";
            u1.LastName = "Constancia";
            u1.Password = "Geheim";
            u1.RoleId = 1;
            context.Users.Add(u1);
            context.SaveChanges();
            return new JsonSuccess("Successfully added user: " + u1.FirstName + " " + u1.LastName);  
        }

        [HttpPost("register")]
        public string Set_user([FromBody] User user){
            context.Users.Add(user);
            context.SaveChanges();
            return "User: " + user.FirstName + "registered";
        }
    }
}
