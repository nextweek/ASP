using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HtOne_v1.Models.ViewModels;
using HtOne_v1.Models;
using System.Configuration;
using System.Data;
using System.Data.OracleClient;
//using Oracle.DataAccess.Client;
using System.Collections;
using IBM.Data.Informix;
using HtOne_v1.iPlanet;
using System.Xml.Linq;
using System.Text;

namespace HtOne_v1.Controllers.Apis
{
    public class HtAccountController : ApiController
    {

        String KENANDB = ConfigurationManager.ConnectionStrings["KENANDB"].ConnectionString;
        String CRMDB = ConfigurationManager.ConnectionStrings["CRMDB"].ConnectionString;
        String INFORMIXDB = ConfigurationManager.ConnectionStrings["AAIS_NB"].ConnectionString;
        String IPLANETURL = ConfigurationManager.AppSettings["iPlanetURL"].ToString();
        String TIBCODB_BED = ConfigurationManager.ConnectionStrings["TIBCODB_BED"].ConnectionString;
        String TIBCODB_IC = ConfigurationManager.ConnectionStrings["TIBCODB_IC"].ConnectionString;

#region OLD CODE
        ////////////////////////////////////////////////////////////
        // OLD CODE
        ////////////////////////////////////////////////////////////
        /*// GET api/htaccount/5
        [ActionName("DefaultAction")]
        public List<HtAccount> Get(string id)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.ACCOUNT_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iSearchType", OracleType.VarChar, 256).Value = "ACCOUNT_NO";
                    cmd.Parameters["iSearchType"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("iSearchValue", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters["iSearchValue"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oSearchResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/searchbytn?telnum=123
        [HttpGet, ActionName("SearchByTN")]
        public List<HtAccount> SearchByTN(string telnum)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.ACCOUNT_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("iSearchType", OracleType.VarChar, 256).Value = "TN_OR_CIRCUIT_ID";
                    cmd.Parameters["iSearchType"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("iSearchValue", OracleType.VarChar, 256).Value = telnum;
                    cmd.Parameters["iSearchValue"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oSearchResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/searchbyname?firstname=josef&lastname=josef&companyname=test
        [HttpGet, ActionName("SearchByName")]
        public List<HtAccount> SearchByName(string firstname, string lastname, string companyname)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.ACCOUNT_SEARCH_BY_NAME", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    //Check lastname and firstname value
                    if ((lastname == null || lastname == "") && (firstname == null || firstname == ""))
                    {
                        cmd.Parameters.Add("iLastName", OracleType.VarChar, 256).Value = DBNull.Value;
                        cmd.Parameters.Add("iFirstName", OracleType.VarChar, 256).Value = DBNull.Value;
                    }
                    if (!(lastname == null || lastname == "") && !(firstname == null || firstname == ""))
                    {
                        cmd.Parameters.Add("iLastName", OracleType.VarChar, 256).Value = lastname;
                        cmd.Parameters.Add("iFirstName", OracleType.VarChar, 256).Value = firstname;
                    }

                    //Check companyname value
                    if (companyname == null || companyname == "")
                    {
                        cmd.Parameters.Add("iCompanyName", OracleType.VarChar, 256).Value = DBNull.Value;
                    }
                    if (!(companyname == null || companyname == ""))
                    {
                        cmd.Parameters.Add("iCompanyName", OracleType.VarChar, 256).Value = companyname;
                    }
                    cmd.Parameters["iLastName"].Direction = ParameterDirection.Input;
                    cmd.Parameters["iFirstName"].Direction = ParameterDirection.Input;
                    cmd.Parameters["iCompanyName"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oSearchResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }*/
#endregion

        // GET api/htaccount/SearchByAcctNum?acctNum=200000000432528&active=true
        [HttpGet, ActionName("SearchByAcctNum")]
        public List<HtAccount> SearchByAcctNum(string acctNum, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.ACCOUNT_NO_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("IACCTNO", OracleType.VarChar, 256).Value = acctNum;
                    cmd.Parameters["IACCTNO"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ISACTIVE", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ISACTIVE"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("OSEARCHRESULTS", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/SearchByAcctName?firstname=bruce&lastname=wayne&companyname=wayne%20enerprises&active=true
        [HttpGet, ActionName("SearchByAcctName")]
        public List<HtAccount> SearchByAcctName(string firstname, string lastname, string companyname, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.ACCOUNT_NAME_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // SP parameters
                    if ((firstname + "") != "" && (lastname + "") != "")
                    {
                        cmd.Parameters.Add("IFIRSTNAME", OracleType.VarChar, 256).Value = firstname;
                        cmd.Parameters.Add("ILASTNAME", OracleType.VarChar, 256).Value = lastname;
                        cmd.Parameters.Add("ICOMPANYNAME", OracleType.VarChar, 256).Value = DBNull.Value;
                    }
                    else
                    {
                        cmd.Parameters.Add("IFIRSTNAME", OracleType.VarChar, 256).Value = DBNull.Value;
                        cmd.Parameters.Add("ILASTNAME", OracleType.VarChar, 256).Value = DBNull.Value;
                        cmd.Parameters.Add("ICOMPANYNAME", OracleType.VarChar, 256).Value = companyname;
                    }

                    cmd.Parameters["ILASTNAME"].Direction = ParameterDirection.Input;
                    cmd.Parameters["IFIRSTNAME"].Direction = ParameterDirection.Input;
                    cmd.Parameters["ICOMPANYNAME"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ISACTIVE", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ISACTIVE"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("OSEARCHRESULTS", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/SearchByTN?tn=8088795860&active=true
        [HttpGet, ActionName("SearchByTN")]
        public List<HtAccount> SearchByTN(string tn, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.TN_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("ITELNO", OracleType.VarChar, 256).Value = tn;
                    cmd.Parameters["ITELNO"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ISACTIVE", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ISACTIVE"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("OSEARCHRESULTS", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/SearchByCKT?cktid=97.SWXX.005528..HTNG&active=true
        [HttpGet, ActionName("SearchByCKT")]
        public List<HtAccount> SearchByCKT(string cktid, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.CKT_SEARCH", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("ICIRCUITID", OracleType.VarChar, 256).Value = cktid;
                    cmd.Parameters["ICIRCUITID"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ISACTIVE", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ISACTIVE"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("OSEARCHRESULTS", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRESS"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["KENAN_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/SearchByCaseID?caseid=1311485&active=true
        [HttpGet, ActionName("SearchByCaseID")]
        public List<HtAccount> SearchByCaseID(string caseid, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(CRMDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.SEARCH_BY_CASE_ID", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("CaseIdIn", OracleType.VarChar, 256).Value = caseid;
                    cmd.Parameters["CaseIdIn"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ActiveOrNotIn", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ActiveOrNotIn"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRES"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["ACCOUNT_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/SearchByOrderID?orderid=CR25728&active=true
        [HttpGet, ActionName("SearchByOrderID")]
        public List<HtAccount> SearchByOrderID(string orderid, bool active)
        {
            try
            {
                List<HtAccount> accounts = new List<HtAccount>();

                using (OracleConnection con = new OracleConnection(CRMDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.SEARCH_BY_ORDER_ID", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    //Code to call Stored Proc
                    cmd.Parameters.Add("OrderIdIn", OracleType.VarChar, 256).Value = orderid;
                    cmd.Parameters["OrderIdIn"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("ActiveOrNotIn", OracleType.VarChar, 256).Value = (active ? '1' : '0');
                    cmd.Parameters["ActiveOrNotIn"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        HtAccount account = new HtAccount();
                        account.AccountName = row["ACCOUNT_NAME"].ToString();
                        account.AccountNo = row["ACCOUNT_NO"].ToString();
                        account.Btn = row["BTN"].ToString();
                        account.BillingAddress = row["BILLING_ADDRES"].ToString();
                        account.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                        account.Products = row["PRODUCTS"].ToString();
                        account.MarketCode = row["MARKET_CODE"].ToString();
                        account.AccountType = row["ACCOUNT_TYPE"].ToString();
                        account.KenanStatus = row["ACCOUNT_STATUS"].ToString();
                        accounts.Add(account);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return accounts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/CustomerInfo?id=200000000349389&accountName=hello&btn=1234567890&accountType=Parent
        [HttpGet, ActionName("CustomerInfo")]
        public List<CustomerInfo> GET_CUSTOMER_INFO(string id, string accountName, string btn, string accountType)
        { 
            try
            {
                List<CustomerInfo> accounts = new List<CustomerInfo>();
                CustomerInfo account = new CustomerInfo();

                #region Get information from Kenan DB
                // Connect to Kenan database
                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_CUSTOMER_INFO", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 20).Value = id;
                    cmd.Parameters.Add("oCustomerInfo", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oTNList", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oCktList", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oSiteList", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oServiceInventory", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oServiceStatusInventory", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oParentAccountInfo", OracleType.Cursor).Direction = ParameterDirection.Output;

                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        var accountRow = ds.Tables[0].Rows[0];

                        account.AccountName = accountName;
                        account.ClassOfService = accountRow["CLASS_OF_SERVICE"].ToString();
                        account.AccountBalance = accountRow["ACCOUNT_BALANCE"].ToString();
                        account.AccountStartDate = accountRow["ACCOUNT_START_DATE"].ToString();

                        account.ChildCount = accountRow["CHILD_COUNT"].ToString();

                        foreach (DataRow tnRow in ds.Tables[1].Rows)
                        {
                            account.TeleNos.Add(tnRow["TN"].ToString());
                        }

                        foreach (DataRow tnRow in ds.Tables[2].Rows)
                        {
                            account.CircuitIds.Add(tnRow["CIRCUIT_ID"].ToString());
                        }

                        List<string> addresses = new List<string>();
                        foreach (DataRow tnRow in ds.Tables[3].Rows)
                        {
                            string value = tnRow["SITE"].ToString().ToUpper();
                            if (addresses.Contains(value) == false)
                            {
                                addresses.Add(value);
                                account.Sites.Add(value + " " + tnRow["SERVICE_ZIP"].ToString());
                            }
                        }

                        foreach (DataRow tnRow in ds.Tables[4].Rows)
                        {
                            ServiceType serviceType = new ServiceType();
                            serviceType.Name = tnRow["SERVICE_TYPE"].ToString();
                            serviceType.Count = tnRow["COUNTS"].ToString();
                            account.ServiceTypes.Add(serviceType);
                        }
                        foreach (DataRow tnRow in ds.Tables[5].Rows)
                        {
                            account.ActiveServiceCount = tnRow["ACTIVE_SERVICE_COUNT"].ToString();
                            account.SuspendedServiceCount = tnRow["SUSPENDED_SERVICE_COUNT"].ToString();
                        }

                        foreach (DataRow tnRow in ds.Tables[6].Rows)
                        {
                            account.ParentAcctNo = tnRow["PARENT_ACCT_NO"].ToString();
                            account.ParentAcctName = tnRow["PARENT_ACCT_NAME"].ToString();
                            account.ParentBTN = tnRow["PARENT_BTN"].ToString();
                            account.ParentAccountType = tnRow["PARENT_ACCT_TYPE"].ToString();
                        }                        
                    }

                    con.Close();
                }
                #endregion

                #region Get information from CRM DB
                // Connect to CRM database
                using (OracleConnection con = new OracleConnection(CRMDB))
                {

                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.Get_360_Cust_Info_DashBoard", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("Acct_No", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;                    

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {

                        var accountRow = ds.Tables[0].Rows[0];

                        account.AuthorizedParties = accountRow["AUTHORIZED_PARTIES"].ToString();
                        account.Password = accountRow["PASSWORD"].ToString();
                        account.Question = accountRow["QUESTION"].ToString();
                        account.Answer = accountRow["ANSWER"].ToString();
                        account.Btn = btn;
                        account.AccountStatus = accountRow["ACCOUNT_STATUS"].ToString();
                        account.Winback = accountRow["WINBACK"].ToString();
                        account.ContactInfo = accountRow["CUST_CNTCT_INFO"].ToString();
                        account.Email = accountRow["EMAIL"].ToString();
                        account.OrderEmail = accountRow["ORDER_EMAIL"].ToString();
                        account.OrderPhone = accountRow["ORDER_PHONE"].ToString(); 
                    }


                    ds = new DataSet();

                    //call stored procedure.
                    cmd = new OracleCommand("SYSADM.Get_CRM_TNS", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("Acct_No", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CRMTN crmTn = new CRMTN();
                        crmTn.FacilityType = row["FACILITY_TYPE"].ToString();
                        crmTn.Tn = row["TN"].ToString();
                        crmTn.Voice = row["VOICE"].ToString();
                        account.CrmTns.Add(crmTn);
                    }

                    con.Close();
                }
                #endregion

                account.CustomerInfoDetail = CustomerInfoDetail(id, accountName, btn, accountType);

                accounts.Add(account);
               
                return accounts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET api/htaccount/GetCaseOrder?id=123
        [HttpGet, ActionName("GetCaseOrder")]
        public CaseOrder GetCaseOrder(string id)
        {
            try
            {
                CaseOrder cases_orders = new CaseOrder();
                using (OracleConnection con = new OracleConnection(CRMDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.GET_CASE_ORDER", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("Acct_No", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters.Add("OrderoResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("CaseoResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("AllCasesoResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("RegOrdersResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("RegOrdTechNotesResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("RegOrdDueDatesResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("ePaperOrderResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("ePaperOrdTechNotesResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);
                    // Order Results
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        Order o = new Order();
                        o.Order_Count = row["ORDER_COUNT"].ToString();
                        o.Date_Added = row["DATE_ADDED"].ToString();
                        o.Order_ID = row["ORDER_ID"].ToString();
                        o.Description = row["DESCRIPTION"].ToString();
                        o.Due_Date = row["DUE_DATE"].ToString();
                        o.Modified_By = row["MODIFIED_BY"].ToString();
                        o.Added_By = row["ADDED_BY"].ToString();
                        o.Date_Modified = row["DATE_MODIFIED"].ToString();
                        cases_orders.orders.Add(o);
                    }
                    // Case Results
                    foreach (DataRow row in ds.Tables[1].Rows)
                    {
                        Case c = new Case();
                        c.Case_Count = row["CASE_COUNT"].ToString();
                        c.Case_ID = row["CASE_ID"].ToString();
                        c.Ticket_Summary = row["TICKET_SUMMARY"].ToString();
                        c.Commitment_Date = row["COMMITMENT_DATE"].ToString();
                        c.Provider_Grp_ID = row["PROVIDER_GRP_ID"].ToString();
                        c.Description = row["DESCRIPTION"].ToString();
                        c.Tech_Assigned = row["TECH_ASSIGNED"].ToString();
                        c.RC_Status = row["RC_STATUS"].ToString();
                        c.Last_Modified = row["USER_LAST_MODIFIED"].ToString();
                        cases_orders.cases.Add(c);
                    }
                    // All Cases Results
                    foreach (DataRow row in ds.Tables[2].Rows)
                    {
                        AllCases ac = new AllCases();
                        ac.Case_ID = row["CASE_ID"].ToString();
                        ac.Case_Type = row["CASE_TYPE"].ToString();
                        ac.Case_Summary = row["CASE_SUMMARY"].ToString();
                        ac.Commit_Date = row["COMMIT_DATE"].ToString();
                        ac.Commit_Time = row["COMMIT_TIME"].ToString();
                        ac.Commit_Date_Time = row["COMMIT_DATE_TIME"].ToString();
                        ac.Rev_Commit_Date = row["REV_COMMIT_DATE"].ToString();
                        ac.Rev_Commit_Time = row["REV_COMMIT_TIME"].ToString();
                        ac.Rev_Commit_Date_Time = row["REV_COMMIT_DATE_TIME"].ToString();
                        ac.Provider_Grp_ID = row["PROVIDER_GRP_ID"].ToString();
                        ac.Provider_Grp_Name = row["PROVIDER_GRP_NAME"].ToString();
                        ac.Case_OOS = row["CASE_OOS"].ToString();
                        ac.Updated_By = row["UPDATED_BY"].ToString();
                        ac.Updated_On = row["UPDATED_ON"].ToString();
                        ac.Added_By = row["ADDED_BY"].ToString();
                        ac.Added_On = row["ADDED_ON"].ToString();
                        ac.Case_Category_ID = row["CASE_CATEGORY_ID"].ToString();
                        ac.Case_Category_Desc = row["CASE_CATEGORY_DESC"].ToString();
                        ac.Case_Status_ID = row["CASE_STATUS_ID"].ToString();
                        ac.Case_Status_Desc = row["CASE_SATTUS_DEC"].ToString();
                        ac.Related_Order_Case = row["RELATED_ORDER_CASE"].ToString();
                        ac.CCT_Commit_Date = row["CCT_COMMIT_DATE"].ToString();
                        ac.Case_Contact_Info = row["CASE_CONTACT_INFO"].ToString();
                        ac.Case_Creation_Date = row["CASE_CREATION_DATE"].ToString();
                        ac.Case_Description = row["CASE_DESCRIPTION"].ToString();
                        ac.RBT_Acct_ID = row["RBTACCTID"].ToString();
                        ac.Case_Close_Date = row["CASE_CLOSE_DATE"].ToString();
                        ac.Case_Close_Time = row["CASE_CLOSE_TIME"].ToString();
                        ac.Closed_Date_Time = row["CLOSED_DATE_TIME"].ToString();
                        ac.Case_Closed_By = row["CASE_CLOSED_BY"].ToString();
                        ac.Case_TN_CKT_ID = row["CASE_TN_CKT_ID"].ToString();
                        ac.Case_DAC = row["CASE_DAC"].ToString();
                        ac.Case_CO = row["CASE_CO"].ToString();
                        ac.Case_COS = row["CASE_COS"].ToString();
                        ac.Case_Contact_Name = row["CASE_CNTCT_NAME"].ToString();
                        ac.Case_Cntct_Info = row["CASE_CNTCT_INFO"].ToString();
                        ac.Case_All_Calls = row["CASE_ALL_CALLS"].ToString();
                        ac.Case_All_Phones = row["CASE_ALL_PHONES"].ToString();
                        ac.Case_Checked_CPE = row["CASE_CHECKED_CPE"].ToString();
                        ac.Case_Job_ID = row["CASE_JOB_ID"].ToString();
                        ac.HTRC_Dispatch_Date = row["HTRC_DISPATCH_DATE"].ToString();
                        ac.HTRC_Dispatch_Time = row["HTRC_DISPATCH_TIME"].ToString();
                        ac.Dispatch_Date_Time = row["DISPATCH_DATE_TIME"].ToString();
                        ac.HTRC_Dispatch_Stat = row["HTRC_DISPATCH_STAT"].ToString();
                        ac.Dispatch_Status = row["DISPATCH_STATUS"].ToString();
                        ac.HTRC_Dispatch_Asgn = row["HTRC_DISPATCH_ASGN"].ToString();
                        cases_orders.allcases.Add(ac);
                    }
                    // Reg Order Results
                    foreach (DataRow row in ds.Tables[3].Rows)
                    {
                        RegOrders ro = new RegOrders();
                        ro.Order_ID = row["ORDER_ID"].ToString();
                        ro.Added_By = row["ADDED_BY"].ToString();
                        ro.Added_On = row["ADDED_ON"].ToString();
                        ro.Updated_On = row["UPDATED_ON"].ToString();
                        ro.Updated_By = row["UPDATED_BY"].ToString();
                        ro.Order_Status_ID = row["ORDER_STATUS_ID"].ToString();
                        ro.Order_Status_Desc = row["ORDER_STATUS_DESC"].ToString();
                        ro.Order_Descr = row["ORDER_DESCR"].ToString();
                        ro.Header_Due_Date = row["HEADER_DUE_DATE"].ToString();
                        ro.Related_Orders = row["RELATED_ORDERS"].ToString();
                        ro.Tech_Assigned = "";
                        ro.Tech_Notes = "";
                        cases_orders.regorders.Add(ro);
                    }
                    // Reg Order Tech Notes Results
                    foreach (DataRow row in ds.Tables[4].Rows)
                    {
                        RegOrderTechNotes rt = new RegOrderTechNotes();
                        rt.Capture_ID = row["CAPTURE_ID"].ToString();
                        rt.Tech_Assigned = row["TECH_ASSIGNED"].ToString();
                        rt.Tech_Notes = row["TECH_NOTES"].ToString();
                        cases_orders.regordernotes.Add(rt);
                    }
                    // Reg Order Due Date Results
                    foreach (DataRow row in ds.Tables[5].Rows)
                    {
                        RegOrderDueDate rd = new RegOrderDueDate();
                        rd.Capture_ID = row["CAPTURE_ID"].ToString();
                        rd.Due_Date = row["DUE_DATE"].ToString();
                        rd.Start_Work_By_Date = row["START_WRK_BY_DATE"].ToString();
                        rd.Create_Date = row["CREATE_DATE"].ToString();
                        rd.Is_Hot_Cut = row["IS_HOT_CUT"].ToString();
                        cases_orders.regorderduedates.Add(rd);
                    }
                    // ePaper Order Results
                    foreach (DataRow row in ds.Tables[6].Rows)
                    {
                        EPaperOrder eo = new EPaperOrder();
                        eo.EPaper_ID = row["EPAPER_ID"].ToString();
                        eo.EPaper_Due_Date = row["EPAPER_DUE_DATE"].ToString();
                        eo.EPaper_Bill_Date = row["EPAPER_BILL_DATE"].ToString();
                        eo.Added_On = row["ADDED_ON"].ToString();
                        eo.Added_By = row["ADDED_BY"].ToString();
                        eo.Updated_On = row["UPDATED_ON"].ToString();
                        eo.Updated_By = row["UPDATED_BY"].ToString();
                        eo.EPaper_Status_ID = row["EPAPER_STATUS_ID"].ToString();
                        eo.EPaper_Status_Desc = row["EPAPER_STATUS_DESC"].ToString();
                        eo.EPaper_Description = row["EPAPER_DESCR"].ToString();
                        eo.EPaper_Related_Order = row["EPAPER_RELATED_ORDER"].ToString();
                        eo.Strt_Work_Date = row["STRT_WRK_DATE"].ToString();
                        eo.Tech_Assigned = "";
                        eo.Tech_Notes = "";
                        cases_orders.epapers.Add(eo);
                    }
                    // ePaper Order Tech Notes Results
                    foreach (DataRow row in ds.Tables[7].Rows)
                    {
                        EPaperOrderTechNotes eot = new EPaperOrderTechNotes();
                        eot.Capture_ID = row["CAPTURE_ID"].ToString();
                        eot.Tech_Assigned = row["TECH_ASSIGNED"].ToString();
                        eot.Tech_Notes = row["TECH_NOTES"].ToString();
                        cases_orders.epapernotes.Add(eot);
                    }

                    

                    // Join Reg Order and Tech Notes tables (Left Outer Join)
                    cases_orders.regorders =
                        (from order in cases_orders.regorders
                         join note in cases_orders.regordernotes
                         on order.Order_ID equals note.Capture_ID into orders_notes
                         from item in orders_notes.DefaultIfEmpty()
                         select new RegOrders()
                         {
                            Order_ID = order.Order_ID,
                            Added_By = order.Added_By,
                            Added_On = order.Added_On,
                            Updated_On = order.Updated_On,
                            Updated_By = order.Updated_By,
                            Order_Status_ID = order.Order_Status_ID,
                            Order_Status_Desc = order.Order_Status_Desc,
                            Order_Descr = order.Order_Descr,
                            Header_Due_Date = order.Header_Due_Date,
                            Related_Orders = order.Related_Orders,
                            Tech_Assigned = item == null ? "" : item.Tech_Assigned,
                            Tech_Notes = item == null ? "" : item.Tech_Notes
                         }).ToList<RegOrders>();

                    // Join ePaper and Tech Notes tables (Left Outer Join)
                    cases_orders.epapers =
                        (from epaper in cases_orders.epapers
                         join note in cases_orders.epapernotes
                         on epaper.EPaper_ID equals note.Capture_ID into epapers_notes
                         from item in epapers_notes.DefaultIfEmpty()
                         select new EPaperOrder()
                         {
                            EPaper_ID = epaper.EPaper_ID,
                            EPaper_Due_Date = epaper.EPaper_Due_Date,
                            EPaper_Bill_Date = epaper.EPaper_Bill_Date,
                            Added_On = epaper.Added_On,
                            Added_By = epaper.Added_By,
                            Updated_On = epaper.Updated_On,
                            Updated_By = epaper.Updated_By,
                            EPaper_Status_ID = epaper.EPaper_Status_ID,
                            EPaper_Status_Desc = epaper.EPaper_Status_Desc,
                            EPaper_Description = epaper.EPaper_Description,
                            EPaper_Related_Order = epaper.EPaper_Related_Order,
                            Strt_Work_Date = epaper.Strt_Work_Date,
                            Tech_Assigned = item == null ? "" : item.Tech_Assigned,
                            Tech_Notes = item == null ? "" : item.Tech_Notes
                         }).ToList<EPaperOrder>();

                    // Explicitly close connection
                    con.Close();
                }
                return cases_orders;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetProductsAndServices?id=123
        [HttpGet, ActionName("GetProductsAndServices")]
        public List<ProductService> ProductsAndServices(string id)
        {
            try
            {
                List<ProductService> productsAndServices = new List<ProductService>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_PRODUCTS_AND_SERVICES", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters.Add("oProductsAndServices", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    List<string> addresses = new List<string>();
                    List<string> zipCodes = new List<string>();
                    string completeAddress = string.Empty;
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        ProductService ps = new ProductService();
                        string value = row["ADDRESS"].ToString().ToUpper();
                        if (addresses.Contains(value) == false)
                        {
                            addresses.Add(value);
                            zipCodes.Add(row["SERVICE_ZIP"].ToString());
                            completeAddress = value + " " + row["SERVICE_ZIP"].ToString();
                        }
                        else
                        {
                            int index = addresses.IndexOf(value);
                            completeAddress = value + " " + zipCodes[index];
                        }
                        ps.Address = completeAddress;
                        ps.EmfConfig_Id = row["EMF_CONFIG_ID"].ToString();
                        ps.Service_Type = row["SERVICE_TYPE"].ToString();
                        ps.Category = Category(ps.EmfConfig_Id);
                        ps.Service_Id = row["SERVICE_ID"].ToString();
                        ps.Component = row["COMPONENT"].ToString();
                        productsAndServices.Add(ps);
                    }

                    con.Close();
                }
                return productsAndServices;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetChildrenInfo?id=123
        [HttpGet, ActionName("GetChildAccountInfo")]
        public List<AccountInfo> ChildAccountInfo(string id)
        {
            try
            {
                List<AccountInfo> childAccountInfo = new List<AccountInfo>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_CHILD_ACCOUNT2", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 20).Value = id;
                    cmd.Parameters["iAccountNo"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oChildAccount2", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {   
                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            AccountInfo accountInfo = new AccountInfo();
                            accountInfo.AccountNo = row["ACCOUNT_NO"].ToString();
                            accountInfo.AccountName = row["ACCOUNT_NAME"].ToString();
                            accountInfo.AccountType = row["ACCOUNT_TYPE"].ToString();
                            accountInfo.AlternateAddress = row["ALTERNATE_ADDRESS"].ToString();
                            accountInfo.BillingAddress = row["BILL_ADDRESS"].ToString();
                            accountInfo.Btn = row["BTN"].ToString();
                            accountInfo.KenanStatus = row["KENAN_STATUS"].ToString();
                            childAccountInfo.Add(accountInfo);
                        }
                    }
                    con.Close();
                }
                
                return childAccountInfo;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetChildrenInfo?id=123
        [HttpGet, ActionName("GetAccountLevelComponents")]
        public List<string> LevelComponents(string id)
        {
            try
            {
                List<string> levelComponents = new List<string>();

                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_ACCOUNT_LEVEL_COMPONENTS", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 20).Value = id;
                    cmd.Parameters["iAccountNo"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oAccountLevelComponents", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            levelComponents.Add(row["COMPONENT_DESCRIPTION"].ToString());
                        }
                    }
                    con.Close();
                }

                return levelComponents;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetServices?id=200000000349389
        [HttpGet, ActionName("GetServices")]
        public List<CrmServices> CrmServices(string id)
        {
            try
            {
                List<CrmServices> Services = new List<CrmServices>();
                using (OracleConnection con = new OracleConnection(CRMDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.GET_CRM_SERVICES", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("Acct_No", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters["Acct_No"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;
                    
                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CrmServices service = new CrmServices();
                        service.Tn = row["TN"].ToString();
                        service.ServiceType = row["SERVICE_TYPE"].ToString(); //ServType(id);
                        service.ServiceId = row["SERVICE_ID"].ToString();
                        service.Voice = row["VOICE"].ToString();
                        service.FacilityType = row["FACILITY_TYPE"].ToString();
                        Services.Add(service);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                
                return Services;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetInteractions?id=200000000349389
        [HttpGet, ActionName("GetInteractions")]
        public List<Interaction> GetInteractions(string id)
        {
            try
            {
                List<Interaction> Interaction = new List<Interaction>();
                using (OracleConnection con = new OracleConnection(CRMDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.GET_CRM_INTERACTIONS", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iRbtAcctId", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters["iRbtAcctId"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oResults", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        Interaction ia = new Interaction();
                        ia.Added_By = row["ADDED_BY"].ToString();
                        ia.Date_Time_Added = row["DATE_TIME_ADDED"].ToString();
                        ia.Notes = row["NOTES"].ToString();
                        Interaction.Add(ia);
                    }

                    // Explicitly close connection
                    con.Close();
                }

                return Interaction;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetPic?id=200000000525096&tn=8088794561&index=0
        [HttpGet, ActionName("GetPic")]
        public Pic GetPic(string id, string tn, int index)
        {
            Pic selectedPic = new Pic();

            try
            {
                List<Pic> pics = new List<Pic>();
                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_PIC", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 20).Value = id;
                    cmd.Parameters["iAccountNo"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oPicInfo", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        Pic pic = new Pic();
                        pic.subscr_no = dr[0].ToString().Trim();
                        pic.tn = dr[1].ToString().Trim();
                        pic.formattedTn = dr[2].ToString().Trim();
                        pic.mainland = dr[3].ToString().Trim();
                        pic.interisland = dr[4].ToString().Trim();
                        pic.international = dr[5].ToString().Trim();
                        pics.Add(pic);
                    }

                    selectedPic = pics.Where(a => a.tn == tn).Single<Pic>();
                    selectedPic.index = index;

                    con.Close();
                }


            }
            catch (Exception)
            {
                throw;
            }

            try
            {
                List<NBPic> facDetails = new List<NBPic>();

                using (IfxConnection ifxcon = new IfxConnection(INFORMIXDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter
                    IfxCommand cmd;
                    IfxDataAdapter da;

                    // Open Connection and call stored procedure.
                    ifxcon.Open();
                    cmd = new IfxCommand("ht_one_facs", ifxcon);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("p_tel_no ", IfxType.VarChar, 256).Value = tn;

                    // Fill Dataset using DataAdapter
                    da = new IfxDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        NBPic facD = new NBPic();
                        facD.InterIsland_PIC = dr[11].ToString().Trim();
                        facD.InterNational_PIC = dr[10].ToString().Trim();
                        facDetails.Add(facD);
                    }
                    ifxcon.Close();
                }
                selectedPic.NBPics = facDetails;
            }
            catch (Exception)
            {
                throw;
            }

            return selectedPic;
        }

        // GET api/htaccount/GetOrderProgress?orderid=CD88214, CD88213, CE90827
        [HttpGet, ActionName("GetOrderProgress")]
        public List<OrderProgress> GetOrderProgress(string orderid)
        {
            try
            {
                List<OrderProgress> ord_progress = new List<OrderProgress>();
                using (OracleConnection con = new OracleConnection(TIBCODB_BED))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("PC.GET_ORDER_PROGRESS_MAIN", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("ORDERIDIN", OracleType.VarChar, 256).Value = orderid;
                    cmd.Parameters["ORDERIDIN"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("TIBCOORDERINFOOUT", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        OrderProgress prog = new OrderProgress();
                        prog.Order_Num = row["ORD_NO"].ToString();
                        prog.Order_No_Line = row["ORD_NO_LINE"].ToString();
                        prog.Service_Type = row["SERVICE_TYPE"].ToString();
                        prog.Service_Action = row["SERVICE_ACTION"].ToString();
                        prog.Order_CRT_Date = row["ORD_CRT_DATE"].ToString();
                        prog.Order_Due_Date = row["ORD_DUEDATE"].ToString();
                        prog.Job_ID = row["JOB_ID"].ToString();
                        prog.Status = row["STATUS"].ToString();
                        prog.WF_XMLDOC = row["WF_XMLDOC"].ToString();
                        ord_progress.Add(prog);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return ord_progress;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetServiceTaskDetails?jobid=CD88214&duedate=2009-10-07
        [HttpGet, ActionName("GetServiceTaskDetails")]
        public List<TaskDetail> GetServiceTaskDetails(string jobid, string duedate)
        {
            try
            {
                List<TaskDetail> taskdetail = new List<TaskDetail>();
                using (OracleConnection con = new OracleConnection(TIBCODB_IC))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("IC.GET_SRVC_TASKS_DTLS", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("SRVCJOBIDIN", OracleType.VarChar, 256).Value = jobid;
                    cmd.Parameters["SRVCJOBIDIN"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("SRVCDUEDATE", OracleType.VarChar, 256).Value = duedate;
                    cmd.Parameters["SRVCDUEDATE"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("TIBCOTASKINFOOUT", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        TaskDetail task = new TaskDetail();
                        task.Job_ID = row["JOB_ID"].ToString();
                        task.Task_Name = row["TASK_NAME"].ToString();
                        task.Acquired_By = row["ACQUIRED_BY"].ToString();
                        task.Due_Date = row["DUE_DATE"].ToString();
                        task.Assigned_To = row["ASSIGNED_TO"].ToString();
                        task.Ready_Time= row["READY_TIME"].ToString();
                        task.Status = row["STATUS"].ToString();
                        taskdetail.Add(task);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return taskdetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // GET api/htaccount/GetBillingInfo?id=200000000349389
        [HttpGet, ActionName("GetBillingInfo")]
        public BillingInfo GetBillingInfo(string id)
        {
            try
            {
                BillingInfo billinfo = new BillingInfo();
                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_BILLING_INFO", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters["iAccountNo"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oBillingOverview", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oBillingDetails", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    // Fill the overview list from first resultset
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        BillingOverview overview = new BillingOverview();
                        overview.Balance_Due = row["BALANCE_DUE"].ToString();
                        overview.Payment_Due_Date = (row["PAYMENT_DUE_DATE"].ToString() != "") ? Convert.ToDateTime(row["PAYMENT_DUE_DATE"].ToString()).ToString("d") : "";
                        overview.Bill_Cycle = row["BILL_CYCLE"].ToString();
                        billinfo.overview.Add(overview);
                    }

                    // Fill the details list from second resultset
                    foreach (DataRow row in ds.Tables[1].Rows)
                    {
                        BillingDetails details = new BillingDetails();
                        details.Service = row["SERVICE"].ToString();
                        details.Contact_Desc = row["CONTRACT_DESCR"].ToString();
                        details.Start_Date = (row["START_DT"].ToString() != "") ? Convert.ToDateTime(row["START_DT"].ToString()).ToString("d") : "";
                        details.End_Date = (row["END_DT"].ToString() != "") ? Convert.ToDateTime(row["END_DT"].ToString()).ToString("d") : "";
                        details.Status = row["STATUS"].ToString();
                        details.Month = row["MONTHS"].ToString();
                         details.ExternalID = row["EXTERNAL_ID"].ToString();
                        billinfo.details.Add(details);
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return billinfo;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /* API to Call INFORMIX Stored Procedure
        * GET api/htaccount/GetFacility?tel_num=8086259905
        */
        [HttpGet, ActionName("GetFacility")]
        public List<FACSHeader> GetFacility(string tel_num)
        {
            try
            {
                List<FACSHeader> facilities = new List<FACSHeader>();

                using (IfxConnection ifxcon = new IfxConnection(INFORMIXDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter
                    IfxCommand cmd;
                    IfxDataAdapter da;

                    // Open Connection and call stored procedure.
                    ifxcon.Open();
                    cmd = new IfxCommand("ht_one_facs_dash", ifxcon);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("p_tel_no ", IfxType.VarChar, 256).Value = tel_num;

                    // Fill Dataset using DataAdapter
                    da = new IfxDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        FACSHeader fac = new FACSHeader();
                        fac.Tel_Num = dr[0].ToString().Trim();
                        fac.Status = dr[1].ToString().Trim();
                        fac.Remarks = dr[2].ToString().Trim();
                        fac.Cable_Pair = dr[3].ToString().Trim();
                        fac.Port = dr[4].ToString().Trim();
                        facilities.Add(fac);
                    }
                    ifxcon.Close();
                }

                return facilities;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /* API to Call INFORMIX Stored Procedure
        * GET api/htaccount/GetFacilityDetail?tel_num=8086259905
        */
        [HttpGet, ActionName("GetFacilityDetail")]
        public List<FACSDetail> GetFacilityDetail(string tel_num)
        {
            try
            {
                List<FACSDetail> facDetails = new List<FACSDetail>();

                using (IfxConnection ifxcon = new IfxConnection(INFORMIXDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter
                    IfxCommand cmd;
                    IfxDataAdapter da;

                    // Open Connection and call stored procedure.
                    ifxcon.Open();
                    cmd = new IfxCommand("ht_one_facs", ifxcon);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("p_tel_no ", IfxType.VarChar, 256).Value = tel_num;

                    // Fill Dataset using DataAdapter
                    da = new IfxDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        FACSDetail facD = new FACSDetail();
                        facD.Tel_Num = dr[0].ToString().Trim();
                        facD.Status = dr[1].ToString().Trim();
                        facD.Native_ACO = dr[2].ToString().Trim();
                        facD.Current_ACO = dr[3].ToString().Trim();
                        facD.Switch_Type = dr[4].ToString().Trim();
                        facD.CLLI = dr[5].ToString().Trim();
                        facD.Terminal = dr[6].ToString().Trim();
                        facD.Port = dr[7].ToString().Trim();
                        facD.Facilities = dr[8].ToString().Trim();
                        facD.XBox = dr[9].ToString().Trim();
                        facD.InterIsland_PIC = dr[11].ToString().Trim();
                        facD.InterNational_PIC = dr[10].ToString().Trim();
                        facD.Address = dr[12].ToString().Trim();
                        facD.Remarks = dr[13].ToString().Trim();
                        facD.Service_Type = dr[14].ToString().Trim();
                        facD.MITS = dr[15].ToString().Trim();
                        facD.SR_TN = dr[16].ToString().Trim();
                        facDetails.Add(facD);
                    }

                    ifxcon.Close();
                }

                return facDetails;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /*
         * API to call iPlanet Web Service
         * GET api/htaccount/CustomerByAccountSVC?id=200000000468039
         */
        [HttpGet, ActionName("CustomerByAccountSVC")]
        public List<serviceInformation> CustomerByAccountSVC(string id)
        {
            try
            {
                // Create an instance of the CustomerService service.
                using (ServiceResourceImplService custServ = new ServiceResourceImplService())
                {
                    custServ.Url = IPLANETURL;
                    serviceInformation[] info = custServ.findByCustomerAccount(id);
                    return (info != null) ? info.ToList<serviceInformation>(): new List<serviceInformation>();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /*
         * API to call iPlanet Web Service
         * api/htaccount/CustomerByCircuitIDSVC?circuitid=91.SWXX.162246..HTNG
         */
        [HttpGet, ActionName("CustomerByCircuitIDSVC")]
        public serviceInformation CustomerByCircuitIDSVC(string circuitID)
        {
            try
            {
                // Create an instance of the CustomerService service.
                using (ServiceResourceImplService custServ = new ServiceResourceImplService())
                {
                    custServ.Url = IPLANETURL;
                    serviceInformation info = custServ.findByCircuitId(circuitID);
                    return info;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /*
         * API to call iPlanet Web Service
         * api/htaccount/CustomerByServiceTNSVC?servicetn=8082621764
         */
        [HttpGet, ActionName("CustomerByServiceTNSVC")]
        public List<serviceInformation> CustomerByServiceTNSVC(string serviceTN)
        {
            try
            {
                // Create an instance of the CustomerService service.
                using (ServiceResourceImplService custServ = new ServiceResourceImplService())
                {
                    custServ.Url = IPLANETURL;
                    serviceInformation[] info = custServ.findByServiceTn(serviceTN);
                    return (info != null) ? info.ToList<serviceInformation>() : new List<serviceInformation>();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        #region Private Methods

        /*
         * This method is used to call for Customer Information Detail
         * id - PK for Customer Info
         */
        private CustomerInfoDetail CustomerInfoDetail(string id, string accountName, string btn, string accountType)
        {
            try
            {
                CustomerInfoDetail custInfoDetail = new CustomerInfoDetail();
                custInfoDetail.id = id; //Not needed. Added for tracking purposes
                custInfoDetail.AccountName = accountName;
                custInfoDetail.Btn = btn;
                custInfoDetail.AccountType = accountType; 

                // Populate Notes and VMFlagTypes of Customer Info Details
                // from CRM
                Notes_VMFlagTypes(custInfoDetail);

                // Populate Payments and CPEs of Customer Info Details
                // from Kenan
                Payments_CPEs(custInfoDetail);

                return custInfoDetail;
            }
            catch (Exception)
            {
                throw;
            }

        }

        /*
         * Used to populate Notes and VMFlagTypes of Customer Info Details
         * LNotes - List object of type CustomerInfoNotes to be populated
         * LVMFlagTypes - List object of type CustomerInfoVMFlagType to be populated
         */
        private void Notes_VMFlagTypes(CustomerInfoDetail custDetail)
        {
            try
            {
                using (OracleConnection con = new OracleConnection(CRMDB))
                {

                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("SYSADM.GET_360_CUSTOMER_INFO_WIDGET", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("Acct_No", OracleType.VarChar, 256).Value = custDetail.id;
                    cmd.Parameters["Acct_No"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("NOTEORESULTS", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CustomerInfoNote note = new CustomerInfoNote();
                        note.Note_Date = row["NOTE_DATE"].ToString();
                        note.Note_User = row["NOTE_USER"].ToString();
                        note.Note_Description = row["NOTE_DESCRIPTION"].ToString();
                        custDetail.Notes.Add(note);
                    }

                    // Explicitly close connection
                    con.Close();
                }
            }
            catch (Exception){
                throw;
            }
        }


        /*
         * Used to populate Payments and CPEs of Customer Info Details
         * LPayments - List object of type CustomerInfoPayment to be populated
         * LCPEs - List object of type CustomerInfoCPE to be populated
         */
        private void Payments_CPEs(CustomerInfoDetail custDetail)
        {
            try
            {
                using (OracleConnection con = new OracleConnection(KENANDB))
                {
                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_PAYMENT_AND_CPE_DETAILS", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 256).Value = custDetail.id;
                    cmd.Parameters["iAccountNo"].Direction = ParameterDirection.Input;
                    cmd.Parameters.Add("oPaymentDetails", OracleType.Cursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("oCPEDetails", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CustomerInfoPayment payment = new CustomerInfoPayment();
                        payment.Amount = row["AMOUNT"].ToString();
                        payment.PostedDate = row["POSTED_DATE"].ToString();
                        custDetail.Payments.Add(payment);
                    }
                    foreach (DataRow row in ds.Tables[1].Rows)
                    {
                        CustomerInfoCPE cpe = new CustomerInfoCPE();
                        cpe.SID = row["SID"].ToString();
                        cpe.Contract = row["CPE_CONTRACT"].ToString();
                        cpe.Contract_End_Date = row["CPE_CONTRACT_END"].ToString();
                        custDetail.CPEs.Add(cpe);
                    }

                    // Explicitly close connection
                    con.Close();
                }
            }
            catch (Exception){
                throw;
            }
        }

        #region ServiceType
        /*
         * Use to get the service type from product and services
         */
        private string ServType(string id)
        {
            try
            {
                //Declaration of Variable
                string sType = "";

                using (OracleConnection con = new OracleConnection(KENANDB))
                {

                    DataSet ds = new DataSet();

                    // Initialize Command and DataAdapter.
                    OracleCommand cmd;
                    OracleDataAdapter da;

                    // Open Connection and call stored procedure.
                    con.Open();
                    cmd = new OracleCommand("ARBOR.HT_ONE_PKG.GET_PRODUCTS_AND_SERVICES", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Stored procedure parameters.
                    cmd.Parameters.Add("iAccountNo", OracleType.VarChar, 256).Value = id;
                    cmd.Parameters.Add("oProductsAndServices", OracleType.Cursor).Direction = ParameterDirection.Output;

                    // Fill Dataset using DataAdapter
                    da = new OracleDataAdapter(cmd);
                    da.Fill(ds);

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        sType = row["SERVICE_TYPE"].ToString();
                    }

                    // Explicitly close connection
                    con.Close();
                }
                return sType;
            }
            catch (Exception)
            {
                throw;
            }

        }
        #endregion

        #region Category
        private static string Category(string emfId)
        {
            string CategoryType = String.Empty;

            ArrayList Voice;
            ArrayList Video;
            ArrayList Misc;
            ArrayList HostedSolution;
            ArrayList Data;

            string VoiceSerTyp = ConfigurationManager.AppSettings["VoiceSerTyp"];
            string VideoSerTyp = ConfigurationManager.AppSettings["VideoSerTyp"];
            string MiscSerTyp = ConfigurationManager.AppSettings["MiscSerTyp"];
            string HostSolSerTyp = ConfigurationManager.AppSettings["HostSolSerTyp"];
            string DataSerTyp = ConfigurationManager.AppSettings["DataSerTyp"];

            // Parse and sort the | delimited list of Voice. 
            Voice = new ArrayList();
            Voice.AddRange(VoiceSerTyp.Split('|'));
            Voice.Sort();

            // Parse and sort the | delimited list of Video. 
            Video = new ArrayList();
            Video.AddRange(VideoSerTyp.Split('|'));
            Video.Sort();

            // Parse and sort the | delimited list of Misc. 
            Misc = new ArrayList();
            Misc.AddRange(MiscSerTyp.Split('|'));
            Misc.Sort();

            // Parse and sort the | delimited list of Hosted Solutions. 
            HostedSolution = new ArrayList();
            HostedSolution.AddRange(HostSolSerTyp.Split('|'));
            HostedSolution.Sort();

            // Parse and sort the | delimited list of Data. 
            Data = new ArrayList();
            Data.AddRange(DataSerTyp.Split('|'));
            Data.Sort();

            #region Determine Category Type
            if (Voice.BinarySearch(emfId) > -1)
            {
                CategoryType = "Voice";
            }
            else if (Video.BinarySearch(emfId) > -1)
            {
                CategoryType = "Video";
            }
            else if (Misc.BinarySearch(emfId) > -1)
            {
                CategoryType = "Misc";
            }
            else if (HostedSolution.BinarySearch(emfId) > -1)
            {
                CategoryType = "Hosted Solutions";
            }
            else if (Data.BinarySearch(emfId) > -1)
            {
                CategoryType = "Data";
            }
            #endregion

            return CategoryType;
        }
        #endregion

        #endregion

    }
}