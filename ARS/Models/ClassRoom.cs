using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ARS.Models
{
    public class ClassRoom
    {
        public long ClassroomId { get; set; }
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int LocationId { get; set; }
        public List<Reservation> Reservations { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsPublic { get; set; }
    }
}
