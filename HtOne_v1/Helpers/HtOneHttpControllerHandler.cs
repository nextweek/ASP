using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.WebHost;
using System.Web.SessionState;
using System.Web.Routing;

namespace HtOne_v1.Helpers
{
    
    public class HtOneHttpControllerHandler : HttpControllerHandler, IRequiresSessionState
    {
        public HtOneHttpControllerHandler(RouteData routeData)
            : base(routeData)
        {
        }
    }
}