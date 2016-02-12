using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class OrderProgress
    {
        public string Order_Num { get; set; }
        public string Order_No_Line { get; set; }
        public string Service_Type { get; set; }
        public string Service_Action { get; set; }
        public string Order_CRT_Date { get; set; }
        public string Order_Due_Date { get; set; }
        public string Job_ID { get; set; }
        public string Status { get; set; }
        public string WF_XMLDOC { get; set; }
    }
}