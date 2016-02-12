using System;
using System.Globalization;
using System.Runtime.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HtOne_v1.Models.ViewModels
{
    public class ProductService
    {
        public string Address { get; set; }
        public string Service_Type { get; set; }
        public string Category { get; set; }
        public string Service_Id { get; set; }
        public string Component { get; set; }
        public string EmfConfig_Id { get; set; }
    }
}