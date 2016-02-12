using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HtOne_v1.Models
{
    public class Pic
    {

        public Pic()
        {
            NBPics = new List<NBPic>();
        }

        [Key]
        public string tn { get; set; }
        public string subscr_no { get; set; }
        public string formattedTn { get; set; }
        public string mainland { get; set; }
        public string interisland { get; set; }
        public string international { get; set; }
        public int index { get; set; }

        public List<NBPic> NBPics { get; set; }

    }
}