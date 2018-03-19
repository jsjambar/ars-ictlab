using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Reservation
    {
        public long ReservationId { get; set; }
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int ProblemId { get; set; }
        public int ClassroomId { get; set; }
        public ClassRoom ClassRoom { get; set; }
    }
}
