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
            //List of all tickets
            List<IEnumerable<Ticket>> allTickets = new List<IEnumerable<Ticket>>();
            //List of all user tickets
            List<Ticket> userTicket = new List<Ticket>();
            //List of all system tickets
            List<Ticket> systemTicket = new List<Ticket>();

            foreach (Ticket t in this.Context.Tickets)
            {
                //System tickets
                if(t.user_id == 0){
                    systemTicket.Add(t);
                }
                //User tickets
                else{
                    userTicket.Add(t);
                }
            }
            //Add the lists to allTickets
            allTickets.Add(userTicket);
            allTickets.Add(systemTicket);

            return allTickets;
        }

        //Get tickets of specific user
        [HttpGet("User/{id}", Name = "getUserTickets")]
        public List<Ticket> GetByUserId(long id)
        {
            return this.Context.Tickets.Where(t => t.user_id == id).ToList();
        }

        //Add ticket
        [HttpPost("create")]
        public IActionResult Create([FromBody] Ticket ticket)
        {
            if(ticket == null)
            {
                return BadRequest();
            }

            //retrieve classroom and user for ticket
            Classroom classroom = this.Context.Classrooms.FirstOrDefault(c => c.id == ticket.classroom_id);
            User user  = this.Context.Users.FirstOrDefault(c => c.id == ticket.user_id);

            //Confirmation mail of ticket
            string subject = "Ticket confirmation";
            string body = "You submited a ticket for " + classroom.name + " on ";
            body += ticket.created_at.Day + "-" + ticket.created_at.Month + "-" + ticket.created_at.Year;
            body += "\nDescription: " + ticket.description;
            
            //Send mail
            Helper.NotificationMail(user, subject, body);

            this.Context.Tickets.Add(ticket);
            this.Context.SaveChanges();

            return CreatedAtRoute("GetTicket", new { id = ticket.id }, ticket);
        }

        //Get specific ticket by ticket id
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

        //Update specific ticket
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

        //Delete specific ticket
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