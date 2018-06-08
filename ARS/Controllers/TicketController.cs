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
        }

        //Get all tickets, user and system tickets
        [HttpGet("all")]
        public List<IEnumerable<Ticket>> GetAll(){
            List<IEnumerable<Ticket>> f = new List<IEnumerable<Ticket>>();
            List<Ticket> userTicket = new List<Ticket>();
            List<Ticket> systemTicket = new List<Ticket>();
            foreach (Ticket t in this.Context.Tickets)
            {
                if(t.user_id == 0){
                    systemTicket.Add(t);
                }
                else{
                    userTicket.Add(t);
                }
            }
            f.Add(userTicket);
            f.Add(systemTicket);

            return f;
        }

        //Get tickets of specific user
        [HttpGet("User/{id}", Name = "getUserTickets")]
        public List<Ticket> GetByUserId(long id)
        {
            return this.Context.Tickets.Where(t => t.user_id == id).ToList();
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

        //Get specific ticket
        [HttpGet("{id}", Name = "GetTicket")]
        public IActionResult GetById(long id)
        {
            Ticket item = this.Context.Tickets.FirstOrDefault(t => t.id == id);

            if (item == null)
            {
                return new JsonResult(new { error = "1", errormessage = "Ticket not found!" });
            }

            return new ObjectResult(item);
        }

        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Ticket ticket)
        {
            if (ticket == null || ticket.id != id)
            {
                return BadRequest();
            }

            Ticket item = this.Context.Tickets.FirstOrDefault(t => t.id == id);

            if (item == null)
            {
                return NotFound();
            }

            item.description = ticket.description;
            item.classroom_id = ticket.classroom_id;
            item.solved = ticket.solved;
            item.problem_id = ticket.problem_id;

            this.Context.Tickets.Update(item);
            this.Context.SaveChanges();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            Ticket item = this.Context.Tickets.FirstOrDefault(t => t.id == id);

            if (item == null)
            {
                return NotFound();
            }

            this.Context.Tickets.Remove(item);
            this.Context.SaveChanges();

            return new NoContentResult();
        }
    }
}