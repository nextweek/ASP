<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="HtOne_v1.Dashboard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
	<title>Dashboard</title>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=9" />

	<link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css" />
	<link href="Styles/dashboard.css" rel="stylesheet" type="text/css" />
	<link href="Styles/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="Styles/jquery.qtip.min.css" rel="stylesheet" type="text/css" />
    <link href="Styles/li-scroller.css" rel="stylesheet" type="text/css" />
    <script src="Scripts/q.min.js"></script>
	<script src="Scripts/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.qtip.min.js" type="text/javascript"></script> <!-- js for tooltip -->
    <script src="Scripts/imagesloaded.pkg.min.js" type="text/javascript"></script> <!-- js for tooltip -->
    <script src="Scripts/jquery.xml2json.js" type="text/javascript"></script><!--  js for tooltip -->
	<script src="Scripts/moment.js"></script>
	<script src="Scripts/jquery.dataTables.min.js" type="text/javascript"></script>
	<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
    <script type="text/javascript" src="Scripts/jquery.marquee.min.js"></script>
	<script src="Scripts/knockout-min.js" type="text/javascript"></script>
	<script src="Scripts/knockout.mapping-latest.js" type="text/javascript"></script>
	<script src="Scripts/dashboard.ko.js" type="text/javascript"></script>
	<script src="Scripts/dashboard.js" type="text/javascript"></script>

	<script type="text/javascript">
		$(window).on("mousemove click", function (e) {
			createCookie("time", 0, 1);
		});

		function createCookie(name, value, days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else var expires = "";
			document.cookie = name + "=" + value + expires + "; path=/";
		}

	</script>

	<%-- Orders & Cases Filtering [US213 & US246], Calendar size --%>
	<style>
		.ui-datepicker {
			font-size: 90%;
		}
         .marquee {
            width: 90%;
            overflow: hidden;
            background: transparent;
            margin-left:130px;
            font:bold 16px Arial;
            padding-top:5px;
        }

        .marquee span {
            padding-left:15px;
        }

    </style>
    <!--[if IE 9]>
    <style>
    .infoTicker {
        height:40px !important;
    }

    #HTSearchClear {   
        margin-right:10px;   
    }
     .marquee{
        font: bolder 0.95em Arial !important;
    }
    </style>
    <![endif]-->
</head>
<body onload="initialize();">
	<div class="contextMenu" id="expand_item" style="display: none;">
		<ul>
			<p class="expand_menu_label" id="expand_item_label">This Address</p>
			<li id="expand_this">Expand All</li>
			<li id="collapse_this">Collapse All</li>
			<li id="expand_this_services">Show Services</li>
			<li id="expand_this_groups">Show Service Groups</li>
		</ul>
	</div>
	<div class="contextMenu" id="expand_anywhere" style="display: none;">
		<ul>
			<p class="expand_menu_label">All Address</p>
			<li id="expand_all">Expand All</li>
			<li id="collapse_all">Collapse All</li>
			<li id="expand_services">Show Services</li>
			<li id="expand_serviceGroups">Show Service Groups</li>
		</ul>
	</div>

	<header>
		<span id="dashboard-title">HT ONE Dashboard</span>
		<div class="options">
			<img src="images/settings.png" alt="menu" id="gear" />
			<img src="images/triangle.png" alt="menu" id="triangle-menu" />
		</div>
	</header>

	<div id="left"></div>
	<!--menu------------------------------------------------------------->
	<div id="gearMenu">
			<ul>
				<li>
					<label id="lblGoToCRM" class="menuItems">Go To CRM</label><br />
				</li>
				<li>
					<label id="lblLogoff" class="menuItems" >Logoff</label>
				</li>
			</ul>
		</div>

    <!------------------->
    <div class="infoTicker" data-bind="visible: HasOpenInfo()" >
        <div style="margin-bottom:-30px; padding-top:4px; width:150px;" >Live Update:</div>
        <div class="hidden_tickers" style="display:none;" data-bind="foreach: TickerInfos">
            <span  data-bind=" text: $root.formatDate($data.CreateDate()) + ' ' + $data.Description(), visible: $data.Status() == 0, style: { color: $data.ItemType() == 0 ? '#000' : 'red' }"></span>
        </div>
        <div class="marquee">
            
       </div>
    </div> 
	<!--tabs------------------------------------------------------------->
	<div class="tabs">
		<div id="tab-container">
			<div class="tab" id="overview-tab">
				<p><span>Overview</span></p>
			</div>
		</div>
		<div class="content" id="overview-box">
			<div class="widget ui-widget-content" id="customInfo-widget">                
				<div class="contents">
					<p class="boxTitle">Customer Information</p>
					<p><span>Account Name: </span><span id="widget_accountName"></span></p>
					<p><span>Account Number: </span><span id="widget_accountNum"></span></p>
					<p><span>Account Type: </span><span id="widget_accountType"></span></p>
					<p><span>Account Status: </span><span id="widget_accountStatus"></span></p>
					<p><span>Authorized Parties: </span><span id="widget_authorizedParties"></span></p>
					<p><span>Account Start Date: </span><span id="widget_accountStarted"></span></p>
					<p><span>Shared Password: </span><span id="widget_sharedPassword"></span></p>
					<p><span>Shared Question: </span><span id="widget_sharedQuestion"></span></p>
					<p><span>Shared Answer: </span><span id="widget_sharedAnswer"></span></p>
					<p><span id="widget_serviceAddressLbl">Service Address: </span><span id="widget_serviceAddress"></span></p>
					<p><span id="widget_btnNoLbl">BTN: </span><span id="widget_btnNo"></span></p>
					<p><span id="widget_cktIdLbl">CKT ID: </span><span id="widget_cktId"></span></p>
					<p><span>Winback/Ported: </span><span id="widget_winbackPorted"></span></p>
				</div>
			</div>
			<div class="widget ui-widget-content" id="products-widget">
				<div class="contents">
					<p class="boxTitle">Products and Services</p>
					<div id="products-contents">
						<p><span>No. of Customer Sites: </span><span id="widget_noCustomerSites"></span></p>
						<p id="lbl_service_type_quantity"><span>Service Type and Quantity: </span></p>
						<div id="service_type_quantity" class="contents-block">
							<!--<p><span id="serviceType_0">POTS: </span><span id="serviceQuantity_0">2</span></p>
							<p><span id="serviceType_1">CTX: </span><span id="serviceQuantity_1">3</span></p>
							<p><span id="serviceType_2">DSL: </span><span id="serviceQuantity_2">2</span></p>
							<p><span id="serviceType_3">CPE: </span><span id="serviceQuantity_3">1</span></p>-->
						</div>
						<p><span>Active Services: </span><span id="widget_activeServices"></span></p>
						<p><span>Suspended Services: </span><span id="widget_suspendedServices"></span></p>
						<p><span>Pending Cases: </span><span id="widget_pendingCases"></span></p>
						<p><span>Pending Orders: </span><span id="widget_pendingOrders"></span></p>
					</div>
				</div>
			</div>			
			<div class="widget ui-widget-content" id="facs-widget">
				<div class="contents">
					<p class="boxTitle">FACS</p>
					<div id="facs-contents">
						<p><span>Service Types: </span><span id="widget_serviceTypes"></span></p>
						<p><span>Fac Type: </span><span id="widget_facTypes"></span></p>
						<p><span>Service Status: </span><span id="widget_serviceStatus"></span></p>
						<p><span>Cable Pair: </span><span id="widget_cablePair"></span></p>
						<p><span>LNI: </span><span id="widget_lni"></span></p>
						<p><span>SAG Remarks: </span><span id="widget_sagRemarks"></span></p>
					</div>
				</div>
			</div>
			<div class="widget widget2x ui-widget-content" id="orders_cases-widget">
				<div class="contents">
					<p class="boxTitle">Orders and Cases
					</p>
					<div class="wrapper">
						<div style="font-size: 130%; font-weight: bold;">Repair Tickets</div>
						<div class="t_cases" style="width: 99%;">
							<table id="cases_tbl" class="display" cellspacing="0" width="100%">
								<thead>
									<tr>
										<th>Date & Time Added</th>
										<th>Case ID</th>
										<th>Ticket Summary</th>
										<th>Commitment Date</th>
										<th>SUSP OOS</th>
										<th>TN / Circuit ID</th>
										<th>User Last Modified</th>
									</tr>
								</thead> 
								<tbody data-bind="foreach: AllCasesOverview">
									<tr>
										<td data-bind="text: Added_On"></td>
										<td data-bind="text: Case_ID"></td>
										<td data-bind="text: Case_Summary"></td>
										<td data-bind="text: Rev_Commit_Date_Time"></td>
										<td data-bind="text: Case_OOS"></td>
										<td data-bind="text: Case_TN_CKT_ID"></td>
										<td data-bind="text: Updated_By"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div style="margin-bottom: 25px;">
							<span data-bind="visible: AllCasesOverview().length > 3" style="color:#ff5353;font-style: italic;">More than 3 Pending tickets found</span>
						</div>
						<div style="font-size: 130%; font-weight: bold;">Orders</div>
						<div class="t_orders" style="width: 99%;">
							<table id="orders_tbl" class="display" cellspacing="0" width="100%">
								<thead>
									<tr>
										<th>Date & Time Added</th>
										<th>Order ID</th>
										<th>Description</th>
										<th>Due Date</th>
										<th>User Last Modified</th>
									</tr>
								</thead> 
								<tbody data-bind="foreach: AllOrdersOverview">
									<tr>
										<td data-bind="text: added_on"></td>
										<td data-bind="text: id"></td>
										<td data-bind="text: desc"></td>
										<td data-bind="text: due_date"></td>
										<td data-bind="text: updated_by"></td>
									</tr>
								</tbody>                               
							 </table>
						</div>
						<div style="margin-bottom: 25px;">
							<span data-bind="visible: AllOrdersOverview().length > 3" style="color:#ff5353;font-style: italic;">More than 3 Pending orders found</span>
					</div>
				</div>
			</div>
		</div>
        <!-- Billing Overview Widget -->
        <div class="widget ui-widget-content" id="billing-widget" >
			<div class="contents" style="overflow:hidden;">
				<p class="boxTitle">Billing</p>
				<div id="billing-contents">
                    <p ><span>Total Amount Due: </span><span data-bind="text: Billing.BillingOverview().Balance_Due"></span></p>
					<p ><span>Payment Due Date: </span><span data-bind="text: Billing.BillingOverview().Payment_Due_Date"></span></p>
					<p ><span>Bill Cycle : </span><span data-bind="text: Billing.BillingOverview().Bill_Cycle"></span></p>
                    <div id="remainingMonth"data-bind="foreach: Billing.BillingDetails , visible: Billing.BillingDetails().length > 0 ">
                        <div data-bind="visible : $data.Status == 'Active'">
                            <span>Remaining Months in Contract (</span><span data-bind="text: $data.Service"></span>):
                            <span data-bind="text: ($data.End_Date) ? $data.Month + ' month(s)' : 'No End Date'"></span>
                        </div>
                    </div>
                </div>
			</div>
		</div>

		</div>
		<!-- Tab Pages (Detailed View) -->
		<div class="content" id="customInfo-box" style="display:none;">
			<div class="page customInfo-page ui-widget-content" id="customInfo-box-left">
				<div class="contents">
					<p class="boxTitle">Account Summary</p>
					<div class="contents-block">
						<div id="customInfo_main">
							<p><span>Account Name: </span><span id="accountName"></span></p>
							<p><span>Account #: </span><span id="accountNum"></span></p>
							<p><span>Class of Service: </span><span id="classOfService"></span></p>
							<p><span>Account Type: </span><span id="accountType"></span></p>
							<p><span id="lblAccountStatus">Account Status: </span><span id="accountStatus"></span></p>
							<p><span>Account Start Date: </span><span id="accountStartDate"></span></p>
							<p><span>Account Balance: </span><span id="accountBalance"></span></p>
							<p><span>Last Payment Made: </span><span id="lastPaymentMade_amt"></span>   <span id="lastPaymentMade_date"></span></p>
							<p><span>Authorized Parties: </span></p>
							<ul id="authorizedParties"></ul>
						</div>
						<div id="customInfo_other">
							<p><span>Shared Password: </span><span id="sharedPassword"></span></p>
							<p><span>Shared Question: </span><span id="sharedQuestion"></span></p>
							<p><span>Shared Answer: </span><span id="sharedAnswer"></span></p>
							<p><span>Customer contact info: </span><span id="customContactInfo"></span></p>
							<%--<div class="columns">
								<p><span>Site Contact: </span><span id="siteContact"></span></p>
								<p><span>Site Access Hours: </span><span id="siteAccessHours"></span></p>
							</div>--%>
						</div>
					</div>
                    <p class="boxTitle">Contracts and Plans</p>
					    <div class="contents-block">
						    <p><span>CPE Contracts: </span></p>
						    <div id="cpeContracts">
						
						    </div>
					    </div>
					<p class="boxTitle" id="products-title">Products and Sites</p>
					    <div class="contents-block">
						    <p><span>Installed Services: </span><span id="productsAvailable"></span></p>
						    <p><span>Multi TN: </span><span id="multiTN"></span></p>
						    <p><span>Multi CKT: </span><span id="multiCKT"></span></p>
						    <p><span>Multi Site: </span><span id="multiSites"></span></p>
					    </div>
					<div class="contents-block" id="siteAddresses">
					</div>

					            
				</div>
			</div>
			<div class="page customInfo-page ui-widget-content" id="customInfo-box-right">
				<div class="contents">
                   <!--  Perm Notes -->
				    <p class="boxTitle">Perm Notes
                        <span class="link link_filters" data-bind="click: PermFilterShow">Filter Options</span>
                        <span class="link link_filters" data-bind="click: PermShowAll ">Show All</span>
				    </p>
					<div class="table_wrapper">
					    <table id="permNoteTable">
                            <thead>
                                <tr>
                                    <th>Date And Time Added</th>
                                    <th>Added By</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody class="markHover" data-bind="foreach: PermContainer">
                                <tr>
                                    <td data-bind="text: Note_Date"></td>
                                    <td data-bind="text: Note_User"></td>
                                    <td><span data-bind="event: { mouseover: helpers.onMouseOver, mouseleave: helpers.onMouseLeave }, text: Note_User == 'HT_CONV_CBSS' ? 'CONVERSION' :  Note_Description != '' ? Note_Description.substring(0, 30) + '... ' : '', style: { cursor: 'pointer', color: '#1e13b0' }, click: function () { $root.ShowDetailed(Note_Description) }"></span></td>
                                </tr>
                            </tbody>
					    </table>
					</div>   
                    <div>
                        <textarea data-bind="text: textArea" style="width: 95%;height: 150px;padding:1em 1em 1em 1em;border-radius: 0.5em;resize:vertical" readonly></textarea>
                    </div>     
                    <!-- Interaction Notes -->
                    <p class="boxTitle">Interaction Notes
                        <span class="link link_filters" data-bind="click: Interactions.ShowFilter">Filter Options</span>
					    <span class="link link_filters" data-bind="click: Interactions.ShowAll">Show All</span>
                    </p>
                    <div class="table_wrapper">
                        <table id="tbl_Interactions">
						    <thead>
							    <tr>
								    <th>Date & Time Added</th>
								    <th>Added By</th>
								    <th>Notes</th>
							    </tr>
						    </thead>                  
						    <tbody data-bind="foreach: Interactions.Notes">                     
							    <tr>
								    <td data-bind="text: $data.Date_Time_Added"></td>
								    <td data-bind="text: $data.Added_By"></td>
								    <td data-bind="text: $data.Notes"></td>
						       </tr>                                                 
						    </tbody>
					    </table>
                    </div>
                    <!-- End of Interaction Notes -->
				</div>
			</div>
		</div>

		<div class="content" id="products-box" style="display: none; clear: both;width: 90%;">
			<div style="float: left;">
				<div style="width: 720px;">
					<div style="width: 100%;height:800px;overflow:auto;overflow:hidden" class="page products-page ui-widget-content">
						<div class="contents tree">
							<ul id="child-tree"></ul>
							<ul id="levelComponents-tree"></ul>
							<ul id="products-tree"></ul>
						</div>
					</div>
				</div>
			</div>
			<div style="float: right;margin-right:50px;font-size: 14px;">
				<div style="width: 330px;">

					<ul data-bind="foreach: pics" style="width: 100%; ">
					<li class="list-form" style="text-align: left;">


							<table style="padding: 0px; margin: 0px; width: 100%;">
								<tr>
									<td colspan="2">
						<div style="width: 100%; text-align: center;">
							<span style="font-weight: bold;" data-bind="text: $data.tn"></span>
							<button data-bind="click: $root.RemovePic" class="close" style="height: 16px; float: right;"></button>
						</div>
									</td>

								</tr>
								
								<tr>
									<td style="width:40%;text-align: left;">
										
										<span style="font-weight: bold; text-decoration:underline;">Kenan PICs</span>
						<table style="padding: 0px; margin: 0px; width: 100%;">
							<tr>
												<td>LOCAL PIC: <span data-bind="text: $data.interisland"></span>
								</td>
												<%--<td>
									<span data-bind="text: $data.interisland"></span>
												</td>--%>

							</tr>
							<tr>
												<td>LD PIC: <span data-bind="text: $data.mainland"></span>
								</td>
												<%--<td>
									<span data-bind="text: $data.mainland"></span>
												</td>--%>

							</tr>
							<tr>
												<td>
													INTL PIC: <span data-bind="text: $data.international"></span>
								</td>
												<%--<td>
									<span data-bind="text: $data.international"></span>
												</td>--%>

							</tr>
						</table>
									</td>
									<td style="width:60%;text-align: left; vertical-align: top;">
										<span style="font-weight: bold; text-decoration:underline;">AAIS-NB PICs</span>
										<table style="padding: 0px; margin: 0px; width: 100%;">
							<tbody data-bind="foreach: $data.NBPics">
								<tr>
													<td>Inter-Island PIC: <span data-bind="text: $data.InterIsland_PIC"></span>
									</td>
													<%--<td>
										<span data-bind="text: $data.InterIsland_PIC"></span>
													</td>--%>

								</tr>
								<tr>
													<td>Mainland/International: <span data-bind="text: $data.InterNational_PIC"></span>
									</td>
												   <%-- <td>
										<span data-bind="text: $data.InterNational_PIC"></span>
													</td>--%>

								</tr>
							</tbody>
						</table>
									</td>
								</tr>

							</table>

							
							
						   
					</li>
				</ul>
			</div>

		</div>
		<div style="width:600px;"></div>
		</div>


	 

		<div class="content" id="facs-box" style="display:none;">
			<div id="facs-page">
				<div id="facs-dropdown">
					<p>Select a service to display:</p>
					<select id="service-dropdown" class="paging-obj"></select>
				</div>
                <div id="facs-box-left">
                    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block"></div>
					    </div>
				    </div>
				    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block">
						    </div>
					    </div>
				    </div>
				    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block">
						    </div>
					    </div>
				    </div>
                </div>
                <div id="facs-box-right">
                    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block"></div>
					    </div>
				    </div>
				    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block">
						    </div>
					    </div>
				    </div>
				    <div class="page ui-widget-content">
					    <div class="contents">
						    <p class="boxTitle"></p>
						    <div class="contents-block">
						    </div>
					    </div>
				    </div>
                </div>
			</div>
		</div>
				 <%-- MARK ARIS TRINIDAD resizable--%>
		 <div class="content" id="orders-box" style="display:none;" >
		 <%-- Repair Tickets--%>
			 <div class="widget ui-widget-content orderStyling">
				<div class="contents" style="width:100%">
						<span class="headTitle">Repair Tickets</span>
						<span class="link" data-bind="click: function () { Modal('Repair Tickets') }">Filter Options</span>
						<span class="link" data-bind="click: ShowAllTickets">Show All</span>
					<div>
						<div style="width:99%">
					<table id="RepairTickets" class="display" cellspacing="0" width="100%">                        
						<thead>
							<tr>
								<th>Reference Status</th>
								<th>Reference Date & Time Added</th>
								<th>Case ID</th>
								<th>Status</th>
								<th>Ticket Summary</th>
								<th>Commitment Date</th>
								<th>Provider Group</th>
								<th>SUSP OOS</th>
								<th>Description</th>
								<th>Tech Assigned</th>
								<th>Date & Time Added</th>
								<th>User Last Modified</th>
							</tr>
						</thead>                  
					  
						<tbody data-bind="foreach: AllRepairTickets">                     
							<tr>
								<td data-bind="text: $data.Case_Status_ID"></td>
								<td data-bind="text: $data.Added_On"></td>
								<td data-bind="text: $data.Case_ID"></td>
								<td data-bind="text: $data.Case_Status_Desc"></td>
								<td data-bind="text: $data.Case_Summary"></td>
								<td data-bind="text: $data.Rev_Commit_Date_Time"></td>
								<td data-bind="text: $data.Provider_Grp_Name"></td>
								<td data-bind="text: $data.Case_OOS"></td>
								<td data-bind="text: $data.Case_Description"></td>
								<td data-bind="text: $data.HTRC_Dispatch_Asgn"></td>
								<td data-bind="text: $data.Added_On"></td>
								<td data-bind="text: $data.Updated_By"></td>
						   </tr>                                                 
						</tbody>
					</table>
		</div>
				  <div style="margin-bottom: 25px;">
					<span data-bind="visible: countRepairPending() > 3 && showRepair" style="color:#ff5353;font-style: italic;">More than 3 Pending tickets found</span>
				</div>
	</div>	
				</div>
			</div>	
			<%--CRM ORDERS--%>
			<div data-bind="visible: ShowOrders" class="widget ui-widget-content orderStyling" style="height:565px;">
				<div class="contents" style="width:100%;height:100%;">
					<span class="headTitle">Orders</span>
					<div style="height:95%">
						<div data-bind="visible: RegOrders().length > 0" style="width:99%">
						<div class="container" style="padding:10px;">
						    <span class="headTitle" style="color:#FEC979">CRM Orders</span>
						    <span class="link" data-bind="click: function () { Modal('CRM Orders') }">Filter Options</span>
						    <span class="link" data-bind="click: ShowAllOrders">Show All</span>
					    </div>         
					    <table id="detailedOrders" class="display" cellspacing="30" width="100%">                        
						    <thead>
							    <tr>
								    <th>Reference Order Status ID</th>
								    <th>Reference Added On</th>
                                    <th>Order ID</th>
                                    <th>Start Work Date</th>
                                    <th>Order Due Date</th>
                                    <th>Status</th>
								    <th>Date & Time Added</th>
								    <th>Order Description</th>
                                    <th>Work With Order</th>
                                    <th>Order Progress</th> 
                                    <th>Tech Notes</th>
                                    <th>User Last Modified</th>
							    </tr>
						    </thead>                  
						    <tbody data-bind="foreach: RegOrders">                 
							    <tr>
								    <td data-bind="text: $data.Order_Status_ID"></td>
								    <td data-bind="text: $data.Added_On"></td>
								    <td data-bind="text: $data.Order_ID"></td>
                                    <td data-bind="text: $root.strtWork($data.Order_ID)"></td>
								    <td data-bind="text: $root.dueDate($data.Order_ID)"></td>
                                    <td data-bind="text: $data.Order_Status_Desc"></td>
                                    <td data-bind="text: $data.Added_On"></td>
								    <td data-bind="text: $data.Order_Descr"></td>
								    <td data-bind="text: $data.Related_Orders"></td>
                                    <td data-bind="text: $data.Order_ID"></td>
								    <td data-bind="text: $data.Tech_Notes"></td>                                
								    <td data-bind="text: $data.Updated_By"></td>                                           
						       </tr>                                                
						    </tbody>
					    </table>
					</div>
					<div data-bind="visible: RegOrders().length > 0" style="margin-bottom: 25px;">					   
					    <span data-bind="visible: countCRMPending() > 3 && showCRM" style="color:#ff5353;font-style: italic;">More than 3 pending CRM Orders found</span>
				    </div>
					<div data-bind="visible: EPapers().length > 0" style="width:99%">
					    <div class="container" style="padding:10px;">
						    <span class="headTitle" style="color:#FEC979">ePaper Orders</span>
						    <span class="link" data-bind="click: function () { Modal('ePaper') }">Filter Options</span>
						    <span class="link" data-bind="click: ShowAllePapers">Show All</span>
					    </div>         
					<table id="ePapers" class="display" cellspacing="30" width="100%">                        
						<thead>
							<tr>
								<th>Reference Status ID</th>
								<th>Reference Added On</th>
                                <th>Order ID</th>
                                <th>Start Work Date</th>
                                <th>Order Due Date</th>
                                <th>Status</th>
								<th>Date & Time Added</th>
								<th>Order Description</th>
                                <th>Work With Order</th>
                                <th>Order Progress</th>
								<th>Tech Notes</th>                    
								<th>User Last Modified</th>                               
							</tr>
						</thead>                  
						<tbody data-bind="foreach: EPapers">                 
							<tr>
							   
								<td data-bind="text: $data.EPaper_Status_ID"></td>
								<td data-bind="text: $data.Added_On"></td>
                                <td data-bind="text: $data.EPaper_ID"></td>
                                <td data-bind="text: $data.Strt_Work_Date"></td>
                                <td data-bind="text: moment($data.EPaper_Due_Date).format('MM/DD/YYYY')"></td>
                                <td data-bind="text: $data.EPaper_Status_Desc"></td>
								<td data-bind="text: $data.Added_On"></td>
								<td data-bind="text: $data.EPaper_Description"></td>
								<td data-bind="text: $data.EPaper_Related_Order"></td>
                                <td data-bind="text: $data.EPaper_ID"></td>
								<td data-bind="text: $data.Tech_Notes"></td>
								<td data-bind="text: $data.Updated_By"></td>                             
						   </tr>                                                
						</tbody>
					</table>
				</div>
				<div data-bind="visible: EPapers().length > 0" style="margin-bottom: 25px;">
					<span data-bind="visible: EPaperPending() > 3 && showEPaper" style="color:#ff5353;font-style: italic;">More than 3 pending EPaper Orders found</span>
				</div>
				</div>
				</div>
			</div>  
				
			 <%--CCT TIckets--%>
			 <div class="widget ui-widget-content orderStyling">
				<div class="contents" style="width:100%">
						<span class="headTitle">CCT Tickets</span>
						<span class="link" data-bind="click: function () { Modal('CCT Tickets') }">Filter Options</span>
						<span class="link" data-bind="click: ShowAllCCT">Show All</span>
					<div>
						<div style="width:99%">
					<table id="cct" class="display" cellspacing="0" width="100%">                        
						<thead>
							<tr>
								<th>Reference Status ID</th>
								<th>Reference Date Added</th>
								<th>Case ID</th>
								<th>Ticket Summary</th>
								<th>Commitment Date</th>
								<th>Provider Group</th>
								<th>Category</th>
								<th>Related Order</th>
								<th>Description</th>    
								<th>Status</th>							
								<th>Date & Time Added</th>
								<th>User Last Modified</th>
							</tr>
						</thead>                  
					  
						<tbody data-bind="foreach: AllCCTTickets">              
						
							<tr>
								<td data-bind="text: $data.Case_Status_ID"></td>
								<td data-bind="text: $data.Added_On"></td>
																
								<td data-bind="text: $data.Case_ID"></td>
								<td data-bind="text: $data.Case_Summary"></td>
								<td data-bind="text: $data.CCT_Commit_Date"></td>
								<td data-bind="text: $data.Provider_Grp_Name"></td>	
								<td data-bind="text: $data.Case_Category_Desc"></td>
								<td data-bind="text: $data.Related_Order_Case"></td>
								<td data-bind="text: $data.Case_Description"></td>
								<td data-bind="text: $data.Case_Status_Desc"></td>  															
								<td data-bind="text: $data.Added_On"></td>
								<td data-bind="text: $data.Updated_By"></td>                   
						   </tr> 
						</tbody>
					</table>
				</div>
				<div style="margin-bottom: 25px;">
						<span data-bind="visible: countCCTPending() > 3 && showCCT" style="color:#ff5353;font-style: italic;">More than 3 Pending tickets found</span>
						
				</div>
					</div>
				</div>
				</div>
			</div>        
        
            <%--  MARK ARIS TRINIDAD--%>
        
        <!-- Added by DJ 10/22/2014 -> Used in Billing Details -->
        <div class="content" id="billing-box" style="display: none; clear: both;width: 90%;">
	        <div style="float: left;">
			    <div class="page billing-page ui-widget-content" style="padding-bottom:20px;">
                    <div class="contents">
                        <span class="boxTitle">Billing Account Information</span>
                        <div class="billinfo_header">
                            <p><span>Total Amount Due: </span><span data-bind="text: Billing.BillingOverview().Balance_Due"></span></p>
                            <p><span>Payment Due Date: </span><span data-bind="text: Billing.BillingOverview().Payment_Due_Date"></span></p>
                            <p><span>Bill Cycle: </span><span data-bind="text: Billing.BillingOverview().Bill_Cycle"></span></p>
                        </div>
					    <div class="billinfo_detail">
                            <span class="boxTitle">Contract Information</span>
                            <span class="link link_filters" data-bind="click: Billing.ShowFilter">Filter Options</span>
						    <span class="link link_filters" data-bind="click: Billing.ShowAll">Show All</span>
						    <div class="table_wrapper">
					            <table id="billing_tbl" class="display">
						            <thead>
							            <tr>
                                            <th>Ref Status</th>
								            <th>Ref Start Date</th>
								            <th>Ref End Date</th>
                                            <th>Identifier</th>
								            <th>Service</th>
								            <th>Description</th>
								            <th>Status</th>
								            <th>Contract Start Date</th>
								            <th>Contract End Date</th>
								            <th>Remaining Months in Contract</th>
							            </tr>
						            </thead>                  
						            <tbody data-bind="foreach: Billing.BillingDetails">
							            <tr>
                                            <td data-bind="text: $data.Status"></td>
                                            <td data-bind="text: $data.Start_Date"></td>
                                            <td data-bind="text: $data.End_Date"></td>
                                            <td data-bind="text: $data.ExternalID"></td>
								            <td data-bind="text: $data.Service"></td>
                                            <td data-bind="text: $data.Contact_Desc"></td>
                                            <td data-bind="text: $data.Status"></td>
                                            <td data-bind="text: $data.Start_Date"></td>
                                            <td data-bind="text: ($data.End_Date || 'No End Date')"></td>
                                            <td data-bind="text: ($data.End_Date) ? $data.Month : '-'"></td>
                                        </tr>
						            </tbody>
					            </table>
		                    </div>
	                    </div>	
                    </div>
			    </div>
		    </div>
        </div>

        <!-- End of Billing Details -->

	</div> 
          
	<div id="dialog-1" title="Attention" style="display: none;">You have reached the maximum limit of open dashboards. Please close one or more dashboards.</div>
   
	
    <div id="bill_dialog" title="Contracts" style="display:none;font-size:80%">
        <div class="lblPopupDialog">Display Last: </div>
            <select data-bind="value: Billing.DisplayNum" style="width:167px;">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="-1">All</option>
            </select><br />
        <div class="lblPopupDialog">Status: </div>
            <select data-bind="value: Billing.Status" style="width:167px;">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="(Active|Inactive)">Active and Inactive</option>
            </select><br />
        <div class="lblPopupDialog">Start Contract Date Range: </div>
            <input type="text" data-bind="value: Billing.StartFrom" class="billdatepicker" size="8" placeholder="From" /> - 
            <input type="text" data-bind="value: Billing.StartTo" class="billdatepicker" size="8" placeholder="To" /> <br />
        <div class="lblPopupDialog">End Contract Date Range: </div>
            <input type="text" data-bind="value: Billing.EndFrom" class="billdatepicker" size="8" placeholder="From" /> - 
            <input type="text" data-bind="value: Billing.EndTo" class="billdatepicker" size="8" placeholder="To" />
    </div> 

    <div id="interac_dialog" title="Interaction Notes" style="display:none;font-size:80%;padding-top:30px;height:100px;">
        <div class="lblPopupDialog">Display Last: </div>
            <select data-bind="value: Interactions.DisplayNum" style="width:167px;">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="-1">All</option>
            </select><br />
        <div class="lblPopupDialog">Added By: </div>
            <select data-bind="options: Interactions.AvailableAddedBy, optionsCaption: 'Choose...', value: Interactions.AddedBy, " style="width:167px;">
            </select><br />
        <div class="lblPopupDialog">Date Range: </div>
            <input type="text" data-bind="value: Interactions.StartDate" class="datepicker" size="8" placeholder="From" /> - 
            <input type="text" data-bind="value: Interactions.EndDate" class="datepicker" size="8" placeholder="To" /> <br />
    </div> 

   <div id="perm_dialog" title="Perm Notes" style="display:none;font-size:0.8em;">
        <div class="lblPopupDialog">Display Last: </div>
            <select data-bind="value: CurrPage, options: CurrPageOptions" style="width:167px;">              
            </select><br />
        <div class="lblPopupDialog">Added By: </div>
            <select data-bind="options: UserContainer, optionsCaption: 'Choose...', value: User, " style="width:167px;margin-left: 1.5em;">
            </select><br />
        <div class="lblPopupDialog">Date Range: </div>
            <input type="text" style="margin-left: 0.2em" data-bind="value: PermStartDate" class="datepicker" size="8" placeholder="From" /> - 
            <input type="text" data-bind="value: PermEndDate" class="datepicker" size="8" placeholder="To" /> <br />
    </div> 

	<div id="filter-dialog" title="Type" style="display: none;">
		<div id="filter-options">
			<!--MARK-->
			<!--ko if: Category() == 'CCT Tickets' -->
				<!-- ko foreach: Options-->
					<p><input type="radio" data-bind="value: $index, checked: $root.OptionCCT"  name="filter" /><label  data-bind="    text: $data"></label></p>
				<!-- /ko -->
				<p><input type="radio" id="option-5" value="Date Range" data-bind="checked: $root.OptionCCT" name="filter"/><label  data-bind="    text: 'Date Range'"></label> <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtFromCCT"/> to <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtToCCT"/></p>
			<!-- /ko -->

			<!--ko if: Category() == 'ePaper' -->
				<!-- ko foreach: Options-->
					<p><input type="radio" data-bind="value: $index, checked: $root.OptionEPaper"  name="filter" /><label  data-bind="    text: $data"></label></p>
				<!-- /ko -->
				<p><input type="radio" id="Radio1" value="Date Range" data-bind="checked: $root.OptionEPaper" name="filter"/><label  data-bind="    text: 'Date Range'"></label> <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtFromEPaper"/> to <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtToEPaper"/></p>
			<!-- /ko -->

			<!--ko if: Category() == 'CRM Orders' -->
			   <!-- ko foreach: Options-->
					<p><input type="radio" data-bind="value: $index, checked: $root.OptionCRM"  name="filter" /><label  data-bind="    text: $data"></label></p>
				<!-- /ko -->
				<p><input type="radio" id="Radio2" value="Date Range" data-bind="checked: $root.OptionCRM" name="filter"/><label  data-bind="    text: 'Date Range'"></label> <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtFromCRM"/> to <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtToCRM"/></p>
			<!-- /ko -->

			<!--ko if: Category() == 'Repair Tickets' -->
			   <!-- ko foreach: Options-->
					<p><input type="radio" data-bind="value: $index, checked: $root.OptionRepair"  name="filter" /><label  data-bind="    text: $data"></label></p>
				<!-- /ko -->
				<p><input type="radio" id="Radio3" value="Date Range" data-bind="checked: $root.OptionRepair" name="filter"/><label  data-bind="    text: 'Date Range'"></label> <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtFromRepair"/> to <input type="text" class="datepicker" placeholder="mm/dd/yyyy" id="dtToRepair"/></p>
			<!-- /ko -->

		</div>	 
	</div>
    
    
</body>
</html>
