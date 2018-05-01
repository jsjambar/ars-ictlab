using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;
using static QRCoder.PayloadGenerator;
using QRCoder;
using System.Drawing.Imaging;
using System.IO;
using System.Drawing;

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

            if(classroom == null){
                return BadRequest();
            }

            Url generator = new Url("https://www.google.nl"); // replace with url to shorthand reservation creation.
            string payload = generator.ToString();

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeAsBitmap = qrCode.GetGraphic(20);

            Random rndm = new Random();
            var firstPart = rndm.Next(1, 2000000);
            var randomName = firstPart.ToString() + classroom.name;
            var fileRoute = Directory.GetCurrentDirectory() + "/wwwroot/qrcodes/" + randomName + ".png";

            using (var m = new MemoryStream())
            {
                qrCodeAsBitmap.Save(m, ImageFormat.Png);
                var img = Image.FromStream(m);
                img.Save(fileRoute);
                img.Dispose();
            }

            classroom.qr_code = fileRoute;
            classroom.start_time = new DateTime(classroom.start_time.Year, classroom.start_time.Month, classroom.start_time.Day, classroom.start_time.Hour + 2, 0, 0);
            classroom.end_time = new DateTime(classroom.end_time.Year, classroom.end_time.Month, classroom.end_time.Day, classroom.end_time.Hour + 2, 0, 0);

            this.Context.Classrooms.Add(classroom);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetClassroom", new { id = classroom.id}, classroom);
        }

        [HttpGet("all")]
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
            foundClassroom.location_id = classroom.location_id;
            foundClassroom.start_time = new DateTime(classroom.start_time.Year, classroom.start_time.Month, classroom.start_time.Day, classroom.start_time.Hour + 2, 0, 0);
            foundClassroom.end_time = new DateTime(classroom.end_time.Year, classroom.end_time.Month, classroom.end_time.Day, classroom.end_time.Hour + 2, 0, 0);
            foundClassroom.is_public = classroom.is_public;
            foundClassroom.is_disabled = classroom.is_disabled;

            this.Context.Classrooms.Update(foundClassroom);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == id);

            var response = new ObjectResult( new {
                errorStatus = 0
            });

            if(classroom == null)
            {
                return NotFound();
            }

            this.Context.Classrooms.Remove(classroom);
            this.Context.SaveChanges();

            return response;
        }
    }
}