using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Net.Http.Formatting;
using System.Web.Routing;
using HtOne_v1.Helpers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;




namespace HtOne_v1
{
    public static class WebApiConfig
    {

        public static string UrlPrefix { get { return "api"; } }
        public static string UrlPrefixRelative { get { return "~/api"; } }

        public static void Register(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.MediaTypeMappings.Add(new UriPathExtensionMapping("json", "application/json"));
            //config.Formatters.XmlFormatter.MediaTypeMappings.Add(new UriPathExtensionMapping("xml", "application/xml"));

            //var vcard = new VCardFormatter();
            //vcard.MediaTypeMappings.Add(new UriPathExtensionMapping("vcf", "text/directory"));
            //config.Formatters.Add(vcard);

            //var png = new ContactPngFormatter();
            //png.MediaTypeMappings.Add(new UriPathExtensionMapping("png", "image/png"));
            //config.Formatters.Add(png);

            //config.DependencyResolver = new NinjectResolver(kernel);

            //config.Routes.MapHttpRoute(
            //    name: "ControllerWithExt",
            //    routeTemplate: "api/{controller}.{ext}");

            //config.Routes.MapHttpRoute(
            //    name: "IdWithExt",
            //    routeTemplate: "api/{controller}/{id}.{ext}");

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{action}",
            //    defaults: new { id = RouteParameter.Optional, action = "DefaultAction" }
            //);

            config.Routes.MapHttpRoute(
              name: "DefaultApi",
              routeTemplate: "api/{controller}/{action}",
              defaults: new { id = RouteParameter.Optional, action = "DefaultAction" }
          );

            config.Routes.MapHttpRoute(
                name: "rest",
                routeTemplate: "api/rest/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            
        
        }


        //public static void Register(HttpConfiguration config)
        //{
        //    config.Routes.MapHttpRoute(
        //        name: "DefaultApi",
        //        routeTemplate: "api/{controller}/{id}",
        //        defaults: new { id = RouteParameter.Optional }
        //    );

        //    // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
        //    // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
        //    // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
        //    //config.EnableQuerySupport();

        //    // To disable tracing in your application, please comment out or remove the following line of code
        //    // For more information, refer to: http://www.asp.net/web-api
        //    config.EnableSystemDiagnosticsTracing();
        //}
    }
}
