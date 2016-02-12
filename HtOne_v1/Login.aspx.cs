using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using System.Text;
using System.Collections;
using System.Configuration;
using System.DirectoryServices;

namespace HtOne_v1
{
    public partial class Login : Page
    {

      
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack)
            {
                if (Session["Username"] != null && (bool)Session["IsAuth"])
                {             
                    Response.Redirect("Search.aspx");
                }                      
            }
            if (Session["Username"] != null && (bool)Session["IsAuth"])
            {
                Response.Redirect("Search.aspx");
            }
        }

        protected void SubmitForm(object sender, EventArgs e)
        {
            string uname = username.Text;
            string pwd = passwd.Text;
            bool passed = false;
            
            string adPath = String.Empty;
            string domain = String.Empty;
            string filter = String.Empty;
            string filterAdmin = String.Empty;
            string domainAndUsername = String.Empty;
            string server = String.Empty;
            const string ErrorMessage = "Log in failure: unknown username or invalid password.";
            string error = String.Empty;
            try
            {
                server = ConfigurationManager.AppSettings["Server"].ToString();
                adPath = ConfigurationManager.AppSettings["Path"].ToString();
                filter = "(&(objectClass=user)(SAMAccountName=" + uname + ")" + ConfigurationManager.AppSettings["Filter"].ToString() + ")";
                filterAdmin = "(&(objectClass=user)(SAMAccountName=" + uname + ")" + ConfigurationManager.AppSettings["FilterAdmin"].ToString() + ")";
              
                domainAndUsername = server + @"\" + uname;
                DirectoryEntry entry = new DirectoryEntry(adPath, domainAndUsername, pwd, AuthenticationTypes.Secure);
                Session["IsAdmin"] = false;

                try{
                    //Bind to the native AdsObject to force authentication.
                    object obj = entry.NativeObject;

                    DirectorySearcher search = new DirectorySearcher(entry);
                    search.Filter = filter;
                    SearchResultCollection results = search.FindAll();
                    SearchResult result = search.FindOne();

                    if (Convert.ToInt32(results.Count) > 0)
                    {
                        Session["Username"] = uname;                        
                        Session["IsAuth"] = true;
                        passed = true;

                        DirectorySearcher search_admin = new DirectorySearcher(entry);
                        search_admin.Filter = filterAdmin;
                        SearchResultCollection resultsAdmin = search_admin.FindAll();
                        SearchResult resultAdmin = search_admin.FindOne();

                        if (Convert.ToInt32(resultsAdmin.Count) > 0)
                        {
                            bool IsAdmin = true;
                            Session["IsAdmin"] = IsAdmin.ToString();
                        }
                    }
                    else
                    {
                        Session["IsAuth"] = false;

                        if (result == null)
                        {
                            Label1.Text = "Access Denied. Please request access via ESAR.";
                        }
                    } 

                }
                catch (Exception ex)
                {
                    Label1.Text = ErrorMessage;
                    username.Text = "";
                    passwd.Text = "";

                }


                if(passed){
                    Response.Redirect("Search.aspx");
                }

            }
            catch (Exception ex)
            {

               Label1.Text = ex.Message;
               username.Text = "";
               passwd.Text = "";
            }
        }     
    }
}