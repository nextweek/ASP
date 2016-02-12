using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class CustomerInfo
    {

        public CustomerInfo()
        {
            Sites = new List<string>();
            TeleNos = new List<string>();
            CircuitIds = new List<string>();
            ServiceTypes = new List<ServiceType>();
            CrmTns = new List<CRMTN>();
        }

        public CustomerInfoDetail CustomerInfoDetail { get; set; }
        public string AccountName { get; set; }
        public string AccountStatus { get; set; }
        public string ClassOfService { get; set; }
        public string AccountStartDate { get; set; }
        public string AccountBalance { get; set; }

        public string ChildCount { get; set; }

        public string AuthorizedParties { get; set; }
        public string Password { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Btn { get; set; }
        public string Winback { get; set; }
        public string ContactInfo { get; set; }
        public string Email { get; set; }
        public string OrderPhone { get; set; }
        public string OrderEmail { get; set; }
        public string ActiveServiceCount { get; set; }
        public string SuspendedServiceCount { get; set; }

        public string ParentAcctNo { get; set; }
        public string ParentAcctName { get; set; }
        public string ParentBTN { get; set; }
        public string ParentAccountType { get; set; }

        public List<string> Sites { get; set; }
        public List<string> TeleNos { get; set; }
        public List<string> CircuitIds { get; set; }
        public List<ServiceType> ServiceTypes { get; set; }
        public List<CRMTN> CrmTns { get; set; }
    }
}