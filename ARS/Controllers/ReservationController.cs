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
                    classroom_id = 1
                });

                this.Context.SaveChanges();
            }
        }

        [HttpPost("add")]
        public JsonResult Create([FromBody] Reservation reservation)
        {
            if (reservation == null)
            {
                return new JsonResult(new { error = "2", errormessage = "Not found!" });
            }

            Reservation item = this.Context.Reservations.FirstOrDefault(
                c => 
                c.classroom_id == reservation.classroom_id &&
                c.date_of_reservation == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0) &&
                c.start_time == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.start_time.Hour + 2, 0, 0) &&
                c.end_time == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.end_time.Hour + 2, 0, 0)
            );

            if(item != null){
                return new JsonResult(new { error = "1", errormessage = "This timeslot has already been taken!" });
            }

            Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == reservation.classroom_id);
            User user  = this.Context.Users.FirstOrDefault(c => c.id == reservation.user_id);

            //Confirmation mail of reservation
            string subject = "Reservatie gemaakt op HRO!";
            string body = "U heeft lokaal " + classroom.name + " gereserveerd op ";
            body += reservation.date_of_reservation.Day + "-" + reservation.date_of_reservation.Month + "-" + reservation.date_of_reservation.Year;
            body += "om " + reservation.start_time.Hour + " tot " + reservation.end_time.Hour;
            //Send mail
            Helper.NotificationMail(user, subject, body);

            reservation.user_id = reservation.user_id;
            reservation.date_of_reservation = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0);
            reservation.created_at = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
            reservation.start_time = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.start_time.Hour + 2, 0, 0);
            reservation.end_time = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.end_time.Hour + 2, 0, 0);

            this.Context.Reservations.Add(reservation);
            this.Context.SaveChanges();

            return new JsonResult(new { error = "0", errormessage = "Success!" });
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

        [HttpGet("user/{id}")]
        public IEnumerable<Reservation> GetUserReservations(long id)
        {
            return this.Context.Reservations.Where(r => r.user_id == id);
        }

        [HttpGet("classroomById/{id}")]
        public IEnumerable<object> GetReservationsByClassroomId(long id)
        {
            Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == id);
            List<Reservation> reservations = this.Context.Reservations.Where(r => r.classroom_id == id).ToList();
            List<object> events = new List<object>();
            

            reservations.ForEach(r => {
                events.Add(new {
                    classroom = classroom,
                    title = $"{r.start_time.Hour}:00 - {r.end_time.Hour}:00",
                    start = r.date_of_reservation.ToString("MM/dd/yyyy HH:mm:ss"),
                    end = r.date_of_reservation.ToString("MM/dd/yyyy HH:mm:ss")
                });
            });

            return events;
        }

        [HttpGet("calendar/{id}")]
        public IEnumerable<object> GetReservationsByUserId(long id)
        {
            List<Reservation> reservations = this.Context.Reservations.Where(r => r.user_id == id).ToList();
            List<object> events = new List<object>();

            reservations.ForEach(r => {
                Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == r.classroom_id);
                if(classroom != null){
                    events.Add(new {
                        classroom = classroom.name,
                        title = $"{r.start_time.Hour}:00 - {r.end_time.Hour}:00",
                        start = r.date_of_reservation.ToString("MM/dd/yyyy HH:mm:ss"),
                        end = r.date_of_reservation.ToString("MM/dd/yyyy HH:mm:ss")
                    });
                }
            });

            return events;
        }

        [HttpPut("{id}")]
        public JsonResult Update(long id, [FromBody] Reservation reservation)
        {
            if (reservation == null || reservation.id != id)
            {
                return new JsonResult(new { error = "1", errormessage = "Not found!" });
            }

            Reservation exists = this.Context.Reservations.FirstOrDefault(c =>
                c.classroom_id == reservation.classroom_id &&
                c.date_of_reservation == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0) &&
                c.start_time == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.start_time.Hour + 2, 0, 0) &&
                c.end_time == new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.end_time.Hour + 2, 0, 0)
            );

            Reservation item = this.Context.Reservations.FirstOrDefault(c => c.id == id);

            if (exists == null)
            {
                item.date_of_reservation = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, 0, 0, 0);
                item.created_at = new DateTime(reservation.start_time.Year, reservation.start_time.Month, reservation.start_time.Day, reservation.start_time.Hour + 2, 0, 0);
                item.classroom_id = reservation.classroom_id;
                item.start_time = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.start_time.Hour + 2, 0, 0);
                item.end_time = new DateTime(reservation.date_of_reservation.Year, reservation.date_of_reservation.Month, reservation.date_of_reservation.Day, reservation.end_time.Hour + 2, 0, 0);

                this.Context.Reservations.Update(item);
                this.Context.SaveChanges();

                return new JsonResult(new { error = "0", errormessage = "Success!" });
            } else {
                return new JsonResult(new { error = "1", errormessage = "This timeslot has been taken!" });
            }

            
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

        [HttpGet("reservation/{name}")]
        public Reservation GetReservationById(int id) => this.Context.Reservations.FirstOrDefault(r => r.id == id);
    }
}