using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using React.AspNet;
using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Jint;
using Microsoft.EntityFrameworkCore;
using ARS.Models.Contexts;

namespace ARS
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ClassRoomContext>(opt => opt.UseInMemoryDatabase("ClassRoom"));
            services.AddDbContext<LocationContext>(opt => opt.UseInMemoryDatabase("Location"));
            services.AddDbContext<NotificationContext>(opt => opt.UseInMemoryDatabase("Notification"));
            services.AddDbContext<ProblemContext>(opt => opt.UseInMemoryDatabase("Problem"));
            services.AddDbContext<ReservationContext>(opt => opt.UseInMemoryDatabase("Reservation"));
            services.AddDbContext<RoleContext>(opt => opt.UseInMemoryDatabase("Role"));
            services.AddDbContext<TemperatureContext>(opt => opt.UseInMemoryDatabase("Temperature"));
            services.AddDbContext<TicketContext>(opt => opt.UseInMemoryDatabase("Ticket"));
            services.AddDbContext<UserContext>(opt => opt.UseInMemoryDatabase("User"));
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddReact();
            services.AddMvc();

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            // Initialise ReactJS.NET. Must be before static files.
            app.UseReact(config =>
            {
                // If you want to use server-side rendering of React components,
                // add all the necessary JavaScript files here. This includes
                // your components as well as all of their dependencies.
                // See http://reactjs.net/ for more information. Example:
                //config
                //  .AddScript("~/Scripts/First.jsx")
                //  .AddScript("~/Scripts/Second.jsx");

                // If you use an external build too (for example, Babel, Webpack,
                // Browserify or Gulp), you can improve performance by disabling
                // ReactJS.NET's version of Babel and loading the pre-transpiled
                // scripts. Example:
                //config
                //  .SetLoadBabel(false)
                //  .AddScriptWithoutTransform("~/Scripts/bundle.server.js");
            });

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}