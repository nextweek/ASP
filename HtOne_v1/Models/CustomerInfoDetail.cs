using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtOne_v1.Models;


namespace HtOne_v1.Models
{
    public class CustomerInfoDetail
    {
        public string id { get; set; }
        public string AccountName { get; set; }
        public string Btn { get; set; }
        public string AccountType { get; set; }
        public List<CustomerInfoVMFlagType> VMFlagTypes { get; set; }
        public List<CustomerInfoNote> Notes { get; set; }
        public List<CustomerInfoCPE> CPEs { get; set; }
        public List<CustomerInfoPayment> Payments { get; set; }

        public CustomerInfoDetail()
        {
            VMFlagTypes = new List<CustomerInfoVMFlagType>();
            Notes = new List<CustomerInfoNote>();
            CPEs = new List<CustomerInfoCPE>();
            Payments = new List<CustomerInfoPayment>();
        }
    }
}