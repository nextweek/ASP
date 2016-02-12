using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models
{
    public class BillingOverview
    {
        public string Balance_Due { get; set; }
        public string Payment_Due_Date { get; set; }
        public string Bill_Cycle { get; set; }
    }
}