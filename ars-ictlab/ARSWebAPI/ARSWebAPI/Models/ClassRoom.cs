using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models
{
    public class ClassRoom
    {
        public long ClassroomId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsDisabled { get; set; }
        public int LocationId { get; set; }
        public List<Reservation> Reservations { get; set; }
        public bool Available { get; set; }
        public bool Public { get; set; }
        public int TemperatureId { get; set; }
        public Temperature Temperature { get; set; }
    }
}
