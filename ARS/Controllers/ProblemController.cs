using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;

namespace ARS.Controllers
{
    [Produces("application/json")]
    [Route("api/Problem")]
    public class ProblemController : Controller
    {
        private readonly DatabaseContext Context;
        public ProblemController (DatabaseContext context)
        {
            this.Context = context;
            if(this.Context.Problems.Count() == 0)
            {
                this.Context.Problems.Add(new Problem
                {
                    id = 1,
                    name = "Scherm is kapot."
                });
                this.Context.SaveChanges();
            }
        }    

        [HttpGet("all")]
        public IEnumerable<Problem> GetAll(){
            return this.Context.Problems.ToList();
        }

        [HttpGet("{id}", Name = "GetProblem")]
        public IActionResult GetById(long id)
        {
            Problem item = this.Context.Problems.FirstOrDefault(p => p.id == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }


    }
}