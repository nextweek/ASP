using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class AccountInfo
    {
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public string Btn { get; set; }
        public string BillingAddress { get; set; }
        public string AlternateAddress { get; set; }
        public string AccountType { get; set; }
        public string KenanStatus { get; set; } 
    }
}