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
    [Route("api/Temperature")]
    public class TemperatureController : Controller
    {
        private readonly DatabaseContext Context;

        public TemperatureController(DatabaseContext context)
        {
            this.Context = context;
        }

        [HttpPost("update")]
        public JsonResult Create([FromBody] int classroom_id)
        {
            Temperature temperature = this.Context.Temperatures.FirstOrDefault(t => t.classroom_id == classroom_id);

            if(temperature == null){
                temperature = new Temperature();
                temperature.classroom_id = classroom_id;
                temperature.temperature = 40;
                this.Context.Temperatures.Add(temperature);
            }else{
                temperature.temperature = temperature.temperature + 5;
            }

            this.Context.SaveChanges();
            return Json(new {response = "success"});
        }
    }
}