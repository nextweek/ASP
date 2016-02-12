using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models
{
    public class BillingDetails
    {
        public string Service { get; set; }
        public string Contact_Desc { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Status { get; set; }
        public string Month { get; set; }
        public string ExternalID { get; set; }
    }
}