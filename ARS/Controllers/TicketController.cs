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
    [Route("api/Ticket")]
    public class TicketController : Controller
    {
        private readonly DatabaseContext Context;
        public TicketController (DatabaseContext context)
        {
            this.Context = context;
            if(this.Context.Tickets.Count() == 0)
            {
                this.Context.Tickets.Add(new Ticket
                {
                    created_at = DateTime.Now,
                    user_id = 1,
                    problem_id = 1,
                    classroom_id = 1,
                    description = "Dashboard laat geen beeld zien, kan geen reservering plaatsen."
                });
                this.Context.SaveChanges();
            }
        }

        [HttpGet("all")]
        public IEnumerable<Ticket> GetAll(){
            return this.Context.Tickets.ToList();
        }


        [HttpPost("create")]
        public IActionResult Create([FromBody] Ticket ticket)
        {
            if(ticket == null)
            {
                return BadRequest();
            }

            this.Context.Tickets.Add(ticket);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetTicket", new { id = ticket.id }, ticket);
        }


        // [HttpPost("create1")]
        // public JsonResult Create([FromBody] Ticket ticket)
        // {
        //     if (ticket == null)
        //     {
        //         return Json(new { Message = "Ticket is empty"});
        //     }

        //     // ticket.Date = DateTime.Now;
        //     // ticket.UserId = 1;
        //     // ticket.Description = "Dashboard laat geen beeld zien, kan geen reservering plaatsen.";

        //     this.Context.Tickets.Add(ticket);
        //     this.Context.SaveChanges();

        //     return Json(ticket);

        //     //return CreatedAtRoute("GetTicket", new { id = ticket.TicketId }, ticket);
        // }
    }
}