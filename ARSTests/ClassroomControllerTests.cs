using ARS.Controllers;
using ARS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace ARSTests
{
    public class ClassroomControllerTests
    {
        DatabaseContext DatabaseContext;
        ClassroomController ClassroomController;

        public ClassroomControllerTests()
        {
            this.InitializeContext();
        }

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            this.ClassroomController = new ClassroomController(databaseContext);
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void TestClassroomGetByName()
        {
            this.InitializeContext();
            this.DatabaseContext.Add(new Classroom { id = 10, name = "WD 1.1" });
            this.DatabaseContext.SaveChanges();

            string expectedProblemName = "WD 1.1";

            Classroom classroom = this.ClassroomController.GetByName(expectedProblemName);
            Assert.Equal(expectedProblemName, classroom.name);
        }

        [Fact]
        public void Classroom_Create_ReturnsBadRequest_WhenModelIsNull()
        {
            this.InitializeContext();
            var result = this.ClassroomController.Create(null);
            Assert.IsType<BadRequestResult>(result);
        }
    }
}
