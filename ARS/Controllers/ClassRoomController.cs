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
    [Route("api/classroom")]
    public class ClassroomController : Controller
    {
        private readonly DatabaseContext Context;

        public ClassroomController(DatabaseContext context)
        {
            this.Context = context;

            if(this.Context.Classrooms.Count() == 0)
            {
                this.Context.Classrooms.Add(new Classroom {
                    name = "WD1016"
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] Classroom classroom)
        {
            if(classroom == null)
            {
                return BadRequest();
            }

            this.Context.Classrooms.Add(classroom);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetClassroom", new { id = classroom.id}, classroom);
        }

        [HttpGet]
        public IEnumerable<Classroom> GetAll()
        {
            return this.Context.Classrooms.ToList();
        }

        [HttpGet("{id}", Name = "GetClassroom")]
        public IActionResult GetById(long id)
        {
            Classroom item = this.Context.Classrooms.FirstOrDefault(c => c.id == id);

            if(item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpGet("location/{id}", Name = "GetLocationClassrooms")]
        public IEnumerable<Classroom> GetClassByLocId(long id)
        {
            return this.Context.Classrooms.Where(c => c.location_id == id).ToList();
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Classroom classroom)
        {
            if (classroom == null || classroom.id != id)
            {
                return BadRequest();
            }

            Classroom foundClassroom = this.Context.Classrooms.FirstOrDefault(t => t.id == id);

            if (foundClassroom == null)
            {
                return NotFound();
            }

            foundClassroom.name = classroom.name;

            this.Context.Classrooms.Update(foundClassroom);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == id);

            if(classroom == null)
            {
                return NotFound();
            }

            this.Context.Classrooms.Remove(classroom);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}