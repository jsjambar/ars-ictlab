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
        public JsonResult Create([FromBody] Temperature temp)
        {
            Temperature temperature = this.Context.Temperatures.FirstOrDefault(t => t.classroom_id == temp.classroom_id);

            if(temperature == null){
                this.Context.Temperatures.Add(temperature);
            }else{
                this.Context.Temperatures.Update(temperature);
            }

            this.Context.SaveChanges();
            return Json(new {response = "success"});
        }
    }
}