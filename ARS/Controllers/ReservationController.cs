using System;
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
    [Route("api/Reservation")]
    public class ReservationController : Controller
    {
        private readonly DatabaseContext Context;
        
        public ReservationController(DatabaseContext context)
        {
            this.Context = context;

            if (this.Context.Reservations.Count() == 0)
            {
                this.Context.Reservations.Add(new Reservation
                {
                    id = 0,
                    user_id = 1,
                    created_at = new DateTime(2018, 03, 18),
                    date_of_reservation = new DateTime(2018, 04, 23),
                    start_time = new DateTime(2018, 03, 19, 9, 0, 0),
                    end_time = new DateTime(2018, 03, 19, 11, 0, 0),
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost("add")]
        public IActionResult Create([FromBody] Reservation reservation)
        {
            if (reservation == null)
            {
                return BadRequest();
            }

            reservation.date_of_reservation = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0);
            reservation.created_at = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
            reservation.start_time = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
            reservation.end_time = new DateTime(reservation.end_time.Year, reservation.end_time.Month, reservation.end_time.Day, reservation.end_time.Hour + 2, 0, 0);

            this.Context.Reservations.Add(reservation);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetReservation", new { reservation.id }, reservation);
        }

        [HttpGet("all")]
        public IEnumerable<Reservation> getAll()
        {
            return this.Context.Reservations.ToList();
        }

        [HttpGet("{id}", Name = "GetReservation")]
        public IActionResult GetById(long id)
        {
            Reservation item = this.Context.Reservations.FirstOrDefault(c => c.id == id);

            if (item == null)
            {
                return NotFound();
            }

            return new ObjectResult(item);
        }

        [HttpGet("classroomById/{id}")]
        public IEnumerable<object> GetReservationsByClassroomId(long id)
        {
            List<Reservation> reservations = this.Context.Reservations.Where(r => r.classroom_id == id).ToList();
            List<object> events = new List<object>();

            reservations.ForEach(r => {
                events.Add(new {
                    Start = r.start_time,
                    End = r.end_time
                });
            });

            return events;
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Reservation reservation)
        {
            if (reservation == null || reservation.id != id)
            {
                return BadRequest();
            }

            Reservation item = this.Context.Reservations.FirstOrDefault(t => t.id == id);

            if (item == null)
            {
                return NotFound();
            }

            item.date_of_reservation = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0);
            item.created_at = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
            item.classroom_id = reservation.classroom_id;
            item.start_time = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
            item.end_time = new DateTime(reservation.end_time.Year, reservation.end_time.Month, reservation.end_time.Day, reservation.end_time.Hour + 2, 0, 0);

            this.Context.Reservations.Update(item);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Reservation reservation = this.Context.Reservations.FirstOrDefault(c => c.id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            this.Context.Reservations.Remove(reservation);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}