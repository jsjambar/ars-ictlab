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
            u1.username = "0908936";
            u1.firstname = "Jefaro";
            u1.lastname = "Constancia";
            u1.password = "Geheim";
            u1.roleid = 1;
            context.Users.Add(u1);
            context.SaveChanges();
            return new JsonSuccess("Successfully added user: " + u1.firstname + " " + u1.lastname);  
        }

        [HttpPost("add")]
        public string Set_user([FromBody] User user){
            context.Users.Add(user);    
            context.SaveChanges();
            return "User: " + user.firstname + "registered";
        }
    }
}
