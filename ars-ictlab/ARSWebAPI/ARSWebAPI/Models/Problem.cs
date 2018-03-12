using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARSWebAPI.Models
{
    public class Problem
    {
        public long ProblemId { get; set; }
        public string Name { get; set; }
        public int ClassRoomId { get; set; }
        public ClassRoom ClassRoom { get; set; }
    }
}
