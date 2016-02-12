using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace HtOne_v1.Controllers
{
    public class TickerController : ApiController
    {
        private HTONEEntities db = new HTONEEntities();


        private String AdminUsername()
        {
            var session = HttpContext.Current.Session;
            if (session != null)
            {
                if (session["Username"] != null)
                {
                    // you might need to return the username here
                    return session["Username"].ToString();
                }
            }
            return "";
        }
       


        [HttpGet, ActionName("GetAllTickers")]
        public IEnumerable<TICKER_MESSAGE_TBL> GetTICKER_MESSAGE_TBL()
        {
            return db.TICKER_MESSAGE_TBL.Where(a => a.DELETED_BY == null).AsEnumerable();
        }

        // GET api/Test/5
        public TICKER_MESSAGE_TBL GetTICKER_MESSAGE_TBL(int id)
        {
            TICKER_MESSAGE_TBL ticker_message_tbl = db.TICKER_MESSAGE_TBL.Find(id);
            if (ticker_message_tbl == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return ticker_message_tbl;
        }

        //[HttpPut, ActionName("EditTicker")]
        public HttpResponseMessage PutTICKER_MESSAGE_TBL(int id, TICKER_MESSAGE_TBL ticker_message_tbl)
        {

            ticker_message_tbl.MODIFIED_ON = DateTime.Now;
            ticker_message_tbl.MODIFIED_BY = AdminUsername();

            //if (!ModelState.IsValid)
            //{
            //return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            //}

            if (id != ticker_message_tbl.MSG_ID)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(ticker_message_tbl).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, DateTime.Now);
        }


        [HttpPost, ActionName("AddTicker")]
        public int PostTICKER_MESSAGE_TBL(TICKER_MESSAGE_TBL ticker_message_tbl)
        {


            ticker_message_tbl.ADDED_BY = AdminUsername();
            
            db.TICKER_MESSAGE_TBL.Add(ticker_message_tbl);
            db.SaveChanges();
            
            int newId = ticker_message_tbl.MSG_ID;
            return newId;
        }

        [HttpGet, ActionName("DeleteTicker")]
        public HttpResponseMessage DeleteTICKER_MESSAGE_TBL(int id)
        {
            TICKER_MESSAGE_TBL ticker_message_tbl = db.TICKER_MESSAGE_TBL.Find(id);
            if (ticker_message_tbl == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            ticker_message_tbl.MSG_STATUS = -1;
            ticker_message_tbl.DELTETED_ON = DateTime.Now;
            ticker_message_tbl.DELETED_BY = AdminUsername();
            //db.TICKER_MESSAGE_TBL.Remove(ticker_message_tbl);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, ticker_message_tbl);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }


        // Added to get config for time to restart the Ticker
        [HttpGet, ActionName("GetTickerRefreshTime")]
        public string GetTickerRefreshTime()
        {
            try
            {
                // Get appsettings in web.config
                return ConfigurationManager.AppSettings["TickerRefreshTime"];
            }
            catch (ConfigurationErrorsException)
            {
                return "";
            }
        }

    }
}
