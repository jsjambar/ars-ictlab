using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Ticket
    {
        public long id { get; set; }
        public DateTime created_at { get; set; }
        public string description { get; set; }
        public string image { get; set; }
        public int problem_id { get; set; }
        public Problem problem { get; set; }
    }
}
