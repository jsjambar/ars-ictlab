using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ARS.Models
{
    public class Classroom
    {
        public long id { get; set; }
        public string name { get; set; }
        public string qr_code { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public int location_id { get; set; }
        public List<Reservation> reservations { get; set; }
        public bool is_disabled { get; set; }
        public bool is_public { get; set; }
    }
}
