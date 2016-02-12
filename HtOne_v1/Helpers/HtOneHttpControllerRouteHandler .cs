using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;

namespace HtOne_v1.Helpers
{
    
    public class HtOneHttpControllerRouteHandler : HttpControllerRouteHandler
    {
        protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return new HtOneHttpControllerHandler(requestContext.RouteData);
        }
    }
}