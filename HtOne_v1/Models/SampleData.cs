using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtOne_v1.Models.ViewModels;

namespace HtOne_v1.Models
{
    public static class SampleData
    {
        static HtAccount[] sampleAccounts = new HtAccount[]
            {
                new HtAccount { AccountNo = "65", AccountName = "viena oiween ", BillingAddress = "", Btn = "123", Products = "", Tn_List = "" },
                new HtAccount { AccountNo = "46", AccountName = "w4eo 3ofpsjero", BillingAddress = "", Btn = "123", Products = "", Tn_List = "" },
                new HtAccount { AccountNo = "14", AccountName = "ei3ncp weotn", BillingAddress = "", Btn = "456", Products = "", Tn_List = "" },
                new HtAccount { AccountNo = "13", AccountName = "weofjn eoerlne", BillingAddress = "", Btn = "789", Products = "", Tn_List = "" },
                new HtAccount { AccountNo = "84", AccountName = "weo eojfwer", BillingAddress = "", Btn = "789", Products = "", Tn_List = "" },
                new HtAccount { AccountNo = "88", AccountName = "weom epopoiu", BillingAddress = "", Btn = "789", Products = "", Tn_List = "" },
                //new Contact { ContactId = 1, Name = "Glenn Block", Address = "1 Microsoft Way", City = "Redmond", State = "WA", Zip = "98052", Email = "gblock@microsoft.com", Twitter = "gblock" },
                //new Contact { ContactId = 2, Name = "Howard Dierking", Address = "1 Microsoft Way", City = "Redmond", State = "WA", Zip = "98052", Email = "howard@microsoft.com", Twitter = "howard_dierking" },
                //new Contact { ContactId = 3, Name = "Yavor Georgiev", Address = "1 Microsoft Way", City = "Redmond", State = "WA", Zip = "98052", Email = "yavorg@microsoft.com", Twitter = "digthepony" },
                //new Contact { ContactId = 4, Name = "Jeff Handley", Address = "1 Microsoft Way", City = "Redmond", State = "WA", Zip = "98052", Email = "jeff.handley@microsoft.com", Twitter = "jeffhandley" },
                //new Contact { ContactId = 5, Name = "Daniel Roth", Address = "1 Microsoft Way", City = "Redmond", State = "WA", Zip = "98052", Email = "daroth@microsoft.com", Twitter = "danroth27" },
            };

        public static HtAccount[] HtAccounts
        {
            get
            {
                return sampleAccounts;
            }
        }
    }
}