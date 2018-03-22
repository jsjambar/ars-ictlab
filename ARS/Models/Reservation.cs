using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Reservation
    {
        public long id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public int user_id { get; set; }
        public User user { get; set; }
        public int classroom_id { get; set; }
        public Classroom Classroom { get; set; }
    }
}
