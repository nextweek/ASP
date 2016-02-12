using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HtOne_v1.Models.ViewModels
{
   
    public class HtAccount
    {
        [Key]
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public string Btn { get; set; }
        public string BillingAddress { get; set; }
        public string AlternateAddress { get; set; } 
        public string Products  { get; set; }
        public string MarketCode { get; set; }
        public string AccountType { get; set; }
        public string KenanStatus { get; set; }
        [NotMapped]
        public string Tn_List { get; set; }

    }
}