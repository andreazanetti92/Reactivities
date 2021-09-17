using Reactivities.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reactivities.Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Activities.Any()) return;

            var activities = new List<Activity>
            {
                new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activities 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub"
                },
                new Activity
                {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths(-3),
                    Description = "Activities 3 months ago",
                    Category = "",
                    City = "London",
                    Venue = "Somewhere on the thames"
                },
                new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activities 1 months ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre"
                },
                new Activity
                {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 1 months in future",
                    Category = "film",
                    City = "London",
                    Venue = "Cinema"
                },
            };

            await context.Activities.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}
