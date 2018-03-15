using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;
using ARS.Json;

namespace ARS.Controllers
{

    [Route("api/[controller]")]
    public class ReservationController : Controller
    {
        private readonly DatabaseContext context;

        public ReservationController(DatabaseContext context){
            this.context = context;
        }
        
        [HttpGet("add")]
        public JsonResponse Add_reservation(){
            Reservation r1 = new Reservation
            {
                LocationId = 1,
                ClassroomId = 1,
                UserId = 1,
                Date = new DateTime(2001 - 01 - 01),
                StartTime = new DateTime(2001 - 01 - 01),
                EndTime = new DateTime(2001 - 01 - 01)
            };
            context.Reservations.Add(r1);
            context.SaveChanges();
            return new JsonSuccess("Successfully added reservation: " + r1.ClassroomId + " " + r1.UserId);  
        }
    }
}
