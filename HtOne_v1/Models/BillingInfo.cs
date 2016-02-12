using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models
{
    public class BillingInfo
    {
        public List<BillingOverview> overview { get; set;}
        public List<BillingDetails> details { get; set; }

        public BillingInfo() 
        {
            overview = new List<BillingOverview>();
            details = new List<BillingDetails>();
        }

    }
}