using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace HtOne_v1
{
    public partial class Search : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["IsAuth"] == null || !(bool)Session["IsAuth"])
            {
                Response.Redirect("Login.aspx");
            }
            else
            {
                Session["IsAuth"] = true;
            }
        }

        protected void Logoff(object sender, EventArgs e)
        {
            Session["IsAuth"] = false;
            Response.Redirect("Login.aspx");
        }
    }
}