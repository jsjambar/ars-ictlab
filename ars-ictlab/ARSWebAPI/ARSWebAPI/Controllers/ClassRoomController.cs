using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARSWebAPI.Models.Contexts;
using ARSWebAPI.Models;

namespace ARSWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/classroom")]
    public class ClassRoomController : Controller
    {
        private readonly ClassRoomContext Context;

        public ClassRoomController(ClassRoomContext context)
        {
            this.Context = context;

            if(this.Context.ClassRooms.Count() == 0)
            {
                this.Context.ClassRooms.Add(new ClassRoom {
                    Name = "WD1016"
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] ClassRoom classRoom)
        {
            if(classRoom == null)
            {
                return BadRequest();
            }

            this.Context.ClassRooms.Add(classRoom);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetClassroom", new { id = classRoom.ClassroomId}, classRoom);
        }

        [HttpGet]
        public IEnumerable<ClassRoom> GetAll()
        {
            return this.Context.ClassRooms.ToList();
        }

        [HttpGet("{id}", Name = "GetClassroom")]
        public IActionResult GetById(long id)
        {
            ClassRoom item = this.Context.ClassRooms.FirstOrDefault(c => c.ClassroomId == id);

            if(item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] ClassRoom classRoom)
        {
            if (classRoom == null || classRoom.ClassroomId != id)
            {
            return BadRequest();
            }

            ClassRoom classroom = this.Context.ClassRooms.FirstOrDefault(t => t.ClassroomId == id);

            if (classroom == null)
            {
                return NotFound();
            }

            classroom.Name = classRoom.Name;
            classroom.Description = classRoom.Description;

            this.Context.ClassRooms.Update(classroom);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            ClassRoom classroom = this.Context.ClassRooms.FirstOrDefault(c => c.ClassroomId == id);

            if(classroom == null)
            {
                return NotFound();
            }

            this.Context.ClassRooms.Remove(classroom);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}