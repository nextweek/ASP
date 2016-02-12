using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using System.Configuration;
using System.DirectoryServices;
using System.Collections;
using System.Web;

namespace HtOne_v1.Controllers
{
    public class LdapController : ApiController
    {
        [HttpGet, ActionName("Ldap")]
        public Boolean GetLdap(string uname, string pwd)
        {
            string adPath = String.Empty;
            string domain = String.Empty;
            string filter = String.Empty;
            string domainAndUsername = String.Empty;
            string server = String.Empty;
            const string ErrorMessage = "Log in failure: unknown username or invalid password.";
            string error = String.Empty;
            try
            {
              
                server = ConfigurationManager.AppSettings["Server"].ToString();
                adPath = ConfigurationManager.AppSettings["Path"].ToString();
                filter = "(&(objectClass=user)(SAMAccountName=" + uname + ")" + ConfigurationManager.AppSettings["Filter"].ToString() + ")";
               
                domainAndUsername = server + @"\" + uname;
                DirectoryEntry entry = new DirectoryEntry(adPath, domainAndUsername, pwd, AuthenticationTypes.Secure);

                try
                {
                    //Bind to the native AdsObject to force authentication.
                    object obj = entry.NativeObject;

                    DirectorySearcher search = new DirectorySearcher(entry);
                    search.Filter = filter;
                    SearchResultCollection results = search.FindAll();
                    SearchResult result = search.FindOne();

                    if (Convert.ToInt32(results.Count) > 0)
                    {
                        //DirectoryEntry de = result.GetDirectoryEntry();
                        //string name = de.Properties["name"][0].ToString();
                        //return name;
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    //return ex.ToString();
                    return false;
                }

                
            }
            catch (Exception ex)
            {
                //return ex.ToString();
                return false;
            }
        }



        [HttpGet, ActionName("IsAdmin")]
        public bool IsAdmin()
        {

            var session = HttpContext.Current.Session;
            if (session != null)
            {
                if (session["IsAdmin"] != null)
                {
                    // you might need to return the username here
                    return bool.Parse(session["IsAdmin"].ToString()); ;
                }
            }
            return false;
           
        }


        [HttpGet, ActionName("GetAdminUsername")]
        public String GetAdminUsername()
        {

            var session = HttpContext.Current.Session;
            if (session != null)
            {
                if (session["Username"] != null)
                {
                    // you might need to return the username here
                    return session["Username"].ToString();
                }
            }
            return "";

        }
    }
}