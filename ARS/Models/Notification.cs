using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS.Models
{
    public class Notification
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public User user { get; set; }
        public int role_id { get; set; }
        public Role role { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public DateTime created_at { get; set; }
        public bool read { get; set; }
    }
}
