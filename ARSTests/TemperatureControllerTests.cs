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
    public class TemperatureControllerTests
    {
        DatabaseContext DatabaseContext;
        TemperatureController TemperatureController;

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            this.TemperatureController = new TemperatureController(databaseContext);
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void Temperature_Create_ReturnsBadRequest_WhenModelIsNull()
        {
            this.InitializeContext();
            var result = this.TemperatureController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Temperature_Create_Returns201Status_WhenModelIsNotNull()
        {
            this.InitializeContext();
            var result = this.TemperatureController.Create(new Temperature{ id = 5, classroom_id = 1, temperature = 20});
            Assert.IsType<CreatedAtRouteResult>(result);
        }
    }
}
