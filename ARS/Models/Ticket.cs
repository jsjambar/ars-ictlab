using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Ticket
    {
        public long TicketId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int ProblemId { get; set; }
        public Problem Problem { get; set; }
        public int ClassroomId { get;set; }
        public ClassRoom Classroom { get;set; }
        public int UserId {get; set;}
        public User user { get; set; }

    }
}
