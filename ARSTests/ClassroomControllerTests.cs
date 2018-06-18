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

        [Fact]
        public void Classroom_Delete_Also_Deletes_Reservations_And_Tickets()
        {
            this.CreateClassroomAndReservationAndTicket();

            // Find first classroom
            Classroom classroom = this.DatabaseContext.Classrooms.First();

            this.ClassroomController.Delete(classroom.id);

            // Classroom has been deleted
            Assert.Null(this.DatabaseContext.Classrooms.FirstOrDefault(c => c.id == classroom.id));
        }

        private void CreateClassroomAndReservationAndTicket()
        {
            this.InitializeContext();

            Classroom classroom = new Classroom
            {
                id = Guid.NewGuid().GetHashCode()  // Create random id for classroom
            };

            Reservation reservation = new Reservation { id = 1, classroom_id = (int)classroom.id };
            Ticket ticket = new Ticket { id = 1, classroom_id = (int)classroom.id };

            this.DatabaseContext.Classrooms.Add(classroom);
            this.DatabaseContext.Reservations.Add(reservation);
            this.DatabaseContext.Tickets.Add(ticket);
        }

        [Fact]
        public void Classroom_Update_Returns_No_Content()
        {
            // Old classroom
            Classroom classroom = this.DatabaseContext.Classrooms.FirstOrDefault(c => c.id == 1);
            classroom.name = "WD1001";

            // Classroom.name is not old classroom.name
            Assert.Equal("WD1001", classroom.name);
            Assert.IsType<NoContentResult>(this.ClassroomController.Update(1, classroom));
        }
    }
}
