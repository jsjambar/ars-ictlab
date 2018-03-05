using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace arsictlab.Controllers
{
    public class ClassroomController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View("Index");
        }

        public string GetTemperature()
        {
            var response = new { error = 0, temperature = new { F = 90, C = 20 } };
            return JsonConvert.SerializeObject(response);
        }
    }
}
