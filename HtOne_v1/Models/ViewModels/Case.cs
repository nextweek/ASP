using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class Case
    {
        public string Case_Count { get; set; }
        public string Case_ID { get; set; }
        public string Ticket_Summary { get; set; }
        public string Commitment_Date { get; set; }
        public string Provider_Grp_ID { get; set; }
        public string Description { get; set; }
        public string Tech_Assigned { get; set; }
        public string RC_Status { get; set; }
        public string Last_Modified { get; set; }
    }
}