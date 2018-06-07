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

        private void InitializeContext()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("SampleDB");
            DatabaseContext databaseContext = new DatabaseContext(builder.Options);

            // Add sample users with Range method
            var problems = Enumerable.Range(1, 4).Select(i => new Problem { id = i, name = $"Iets is kapot {i}"});

            // Add sample users to Context.InMemoryDatabase
            databaseContext.Problems.AddRange(problems);
            databaseContext.SaveChanges();
            this.DatabaseContext = databaseContext;
        }

        [Fact]
        public void TestUserGetByUsername()
        {
            this.InitializeContext();

            string expectedProblemName = "Iets is kapot 1";
            ProblemController controller = new ProblemController(this.DatabaseContext);

            // Controller returns a object, therefore I use dynamic to get the username property
            Problem problem = controller.GetByName(expectedProblemName);
            Assert.Equal(expectedProblemName, problem.name);
        }
    }
}