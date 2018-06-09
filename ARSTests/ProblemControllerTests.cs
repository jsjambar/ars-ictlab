using ARS;
using ARS.Controllers;
using ARS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace ARSTests
{
    public class ProblemControllerTests
    {
        DatabaseContext DatabaseContext;
        ProblemController ProblemController;

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            this.ProblemController = new ProblemController(databaseContext);
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void Problem_Create_ReturnsBadRequest_WhenModelIsNull()
        {
            this.InitializeContext();
            var result = this.ProblemController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Problem_Create_Returns201Status_WhenModelIsNotNull()
        {
            this.InitializeContext();
            var result = this.ProblemController.Create(new Problem { id = 5, name = "Projector does not display laptop screen" });
            Assert.IsType<CreatedAtRouteResult>(result);
        }

        [Fact]
        public void TestClassroomGetByName()
        {
            this.InitializeContext();
            this.DatabaseContext.Add(new Problem{ id = 10, name = "Iets is kapot 1" });
            this.DatabaseContext.SaveChanges();

            string expectedProblemName = "Iets is kapot 1";

            Problem problem = this.ProblemController.GetByName(expectedProblemName);
            Assert.Equal(expectedProblemName, problem.name);
        }
    }
}