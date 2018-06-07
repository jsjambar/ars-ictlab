using ARS.Controllers;
using ARS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ARSTests
{
    public class UserControllerTests
    {
        public List<User> Users;
        public DatabaseContext DatabaseContext;
        public UserController UserController;

        public UserControllerTests()
        {
            this.Initialize();
            this.Users = this.GetTestUsers();
        }

        private void Initialize()
        {

            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            this.DatabaseContext = new DatabaseContext(builder.Options);
            this.UserController = new UserController(this.DatabaseContext);
        }

        [Fact]
        public void Create_ReturnsBadRequest_WhenModelIsNull()
        {
            var result = this.UserController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Create_Returns201Status_WhenModelIsNotNull()
        {
            var result = this.UserController.Create(new User { id = 4, first_name = "Jan", last_name = "Jan", password = "Jantje", role_id = 1, username = "4@hr.nl"});
            Assert.IsType<CreatedAtRouteResult>(result);
        }

        [Fact]
        public void Login_ReturnsResponseFailed_WhenUserIsNotFound()
        {
            LoginObject credentialsThatFail = new LoginObject{ username = "0@hr.nl", password = "piet" };
            var response = this.UserController.Login(credentialsThatFail);

            Assert.Equal(new JsonResult(new { response = "failed" }), response);
        }

        private List<User> GetTestUsers()
        {
            return new List<User>
            {
                new User
                {
                    id = 1,
                    first_name = "Piet",
                    last_name = "Piet",
                    password = "pietje",
                    role_id = 1,
                    username = "1@hr.nl"
                },
                new User
                {
                    id = 2,
                    first_name = "Henk",
                    last_name = "Henk",
                    password = "henkje",
                    role_id = 1,
                    username = "2@hr.nl"
                },
            };
        }
    }
}
