using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class TaskDetail
    {
        public string Job_ID { get; set; }
        public string Task_Name { get; set; }
        public string Acquired_By { get; set; }
        public string Due_Date { get; set; }
        public string Assigned_To { get; set; }
        public string Ready_Time { get; set; }
        public string Status { get; set; }
    }
}