using ARS.Controllers;
using ARS.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace UnitTests
{
    public class ClassRoomControllerTest
    {

        [Fact]
        public async Task GetAllValues()
        {
            ClassroomController classRoomController = new ClassroomController(d);
            var result = await ClassRoomController.Get();
        }
    }
}
