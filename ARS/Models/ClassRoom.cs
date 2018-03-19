using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ARS.Models
{
    public class ClassRoom
    {
        public long ClassRoomId { get; set; }
        public string name { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public int location_id { get; set; }
        public List<Reservation> Reservations { get; set; }
        public bool available { get; set; }
        public bool is_public { get; set; }
        public int temperature_id { get; set; }
        public Temperature Temperature { get; set; }
    }
}
