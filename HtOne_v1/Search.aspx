<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Search.aspx.cs" Inherits="HtOne_v1.Search" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>HT ONE Portal</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <%--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> Rachel, 09/26 [Get Local Copy of Files] --%>
    <%--<script src="Scripts/jQuery/1.11.1/jquery.min.js" type="text/javascript"></script>--%>
    <link href="Styles/search.css" rel="stylesheet" type="text/css" />
    <link href="Styles/search-form.css" rel="stylesheet" type="text/css" />
    <link href="Content/toastr.min.css" rel="stylesheet" />
    <link href="Styles/editable.css" rel="stylesheet" />
    <link href="Content/glyphicon.css" rel="stylesheet" />
    <!--[if IE]>
	<link rel="stylesheet" type="text/css" href="Styles/search-form-ie.css" />
	<![endif]-->
    
    <script src="Scripts/moment.js"></script>
    <script src="Scripts/jquery-2.1.1.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.plugin.min.js"></script>
    <script src="Scripts/jquery.maxlength.min.js"></script>
    <script src="Scripts/toastr-1.1.5.min.js"></script>
    <script src="Scripts/underscore-min.js"></script>
    <script src="Scripts/idle.js" type="text/javascript"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css" />
    <script src="Scripts/jQuery/ui-1.10.4/jquery-ui.js" type="text/javascript"></script>
    <script src="Scripts/jquery.numeric.js"></script>
    <script src="Scripts/q.min.js"></script>
    <script src="Scripts/knockout-2.2.0.js"></script>
    <%--<script src="Scripts/knockout-3.2.0.js"></script>--%>
    <link href="Styles/li-scroller.css" rel="stylesheet" type="text/css" />

   
    <%--This code is inserted to disable the back button when this page is loaded--%>
    <script type="text/javascript">
        function preventBack() { window.history.forward(); }
        setTimeout("preventBack()", 0);
        window.onunload = function () { null };
    </script>
     <style>
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

    #imgDownArrow {
        left:-210px;
    }

    input#weGo_accntName {
        left:30%;
    }

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
    <header >
    <%-- test textarea <textarea class="edit" rows="4" wrap="hard" cols="50" maxlength="10">--%>
                            </textarea>
        <%--HTML LOGOUT AND CRM LINK--%>
        <div id="buttonRight">
            <input type="button" id="logoff" value="Logoff" class="headerButton" />
            <input type="button" id="btnCRM" value="CRM" class="headerButton" />
        </div>
     
        <%--<img id="HTLogo" src="Images/HTOneLogo.png" />--%>
        <img id="HTLogo" src="Images/htone_Logo_top_left.png" alt="htone_Logo_top_left" />
        <img src="Images/htchain_Logo_top_right.png" id="HTLogoRigth" alt="htchain_Logo_top_right" />
        
        <%--<div id="portalLogo"> HT One Portal</div>--%>
        <div id="search-content">
            <form id="search" runat="server">
                <asp:Button ID="LogoffButton" runat="server" Style="display: none" OnClick="Logoff" />
                <%--ASPX LOGOUT BUTTON--%>
                <asp:Label ID="lblHTSearch" runat="server">HT Search: </asp:Label>
                <div id="asOne" style="display: inline-block;">
                    <div id="searchDropdown" class="styled-select">
                        <select>
                            <option value="Telephone Number" selected="selected">Telephone Number</option>
                            <option value="Circuit Id">Circuit ID</option>
                            <option value="Account Name">Account Name</option>
                            <option value="Account Number">Account Number</option>
                            <option value="Order Number">Order Number</option>
                            <option value="Ticket Number">Ticket Number</option>
                        </select>
                    </div>
                    <asp:TextBox ID="txtHTSearch" runat="server" placeholder="Enter a Keyword" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter a Keyword'"></asp:TextBox>
                </div>
                <asp:Button ID="btnSearch" runat="server" CssClass="btnImagePosition" Text="We Go" />
                <input type="button" id="HTSearchClear" style="opacity: 0;" />
                <input type="button" id="imgDownArrow" />


                <div id="fiveDiv" class="five-searches" style="display: none;">
                    <p id="fiveDiv_label">Previously Opened Accounts</p>
                    <div class="search-list-header">
                        <ul id="search-list">
                        </ul>
                    </div>
                </div>

                <div id="active_disconnected">
                   
                    <asp:RadioButton ID="active" Text="Active" Checked="True" GroupName="adbuttons"  runat="server"/>         
                    <asp:RadioButton ID="disconn" Text="Disconnected" GroupName="adbuttons"  runat="server"/>   
                        
                </div>

                <div id="div_searchError" runat="server" style="display: none;">
                    <asp:Label runat="server" ID="lbl_errorMsg">Error Message</asp:Label>
                </div>

                <div id="searchNameOptions" runat="server" style="display: none;">
                    <div id="innerDiv">
                        <div>
                            <label id="lbl_company" class="nameOption">Company Name: </label>
                            <asp:TextBox ID="txt_CompName" runat="server" placeholder="Enter a Keyword" MaxLength="56" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter a Keyword'"></asp:TextBox>
                        </div>
                        <div>
                            <label id="lbl_firstName" class="nameOption">First Name: </label>
                            <asp:TextBox ID="txt_fName" runat="server" placeholder="Enter a Keyword" MaxLength="30" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter a Keyword'"></asp:TextBox>
                        </div>
                        <label id="lbl_lastName" class="nameOption">Last Name: </label>
                        <asp:TextBox ID="txt_lName" runat="server" placeholder="Enter a Keyword" MaxLength="53" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter a Keyword'"></asp:TextBox>
                        <div>
                            <span>
                                <input type="button" id="weGo_accntName" value="We Go" /></span>
                            <span>
                                <input type="button" id="txtClearAccName" value="Clear" disabled="disabled" /></span>
                        </div>
                    </div>
                    <br />
                </div>

            </form>
            <br />

         
      
            <img id="Img1" src="Images/Gear.png" />       
            <div class="pakita">
                <p class="color" data-bind="click: $root.openManageTicker" style="padding-top: 5px;">
                    <a href="#" style="text-decoration:none;">Manage Ticker</a>
                </p>
            </div>         
        </div>

    </header>
    <label id="time" style="display: none;"></label>
    <div id="search-results-container" style="display: none;">
        <div id="search-results-left">
            <p style="visibility: hidden;">< Go Back to Portal page </p>
            <div id="search-results-left-buttons" style="display: none;">
                <input type="button" id="createTicket" value="Create OOF Ticket" />
                <input type="button" id="createAccount" value="Create New Account" />
            </div>
        </div>
        <div id="search-results-main" class="centered">
            <div id="search-results-main-bottom">
                <div id="navi-results">
                    <span id="result_showing_first">1</span> - <span id="result_showing_last">10</span> of <span id="result_total">1,000</span> Results
                </div>
                <div id="navi-dropdown">
                    <select id="show_per_page" class="paging-obj"></select><label for="show_per_page"> Per Page</label>
                </div>
                <div id="navi-paging">
                    <span id="showFirst" class="paging-btn"></span>
                    <span id="showPrevious" class="paging-btn"></span>
                    <span>Page
						<input type="text" id="pages_showing" class="paging-obj" maxlength="3" />
                        of <span id="pages_total">100</span></span>
                    <span id="showNext" class="paging-btn"></span>
                    <span id="showLast" class="paging-btn"></span>
                </div>
            </div>
            <div id="unselect-btn">
                <input type="button" id="unselectAll" value="Unselect All" disabled="disabled" />
            </div>
            <div class="result-items">
                <ul id="result-list">
                </ul>
            </div>
        </div>
        <div id="search-results-right">
            <div id="search-results-right-buttons">
                <input type="button" id="weGo" value="Compare" disabled="disabled" />
                <p id="selectedCounter"><span id="selected_counter">2</span> out of <span id="selected_limit">3</span> selected </p>
                <%--<input style="margin-top: 30px" type="button" id="btnDisconnected" value="Show Disconnected" disabled="disabled" />--%>
            </div>
        </div>
    </div>

    <div id="dialog-1" title="Attention" style="display: none;">You have reached the maximum limit of open dashboards. Please close one or more dashboards.</div>
     <script src="Scripts/search.js" type="text/javascript"></script>

    <div id="managTicker-dialog" data-bind="visible: $root.tickerInfoLoaded()" style="z-index:30000;font-size:12px;" title="Manage Ticker" style="display: none;">
        
        <div data-bind="visible: !$root.tickerInfoLoaded()">
            Loading...

        </div>

        <div data-bind="visible: $root.tickerInfoLoaded()">

            <span style="float: none;"></span>
               <div style="float:left;">
                <button class="button addNewButton" style="background-color: #003F72;" data-bind="click: $root.addTickerInfo, enable: $root.isItemEditing(), visible: isAdmin">Add New</button>
                <button class="button addNewButton" style="background-color: #003F72;" data-bind="click: $root.deleteSelected, enable: $root.isItemEditing(), visible: isAdmin">Remove Selected</button>
              </div>
                <div style="width:350px;margin-top:10px; vertical-align:top;height: 30px; margin-left:70%;"><label>Search:</label> <input type="text" id="filter" style="height: 1.5em;border: 1px solid #000; width: 180px;" data-bind="value: filterText, valueUpdate: 'afterkeydown'" /><a href="#" style="text-decoration:none;height: 1em;color:red;" class="glyphicon glyphicon-remove" data-bind="    click: emptyFilterText, visible: $root.filterText()"></a><!--<span class="glyphicon glyphicon-remove" data-bind="    click: emptyFilterText, visible: $root.filterText()" style="height: 1em;"></span>--></div>
           
             <table class="fruitGrid">
                <thead>
                    <tr>
                       <th class="headRow headColumn" data-bind="visible: $root.isAdmin">
                           <input type="checkbox" data-bind="click: $root.selectAll, checked: $root.allSelected" />
                        </th>
                       <th class="headRow headColumn">
                           Create Date
                        </th>
                        <th class="headRow headColumn">
                           Added By
                        </th>
                        <th class="headRow headColumn">
                            Item Type
                        </th>
                        <th class="headRow headColumn" style="width:350px;">
                            Description
                        </th>
                        <th class="headRow headColumn">
                           Status
                        </th>
                        <th class="headRow headColumn">
                           Last Modified By
                        </th>
                        <th class="headRow headColumn">
                           Last Modified Date
                        </th>
                        <th class="headRow tools" style="width:150px;" data-bind="visible: isAdmin">
                        </th>
                    </tr>
                </thead>
         
                <tbody data-bind="foreach: filteredItems">
                    <tr class="row" >
                         <td class="rowItem deleteCheckBox" data-bind="visible: $root.isAdmin">    
                        
                             <input type="checkbox" data-bind="checked: isSelected" />   
                        </td>
                         <td class="rowItem">   
                          
                            <label class="read" data-bind="text: $root.formatDate(CreateDate())" />
                        </td>
                         <td class="rowItem">
                           
                            <label class="read" data-bind="text: AddedBy"/>
                        </td>
                         <td class="rowItem">
                             <select data-bind="options: $root.itemTypes, optionsText: 'Name', optionsValue: 'Id', value: ItemType.editValue, visible: $root.isItemEditing($data)">
                            </select>
                           
                             <label class="read" data-bind="text: $root.getEnumName($root.itemTypes, ItemType()), visible: !$root.isItemEditing($data)" />

                        </td>
                         <td class="rowItem" style="width:350px;">
                             <span class="validationLabel validationMessage" data-bind='visible: hasError, text: validationMessage'> </span>
                             <textarea class="edit" rows="4" wrap="hard" cols="50" maxlength="256" data-bind="value: Description.editValue, visible: $root.isItemEditing($data), hasfocus: true">
                            </textarea>
                             <%--<textarea class="edit" rows="4" wrap="hard" cols="50" maxlength="256" onchange="testLength(this)" onkeyup="testLength(this)" data-bind="value: Description.editValue, visible: $root.isItemEditing($data),  hasfocus: true" >
                            </textarea>--%><%--<span  data-bind="text:  $root.descLength($data), visible: $root.isItemEditing($data)"></span> Chars--%>
                            <div class="read" data-bind="text: Description, visible: !$root.isItemEditing($data)" style="width: 300px;word-wrap: break-word;"  />
                            <!--<textarea  class="edit"  />-->
                     
                       
                        </td>
                         <td class="rowItem">
                     
                             <select data-bind="options: $root.statuses, optionsText: 'Name', optionsValue: 'Id', value: Status.editValue, visible: $root.isItemEditing($data)">
                            </select>

                            <%--<select class="edit" data-bind="options: $root.statuses, value: Status.editValue, visible: $root.isItemEditing($data)"></select>--%>
                            <label class="read" data-bind="text: $root.getEnumName($root.statuses, Status()), visible: !$root.isItemEditing($data)" />
                        </td>
                        <td class="rowItem">
                             <label class="read" data-bind="text: LastModBy" />
                        </td>
                          <td class="rowItem">
                         
                             <label class="read" data-bind="text: $root.formatDate(LastModDate())" />
                        </td>
                        <td class="tools" style="width:150px;" data-bind="visible: $root.isAdmin"> 

                                <a class="button toolButton" href="#" data-bind="click: $root.editTickerInfo.bind($root), visible: !$root.isItemEditing($data)">Edit</a> 
                                <a class="button toolButton" href="#" data-bind="click: $root.removeTickerInfo.bind($root), visible: !$root.isItemEditing($data)">Remove</a>
                                <a class="button toolButton" href="#" data-bind="click: $root.applyTickerInfo.bind($root), visible: $root.isItemEditing($data)">Apply</a>
                                <a class="button toolButton" href="#" data-bind="click: $root.cancelEdit.bind($root), visible: $root.isItemEditing($data)">Cancel</a>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    
    </div>
    <div style="height:200px;">

    </div>
    
    <div class="infoTicker" data-bind="visible: HasOpenInfo()" >
        <div style="margin-bottom:-30px; padding-top:4px; width:150px;" >Live Update:</div>
        <div class="hidden_tickers" style="display:none;" data-bind="foreach:TickerInfos">
            <span  data-bind=" text: $root.formatDate($data.CreateDate()) + ' ' + $data.Description(), visible: $data.Status() == 0,  style: { color: $data.ItemType() == 0 ? '#000' : 'red' }"></span>
        </div>
        <div class="marquee">
            
       </div>
      </div>
  
    <script src="Scripts/search.ko.js"></script>
    <script type="text/javascript" src="Scripts/jquery.marquee.min.js"></script>
</body>

</html>
