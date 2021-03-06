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

        //[HttpPost("update")]
        //public JsonResult Create([FromBody] Temperature temp)
        //{
        //    Temperature temperature = this.Context.Temperatures.FirstOrDefault(t => t.classroom_id == temp.classroom_id);

        //    if(temperature == null){
        //        temperature = temp;
        //        this.Context.Temperatures.Add(temperature);
        //    }else{
        //        this.Context.Temperatures.Update(temperature);
        //    }

        //    this.Context.SaveChanges();
        //    return Json(new {response = "success", temperature = temperature});
        //}

        [HttpGet("classroom/{id}")]
        public long GetClassroomTemperature(long classroomId){
            Temperature temperature = this.Context.Temperatures.FirstOrDefault(t => t.classroom_id == classroomId);
            int temp = 0;
            
            if(temperature != null){
                temp = temperature.temperature;
            }

            return temp;
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody] Temperature temperature)
        {
            if (temperature == null)
            {
                return BadRequest();
            }

            this.Context.Temperatures.Add(temperature);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetTemperature", new { id = temperature.id }, temperature);
        }
    }
}