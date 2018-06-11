﻿using System;
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
                    name = "WD1016",
                    location_id = 1
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "WD1017",
                    location_id = 1
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "WD1018",
                    location_id = 1
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "WH1012",
                    location_id = 2
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "WH12",
                    location_id = 2
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "WN07",
                    location_id = 3
                });

                this.Context.Classrooms.Add(new Classroom {
                    name = "Andy 4",
                    location_id = 4
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

            classroom.start_time = new DateTime(2018, 12, 12, 2, 0, 0);
            classroom.end_time = new DateTime(2018, 12, 12, 2, 0, 0);

            this.Context.Classrooms.Add(classroom);
            this.Context.SaveChanges();

            Classroom newClassroom = this.Context.Classrooms.FirstOrDefault(t => t.id == classroom.id);
            Url generator = new Url("https://localhost:5000/reserve/"+newClassroom.id);
            string payload = generator.ToString();

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeAsBitmap = qrCode.GetGraphic(20);

            Random rndm = new Random();
            var firstPart = rndm.Next(1, 2000000);
            var randomName = firstPart.ToString() + newClassroom.id.ToString();
            var fileRoute = Directory.GetCurrentDirectory() + "/wwwroot/qrcodes/" + randomName + ".png";

            using (var m = new MemoryStream())
            {
                qrCodeAsBitmap.Save(m, ImageFormat.Png);
                var img = Image.FromStream(m);
                img.Save(fileRoute);
                img.Dispose();
            }

            newClassroom.qr_code = "/qrcodes/" + randomName + ".png";
            this.Context.Classrooms.Update(newClassroom);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetClassroom", new { id = classroom.id}, classroom);
        }

        [HttpGet("all")]
        public IEnumerable<Classroom> GetAll()
        {
            return this.Context.Classrooms.ToList();
        }

        [HttpGet("location/{id}/classrooms")]
        public IEnumerable<Classroom> GetClassroomsByLocationid(long id)
        {
            return this.Context.Classrooms.Where(c => c.location_id == id && c.is_disabled == false).ToList();
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
            return this.Context.Classrooms.Where(c => c.location_id == id && c.is_disabled == false).ToList();
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

            List<Reservation> reservations = this.Context.Reservations.Where(r => r.classroom_id == id).ToList();
            foreach(Reservation reservation in reservations)
            {
                this.Context.Reservations.Remove(reservation);
            }

            List<Ticket> tickets = this.Context.Tickets.Where(t => t.classroom_id == id).ToList();
            foreach (Ticket ticket in tickets)
            {
                this.Context.Tickets.Remove(ticket);
            }

            this.Context.Classrooms.Remove(classroom);
            this.Context.SaveChanges();

            return response;
        }
    }
}