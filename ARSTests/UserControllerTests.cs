using ARS.Controllers;
using ARS.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace ARSTests
{
    public class UserControllerTest
    {
        DatabaseContext DatabaseContext;

        public UserControllerTest()
        {
            this.InitializeContext();
        }

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase();
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            var users = Enumerable.Range(1, 4).Select(i => new User { id = i, first_name = $"Piet de {i}", last_name = $"Henk de {i}", password = $"password{i}", role_id = 1, username = $"{i}@hr.nl" });
            databaseContext.Users.AddRange(users);
            int changed = databaseContext.SaveChanges();
            this.DatabaseContext = databaseContext;
        }

        private List<User> SampleUsers()
        {
            return new List<User>
            {
                new User{
                    id = 1,
                    first_name = "Jason",
                    last_name = "Lead",
                    //notifications = new List<Notification>(),
                    role_id = 1, 
                    password = "blackerthanthenight",
                    username = "1234@hr.nl"
                },
                new User{
                    id = 2,
                    first_name = "Mark",
                    last_name = "Romy",
                    //notifications = new List<Notification>(),
                    role_id = 1,
                    password = "romyweetdezeook",
                    username = "4321@hr.nl"
                },
                new User{
                    id = 3,
                    first_name = "Jacky",
                    last_name = "Fong",
                    //notifications = new List<Notification>(),
                    role_id = 1,
                    password = "jackedman",
                    username = "0000@hr.nl"
                },
                new User{
                    id = 4,
                    first_name = "Andy",
                    last_name = "Bhadai",
                    //notifications = new List<Notification>(),
                    role_id = 1,
                    password = "purmerend",
                    username = "11111@hr.nl"
                },
                new User{
                    id = 5,
                    first_name = "Jef",
                    last_name = "Constantinanozaio",
                    //notifications = new List<Notification>(),
                    role_id = 1,
                    password = "jeweettoggg",
                    username = "98765@hr.nl"
                }
            };
        }

        [Fact]
        public void TestUserGetByUsername()
        {
            string expectedUsername = "1@hr.nl";
            UserController controller = new UserController(this.DatabaseContext);

            // Controller returns a object, therefore I use dynamic to get the username property
            User user = controller.GetByUsername(expectedUsername);
            Assert.Equal(expectedUsername, user.username);
        }
    }
}
