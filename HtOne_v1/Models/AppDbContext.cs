using System.Data.Entity;
using HtOne_v1.Models.ViewModels;
//using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;


namespace HtOne_v1.Models
{
    

    public class AppDbContext : DbContext
    {
        // DEVELOPMENT ONLY: initialize the database
        static AppDbContext()
        {
            Database.SetInitializer(new AppDbInitializer());
        }

        //public AppDbContext()
        //    : base("KenanDb")
        //{            
        //    //Database.SetInitializer(new MigrateDatabaseToLatestVersion<DurandalAuthDbContext, Migrations.Configuration>());
        //}

        //public DbSet<Article> Articles { get; set; }
        //public DbSet<Category> Categories { get; set; }
        //public DbSet<Tag> Tags { get; set; }

        public DbSet<HtAccount> HtAccounts { get; set; }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    Configuration.LazyLoadingEnabled = false;
        //    modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

        //    // Very bad idea not doing this :)
        //    //http://stackoverflow.com/questions/19474662/map-tables-using-fluent-api-in-asp-net-mvc5-ef6
        //    base.OnModelCreating(modelBuilder);
        //}


        
    }
}