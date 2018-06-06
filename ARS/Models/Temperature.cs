using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Temperature
    {
        public long id { get; set; }
        public long classroom_id { get; set; }
        public int temperature { get; set; }
    }
}