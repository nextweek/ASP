using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtOne_v1.Models;
using HtOne_v1.Models.ViewModels;
using System.Data.SqlClient;
namespace HtOne_v1.Controllers
{
    public class HomeController : Controller
    {

        AppDbContext context = new AppDbContext();

        public ActionResult Index()
        {
            return View();
            
        }
    }
}
