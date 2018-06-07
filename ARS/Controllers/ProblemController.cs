﻿using System;
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

        [HttpGet("problem/{name}")]
        public Problem GetByName(string name) => this.Context.Problems.FirstOrDefault(p => p.name == name);

        [HttpPost("add")]
        public IActionResult Create([FromBody] Problem problem)
        {
            if (problem == null)
            {
                return BadRequest();
            }

            problem.name = problem.name;

            this.Context.Problems.Add(problem);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetProblem", new { id = problem.id }, problem);
        }
    }
}