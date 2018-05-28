using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace ARS.Helpers
{
    public static class Helper
    {
        public static string HashPassword(string password)
        {
            string p = new string(password.Reverse().ToArray()); 
            string salt = ":HawaianJase";
            return p + salt;
        }

        public static string Reverse( string s )
        {
            char[] charArray = s.ToCharArray();
            Array.Reverse( charArray );
            return new string( charArray );
        }
    }
}
