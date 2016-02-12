using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class EPaperOrder
    {
        public string EPaper_ID { get; set; }
        public string EPaper_Due_Date { get; set; }
        public string EPaper_Bill_Date { get; set; }
        public string Added_On { get; set; }
        public string Added_By { get; set; }
        public string Updated_On { get; set; }
        public string Updated_By { get; set; }
        public string EPaper_Status_ID { get; set; }
        public string EPaper_Status_Desc { get; set; }
        public string EPaper_Description { get; set; }
        public string EPaper_Related_Order { get; set; }
        public string Strt_Work_Date { get; set; }

        // Used when joining the result with tech notes
        public string Tech_Assigned { get; set; }
        public string Tech_Notes { get; set; }
    }
}