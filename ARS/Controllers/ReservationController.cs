using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS.Models.Contexts;
using ARS.Models;
using ARS.Helpers;

namespace ARS.Controllers
{
    [Produces("application/json")]
    [Route("api/Reservation")]
    public class ReservationController : Controller
    {
        private readonly ReservationContext Context;
        
        public ReservationController(ReservationContext context)
        {
            this.Context = context;

            if (this.Context.Reservations.Count() == 0)
            {
                this.Context.Reservations.Add(new Reservation
                {
                    ClassroomId = 1,
                    UserId = 1,
                    Date = new DateTime(2018, 03, 18),
                    StartTime = new DateTime(2018, 03, 19, 9, 0, 0),
                    EndTime = new DateTime(2018, 03, 19, 11, 0, 0),
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] Reservation reservation)
        {
            if (reservation == null)
            {
                return BadRequest();
            }

            this.Context.Reservations.Add(reservation);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetReservation", new { id = reservation.ReservationId }, reservation);
        }

        [HttpGet("all")]
        public IEnumerable<Reservation> getAll()
        {
            return this.Context.Reservations.ToList();
        }
    }
}