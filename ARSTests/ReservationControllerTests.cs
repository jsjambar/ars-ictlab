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
    public class ReservationControllerTests
    {
        public DatabaseContext DatabaseContext;
        public ReservationController ReservationController;

        public ReservationControllerTests()
        {
            this.InitializeContext();
        }

        private void InitializeContext()
        {

            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("Resw");
            this.DatabaseContext = new DatabaseContext(builder.Options);
            this.ReservationController = new ReservationController(this.DatabaseContext);
        }

        [Fact]
        public void TestReservationGetByName()
        {
            this.InitializeContext();
            this.DatabaseContext.Add(new Reservation { id = 4, classroom_id = 1, start_time = DateTime.Now, end_time = DateTime.Now, created_at = DateTime.Today, user_id = 1 });
            this.DatabaseContext.SaveChanges();

            int expectedProblemId = 4;

            Reservation reservation = this.ReservationController.GetReservationById(expectedProblemId);
            Assert.Equal(expectedProblemId, reservation.id);
        }
    }
}
