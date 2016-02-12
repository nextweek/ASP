using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class RegOrders
    {
        public string Order_ID { get; set; }
        public string Added_By { get; set; }
        public string Added_On { get; set; }
        public string Updated_On { get; set; }
        public string Updated_By { get; set; }
        public string Order_Status_ID { get; set; }
        public string Order_Status_Desc { get; set; }
        public string Order_Descr { get; set; }
        public string Header_Due_Date { get; set; }
        public string Related_Orders { get; set; }

        // Used when joining the result with tech notes
        public string Tech_Assigned { get; set; }
        public string Tech_Notes { get; set; }
    }
}