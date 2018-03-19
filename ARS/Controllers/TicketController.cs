using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ARS.Models;
using ARS.Json;
using Newtonsoft.Json;

namespace ARS.Controllers
{

    [Route("api/[controller]")]
    public class TicketController : Controller
    {
        private readonly DatabaseContext context;

        public TicketController(DatabaseContext context){
            this.context = context;
        }

        [HttpGet("all")]
        public IEnumerable<Ticket> Get_tickets()
        {
            return context.Tickets; 
        }

        [HttpGet("getTicket")]
        public String GetTicket(int id){
            Ticket ticket = new Ticket();
            ticket.Date = new DateTime();
            ticket.Description = "Kan geen reservering plaatsen.";
            ticket.Image = "problem.png";
            
            return JsonConvert.SerializeObject(ticket);
        }

        [HttpGet("fill")]
        public JsonResponse Fill_ticket(){
            Ticket t1 = new Ticket();
            t1.Date = new DateTime();
            t1.Description = "Kan geen reservering plaatsen.";
            t1.Image = "problem.png";
            context.Tickets.Add(t1);
            context.SaveChanges();
            return new JsonSuccess("Successfully added Ticket.");  
        }
    }
}

