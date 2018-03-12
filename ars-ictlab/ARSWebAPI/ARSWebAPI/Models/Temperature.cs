using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models
{
    public class Temperature
    {
        public long TemperatureId { get; set; }
        public float Celcius { get; set; }
        public int ClassroomId { get; set; }
        public ClassRoom ClassRoom { get; set; }
    }
}
