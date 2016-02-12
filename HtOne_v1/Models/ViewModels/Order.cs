using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HtOne_v1.Models.ViewModels
{
    public class Order
    {
        public string Order_Count { get; set; }
        public string Date_Added { get; set; }
        public string Order_ID { get; set; }
        public string Description { get; set; }
        public string Due_Date { get; set; }
        public string Modified_By { get; set; }
        public string Added_By { get; set; }
        public string Date_Modified { get; set; }
    }
}