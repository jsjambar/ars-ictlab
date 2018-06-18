using ARS.Controllers;
using ARS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace ARSTests
{
    public class TicketControllerTests
    {
        DatabaseContext DatabaseContext;
        TicketController TicketController;

        public TicketControllerTests()
        {
            this.InitializeContext();
        }

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            this.TicketController = new TicketController(databaseContext);
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void Ticket_Create_ReturnsBadRequest_WhenModelIsNull()
        {
            this.InitializeContext();
            var result = this.TicketController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Ticket_Create_Returns201Status_WhenModelIsNotNull()
        {
            this.InitializeContext();
            var result = this.TicketController.Create(new Ticket{ id = 5, description = "Some problem" });
            Assert.IsType<CreatedAtRouteResult>(result);
        }
    }
}
