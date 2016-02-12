using System;
using System.Data.Entity;
using HtOne_v1.Models.ViewModels;

namespace HtOne_v1.Models
{

    // DEMONSTRATION/DEVELOPMENT ONLY
    public class AppDbInitializer :
        DropCreateDatabaseAlways<AppDbContext> // re-creates every time the server starts
    //DropCreateDatabaseIfModelChanges<TodosContext> 
    {
        protected override void Seed(AppDbContext context)
        {
            SeedDatabase(context);
        }

        public static void SeedDatabase(AppDbContext context)
        {
            foreach (var account in SampleData.HtAccounts){
                context.HtAccounts.Add(account);
            } 
        }
    }

}