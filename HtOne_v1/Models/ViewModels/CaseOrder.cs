using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HtOne_v1.Models.ViewModels
{
    public class CaseOrder
    {
        public List<Case> cases { get; set; }
        public List<Order> orders { get; set; }
        public List<AllCases> allcases { get; set; }
        public List<RegOrders> regorders { get; set; }
        public List<RegOrderTechNotes> regordernotes { get; set; }
        public List<RegOrderDueDate> regorderduedates { get; set; }
        public List<EPaperOrder> epapers { get; set; }
        public List<EPaperOrderTechNotes> epapernotes { get; set; }

        public CaseOrder()
        {
            cases = new List<Case>();
            orders = new List<Order>();
            allcases = new List<AllCases>();
            regorders = new List<RegOrders>();
            regordernotes = new List<RegOrderTechNotes>();
            regorderduedates = new List<RegOrderDueDate>();
            epapers = new List<EPaperOrder>();
            epapernotes = new List<EPaperOrderTechNotes>();
        }
    }
}