using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using ARS.Models;
using System.Net;
using System.Net.Mail;

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

        public static void NotificationMail(User user, string subject, string body){
            MailMessage mail = new MailMessage();
            var from = new MailAddress("hrreservationsystem@gmail.com", "HRO Info");
            var to = new MailAddress(user.username, user.first_name); // even vervangen met huidige gebruiker
            var fromPassword = "geheim123!";
            // string subject = "Reservatie gemaakt op HRO!";
            // string body = "U heeft lokaal " + classroom.name + " gereserveerd op ";
            // body += reservation.date_of_reservation.Day + "-" + reservation.date_of_reservation.Month + "-" + reservation.date_of_reservation.Year;
            // body += "om " + reservation.start_time.Hour + " tot " + reservation.end_time.Hour;

            var smtp = new SmtpClient 
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(from.Address, fromPassword)
            };

            using (var message = new MailMessage(from.Address, to.Address)
            {
                Subject = subject,
                Body = body
            }){
                smtp.Send(message);
            }
        }
    }
}
