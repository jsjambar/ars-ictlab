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
    public class LocationControllerTests
    {
        DatabaseContext DatabaseContext;
        LocationController LocationController;

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            this.LocationController = new LocationController(databaseContext);
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void Location_Create_ReturnsBadRequest_WhenModelIsNull()
        {
            this.InitializeContext();
            var result = this.LocationController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Location_Create_Returns201Status_WhenModelIsNotNull()
        {
            this.InitializeContext();
            var result = this.LocationController.Create(new Location{ id = 5, name = "Hogeschool Rotterdam Schiedam" });
            Assert.IsType<CreatedAtRouteResult>(result);
        }

        [Fact]
        public void TestClassroomGetByName()
        {
            this.InitializeContext();
            this.DatabaseContext.Add(new Location{ id = 10, name = "Hogeschool Rotterdam Purmerend" });
            this.DatabaseContext.SaveChanges();

            string expectedProblemName = "Hogeschool Rotterdam Purmerend";

            Location location = this.LocationController.GetByName(expectedProblemName);
            Assert.Equal(expectedProblemName, location.name);
        }
    }
}
