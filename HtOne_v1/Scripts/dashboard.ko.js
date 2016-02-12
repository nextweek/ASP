var filter;
var vm;

function truncate(string, len) {
    var word = decodeURI(string);
    if (word.length > len)
        return word.substring(0, len) + '...';
    else
        return word;
};

window.helpers = {
    onMouseOver: function onMouseOver(data, event) {
        var $el = $(event.target);
        $el.addClass('hover');
    },
    onMouseLeave: function onMouseLeave(data, event) {
        var $el = $(event.currentTarget);
        $el.removeClass('hover');
    }
}

// Used to filter date range in datatables (billing, interaction notes)
$.fn.dataTableExt.afnFiltering.push(
    function (oSettings, aData, iDataIndex) {
        if (oSettings.sTableId == "billing_tbl") {
            var min = new Date(vm.Billing.StartFrom()).getTime();
            var max = new Date(vm.Billing.StartTo() + ' 23:59:59').getTime();
            var dt = new Date(aData[1]).getTime(); // Start Date
            var min2 = new Date(vm.Billing.EndFrom()).getTime();
            var max2 = new Date(vm.Billing.EndTo() + ' 23:59:59').getTime();
            var dt2 = new Date(aData[2]).getTime(); // End Date

            if ((min && !isNaN(min))) {
                if (dt < min || !dt) return false;
            }
            if ((max && !isNaN(max))) {
                if (dt > max || !dt) return false;
            }
            if ((min2 && !isNaN(min2))) {
                if (dt2 < min2 || !dt2) return false;
            }
            if ((max2 && !isNaN(max2))) {
                if (dt2 > max2 || !dt2) return false;
            }

            return true;
        } else if(oSettings.sTableId == "tbl_Interactions"){
            var min = new Date(vm.Interactions.StartDate()).getTime();
            var max = new Date(vm.Interactions.EndDate() + ' 23:59:59').getTime();
            var dt = new Date(aData[0]).getTime(); // Date Added

            if ((min && !isNaN(min))) {
                if (dt < min || !dt) return false;
            }
            if ((max && !isNaN(max))) {
                if (dt > max || !dt) return false;
            }

            return true;
        } else if (oSettings.sTableId == "permNoteTable") {
            var min = new Date(vm.PermStartDate()).getTime();
            var max = new Date(vm.PermEndDate() + ' 23:59:59').getTime();
            var dt = new Date(aData[0]).getTime(); // Date Added

            if ((min && !isNaN(min))) {
                if (dt < min || !dt) return false;
            }
            if ((max && !isNaN(max))) {
                if (dt > max || !dt) return false;
            }

            return true;
        } else {
            return true; // So other data tables will not be filtered
        }
    });

// Used to return unique values of an array.
function unique(array) {
    return $.grep(array || '', function (el, index) {
        return index == $.inArray(el, array);
    });
}

var Orders = function (data) {
    this.id = data.Order_ID || data.EPaper_ID;
    this.added_by = data.Added_By;
    this.added_on = data.Added_On;
    this.updated_by = data.Updated_By;
    this.updated_on = data.Updated_On;
    this.due_date = moment(data.duedate2 || data.Header_Due_Date || data.EPaper_Due_Date).format('MM/DD/YYYY');
    this.status_id = data.Order_Status_ID || data.EPaper_Status_ID;
    this.status_desc = data.Order_Status_Desc || data.EPaper_Status_Desc;
    this.desc = data.Order_Descr || data.EPaper_Description;
    this.related_order = data.Related_Orders || data.EPaper_Related_Order;
};

function TickerInfo(tickerInfoId, createDate, addedBy, itemType, description, status, lastModBy, lastModDate) {
    var self = this;

    var _lastModBy = lastModBy == null ? '' : lastModBy;
    var _lastModDate = lastModDate == null ? '' : lastModDate;

    self.forDelete = ko.observable(true);
    self.isSelected = ko.observable(false),
    self.TickerInfoId = ko.observable(tickerInfoId);
    self.CreateDate = ko.observable(createDate);
    self.AddedBy = ko.observable(addedBy);
    self.ItemType = ko.observable(itemType);
    self.Description = ko.observable(description);
    //self.Description = ko.observable(description).extend({  // custom message
    //    required: { message: 'Description is required' }
    //}),
    self.Status = ko.observable(status);
    self.LastModBy = ko.observable(_lastModBy);
    self.LastModDate = ko.observable(_lastModDate);
    self.hasError = ko.observable(false);
    self.validationMessage = ko.observable();
};

var BillingSubModel = function (accountNum) {
    var self = this;

    // Observables for Billing Overview and Details
    self.BillingOverview = ko.observableArray();
    self.BillingDetails = ko.observableArray();
    self.BillingTable = ko.observable();
    self.BillingDialog = ko.observable();

    // Observables used in filter options
    self.Status = ko.observable("Active");
    self.DisplayNum = ko.observable(5);
    self.StartFrom = ko.observable();
    self.StartTo = ko.observable();
    self.EndFrom = ko.observable();
    self.EndTo = ko.observable();

    // Get billing details
    $.ajax({
        url: 'api/htaccount/GetBillingInfo?id=' + accountNum,
        success: function (data) {
            self.BillingOverview(data.overview[0] || ''); // Assign overview result to overview observable
            self.BillingDetails(data.details || '');      // Assign details result to details observable
            self.ShowDetails();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.responseJSON.MessageDetail || errorThrown)
        }
    });

    // Show "No Records" or "DataTable"
    self.ShowDetails = function () {
        if (self.BillingDetails() && self.BillingDetails().length > 0) {
            self.SetupTable();  // Setup datatable
            self.Filter();      // Initial filter
        } else {
            $('.billinfo_detail .link').hide(); // Hide "filter options" and "show all"
            $('.billinfo_detail .table_wrapper').html('<span class="no-record">No contracts are found on this account.</span>'); // Replace table with this message
        }
    }

    // Setup datatable, dialog and datepicker
    self.SetupTable = function () {
        self.BillingTable = $('#billing_tbl').dataTable({   // DataTable
                "dom": 'ti',
                "order": [[7, "desc"]],
                "language": {"zeroRecords": "No Contracts Found"},
                "aoColumnDefs": [
                    {"targets": [0, 1, 2], "visible": false },
                    {"targets": 7,"sType": "date"}],
                "aLengthMenu": [[5,10,20,50,100,-1], [5,10,20,50,100,'All']],
                "iDisplayLength": 5
        });

        self.BillingDialog = $('#bill_dialog').dialog({     // Filter Dialog
            autoOpen: false,
            height: 250, width: 400,
            modal: true, resizable: false,
            dialogClass: 'billDialog',
            position: ['center', 'middle'],
            buttons: [{
                text: "OK", default: true, "style": "width:80px;",
                click: function () { self.Filter(); $(this).dialog("close"); }
            }, {
                text: "Cancel",
                click: function () { $(this).dialog("close"); }
            }],
            css: { background: '#000'}
        });

        $('.billdatepicker').each(function () {             // Setup billing datepicker
            $(this).datepicker();
        });

    };

    //////////////////////// Events ////////////////////////
    // Show all billing contracts
    self.ShowAll = function () {
        self.ResetAllFilter();
        self.DisplayNum(-1);
        self.Status("(Active|Inactive)");
        self.BillingTable.fnSettings()._iDisplayLength = -1;    // -1 -> All records
        self.BillingTable.fnDraw();
    }

    // Show filter options
    self.ShowFilter = function () {
        self.BillingDialog.dialog("open");
    }

    // Filter result in table
    self.Filter = function () {
        var preSearch = self.BillingTable.fnSettings();
        preSearch.aoPreSearchCols[0].sSearch = "^\\s*" + self.Status() + "\\s*$";
        preSearch.aoPreSearchCols[0].bRegex = true;
        preSearch._iDisplayLength = parseInt(self.DisplayNum());
        self.BillingTable.fnDraw();
    }

    // Reset all filters
    self.ResetAllFilter = function () {
        self.BillingTable.fnSettings().aoPreSearchCols[0].sSearch = '';
        self.StartFrom(''); self.StartTo('');
        self.EndFrom(''); self.EndTo('');
    }
}

var InteractionsSubModel = function (accountNum) {
    var self = this;

    // Observables for Interaction Notes
    self.Notes = ko.observableArray();

    // Observables used in filter options
    self.AvailableAddedBy = ko.observableArray(); // used in options
    self.DisplayNum = ko.observable(5);
    self.AddedBy = ko.observable();
    self.StartDate = ko.observable();
    self.EndDate = ko.observable();
    self.InteractionTable = ko.observable();
    self.InteractionDialog = ko.observable();

    // Get Interaction Notes
    $.ajax({
        url: 'api/htaccount/GetInteractions?id=' + accountNum,
        success: function (data) {
            self.Notes(data || '');
            self.SetupView();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.responseJSON.MessageDetail || errorThrown)
        }
    });
    
    // Setup datatable and dialog
    self.SetupView = function () {
        self.InteractionTable = $('#tbl_Interactions').dataTable({
            "dom": 'ti',
            "order": [[0, "desc"]],
            "language": { "zeroRecords": "No Interaction Notes Found" },
            "aoColumnDefs": [{ "targets": 0, "sType": "date" }],
            "aLengthMenu": [[5, 10, 20, 50, 100, -1], [5, 10, 20, 50, 100, 'All']],
            "iDisplayLength": 5
        });

        // Populate select option (added by) in filter options dialog
        self.AvailableAddedBy(unique(self.InteractionTable.DataTable().columns(1).data()[0]).sort());

        self.InteractionDialog = $('#interac_dialog').dialog({
            autoOpen: false,
            height: 250, width: 320,
            modal: true, resizable: false,
            dialogClass: 'interacDialog',
            position: ['center', 'middle'],
            buttons: [{
                text: "OK", default: true, "style": "width:80px;",
                click: function () { self.Filter(); $(this).dialog("close"); }
            }, {
                text: "Cancel",
                click: function () { $(this).dialog("close"); }
            }],
            css: { background: '#000'}
        });
    }

    //////////////////////// Events ////////////////////////
    // Show all Interaction Notes
    self.ShowAll = function () {
        self.ResetAllFilter();
        self.DisplayNum(-1);
        self.AddedBy('');
        self.InteractionTable.fnSettings()._iDisplayLength = -1;    // -1 -> All records
        self.InteractionTable.fnDraw();
    }

    // Show filter options
    self.ShowFilter = function () {
        self.InteractionDialog.dialog("open");
    }

    // Filter result in table
    self.Filter = function () {
        var preSearch = self.InteractionTable.fnSettings();
        preSearch.aoPreSearchCols[1].sSearch = self.AddedBy() ? ("^\\s*" + self.AddedBy() + "\\s*$") : '';
        preSearch.aoPreSearchCols[1].bRegex = true;
        preSearch._iDisplayLength = parseInt(self.DisplayNum());
        self.InteractionTable.fnDraw();
    }

    // Reset all filters
    self.ResetAllFilter = function () {
        self.InteractionTable.fnSettings().aoPreSearchCols[1].sSearch = ''; // AddedBy column
        self.StartDate(''); self.EndDate('');
    }
}

    var ViewModel = function (accountNum) {

        var self = this;

        // SubModel for Billing
        // This will also trigger the ajax call to billing overview/details
        // and setup the datatable for details
        self.Billing = new BillingSubModel(accountNum);

        // Submodel for Interaction Notes
        self.Interactions = new InteractionsSubModel(accountNum);

        // Observables for Overview and Details
        self.AllCasesOverview = ko.observableArray();
        self.AllOrdersOverview = ko.observableArray();
        self.AllRepairTickets = ko.observableArray();
        self.AllCCTTickets = ko.observableArray();
        self.RegOrders = ko.observableArray();
        self.EPapers = ko.observableArray();
        self.RegOrderDueDate = ko.observableArray();
        self.TickerInfos = ko.observableArray();

        var dtAllTickets;
        var dtOrders;
        var dtCCT;
        var ePaper;

        //Mark: Perm
        //Mark: Perm
        //Mark: Perm
        //Mark: Perm
        //Mark: Perm
        self.Perm = ko.observable();        
        self.PermFilter = ko.observable();
        self.UserContainer = ko.observableArray();
        self.User = ko.observable();
        self.CurrPage = ko.observable(5);
        self.CurrPageOptions = ko.observableArray([5, 10, 20, 50, 100, 'All']);
        self.PermStartDate = ko.observable();
        self.PermEndDate = ko.observable();
        self.PermContainer = ko.observableArray();

        self.textArea = ko.observable();

        self.HasOpenInfo = ko.computed(function () {
            var ret = false;
            ret = self.TickerInfos().some(function (element, index, array) {
                if (element.Status() == 0) {
                    return true;
                }
                return false;
            });
            return ret;
        });

        
        self.ShowDetailed = function (data) {
            self.textArea(data);
        };
        self.InitPerm = function () {
            self.PermFilter = $('#perm_dialog').dialog({
                autoOpen: false,
                
                modal: true, resizable: false,
                dialogClass: 'permDialog',
                position: ['center', 'middle'],
                buttons: [{
                    text: "OK", default: true, "style": "width:80px;",
                    click: function () { self.FilterCustomFilter(); $(this).dialog("close"); }
                }, {
                    text: "Cancel",
                    click: function () { $(this).dialog("close"); }
                }],
                css: { background: '#000' }
            });       

            self.Perm = $('#permNoteTable').dataTable({
                "dom": 'ti',
                "order": [[0, "desc"]],
                "language": { "zeroRecords": "No Perm Notes Found" },
                "aoColumnDefs": [{ "targets": 0, "sType": "date" }],
                "aLengthMenu": [[3, -1], [3, -1]],
                "iDisplayLength": 5
            });

            self.UserContainer(unique(self.Perm.DataTable().columns(1).data()[0]).sort());
        };
        self.PermFilterShow = function () {
            self.PermFilter.dialog("open");         
        };
        self.PermShowAll = function () {
            self.Reset();
            self.User();
            self.CurrPage(-1);
            self.Perm.fnSettings()._iDisplayLength = -1;
            self.Perm.fnDraw();
        };

        self.FilterCustomFilter = function () {
            var preSearch = self.Perm.fnSettings();
            preSearch.aoPreSearchCols[1].sSearch = self.User() ? ("^\\s*" + self.User() + "\\s*$") : '';
            preSearch.aoPreSearchCols[1].bRegex = true;
            preSearch._iDisplayLength = parseInt(self.CurrPage() == 'All' ? -1 : self.CurrPage());
            self.Perm.fnDraw();
        };

        self.Reset = function () {
            self.Perm.fnSettings().aoPreSearchCols[1].sSearch = ''; // AddedBy column
            self.PermStartDate(''); self.PermEndDate('');
        }
        //Mark: Perm
        //Mark: Perm
        //Mark: Perm
        //Mark: Perm
        //Mark: Perm

        //Josef: PIC info link on products and services
        self.pics = ko.observableArray();
        self.selectedPicsIndex = ko.observableArray();

        //Filtering
        self.currentFilter = ko.observable();
        self.Category = ko.observable();

        self.OptionRepair = ko.observable('0');
        self.OptionCRM = ko.observable('0');
        self.OptionEPaper = ko.observable('0');
        self.OptionCCT = ko.observable('0');


        self.formatDate = function (_date) {
            var d = new Date(_date);
            var hr = d.getHours();
            var min = d.getMinutes();
            var yr = d.getFullYear();
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            var formattedDate = mon + '/' + day + '/' + yr + ' ' + hr + ':' + min;

            return formattedDate;
        }


        self.Modal = function (category) {
            self.Category(category);

            // Initialize datepicker
            $('.datepicker').each(function () {
                $(this).datepicker({
                    maxDate: '+0d'
                });
            });

            filter = self.Category();
            $("#filter-dialog").dialog("open");
        };
        self.InitElements = function () {
            $("#filter-dialog").dialog({
                width: "24.5em",
                position: [ "center", "middle"],
                draggable: true,
                drag: function(event, ui) {
                    var fixPix = $(document).scrollTop();
                    iObj = ui.position;
                    iObj.top = iObj.top - fixPix;
                    $(".ui-dialog").css("top", iObj.top + "px");
                },
                autoOpen: false,
                dialogClass: 'order_caseDialog',
                modal: true,
                resizable: false,
                buttons: {
                    OK: {
                        text: "OK",
                        id: "filter-ok",
                        click: function () {
                            vm.Filter();
                            $(this).dialog("close");
                        }
                    },
                    Cancel: {
                        text: "Cancel",
                        id: "filter-cancel",
                        
                        click: function () {
                            $(this).dialog({ position: ["center", "middle"]});
                            $(this).dialog("close");
                        }
                    }
                },
                open: function (event, ui) {
                    $(this).parent().siblings(".ui-widget-overlay").css({
                        "background": "black", "z-index": "19999" // Modified by Dj 10/13/2014. So it would not interfere with tooltips
                    });

                    $(this).parent('.ui-dialog').css({
                        "font-weight": "normal",
                        "font-size": "100%",
                        "font-family": "Segoe UI, Arial, Tahoma",
                        "z-index": "20000",
                      
                       // Modified by Dj 10/13/2014. So it would not interfere with tooltips
                    });

                    $(this).siblings(".ui-widget-content").css({
                        "border": "0",
                        "padding": "0"
                    });

                    $(this).siblings().find(".ui-dialog-buttonset").css({
                        "width": "100%",
                        "padding-bottom": "0.5em"
                    });

                    $(this).siblings(".ui-dialog-buttonpane").find("button.ui-button").css({
                        "background": "#00A9E0",
                        "color": "white",
                        "width": "80px",
                        "height": "22px",
                        "border-radius": "0px",
                        "margin": "0px"
                    });

                    $(this).siblings(".ui-dialog-buttonpane").find(".ui-button-text").css({
                        "font-size": "84%",
                        "padding": "0px"
                    });

                    $(this).find('.datepicker').css({
                        "font-size": "90%",
                        "width": "7em"
                    });

                    $(this).siblings().find('#filter-ok').css({
                        "float": "left",
                        "margin-left": "15%"
                    });

                    $(this).siblings().find('#filter-cancel').css({
                        "float": "right",
                        "margin-right": "15%"
                    });


                    /* Title & Options */
                    //$(".ui-dialog-titlebar").html(filter); // Modified by DJ 10/23/2014
                    $('#filter-dialog').dialog('option', 'title', filter)
                }

            });

            // Initialize datepicker
            $('.datepicker').each(function () {
                $(this).datepicker({
                    maxDate: '+0d'
                });
            });

            // Stop click progpagation of dataTable
            $('.dataTable tr').on('click', 'th', function (event) {
                event.stopPropagation();
                return false;
            });

            $("#filter-dialog").on("dialogopen", function (event, ui) {
                $("input[name='filter']").click(function () {
                    if ($('#option-5').is(':checked')) {
                        $('#option-5').siblings('.dates').removeAttr("disabled");
                    } else {
                        $('#option-5').siblings('.dates').attr("disabled", "disabled");
                    }
                });
            });
        }

        self.TicketLabels = ko.observableArray(["Open Tickets (3)", "Open Tickets (All)", "Closed Tickets", "All Tickets"]);
        self.OrderLabels = ko.observableArray(["Pending Orders (3)", "Pending Orders (All)", "Completed/Cancelled", "All Orders"]);

    self.Options = ko.computed(function () {
            if (self.Category() == "Repair Tickets" || self.Category() == "CCT Tickets") {
                return self.TicketLabels();
            } else {
                return self.OrderLabels();
            }
             
        }) 

        self.Filter = function () {
            if (self.Category() == "Repair Tickets") {
                self.FilterTickets();
            } else if (self.Category() == "CRM Orders") {
                self.FilterOrders();
            } else if (self.Category() == "ePaper") {
                self.FilterePapers();
            } else if (self.Category() == "CCT Tickets") {
                self.FilterCCT();
            }
        }

        // Variables used in date filtering
        var minim = '';
        var maxim = '';

        // Events
        self.InitializeKO = function (data) {

            self.RegOrders(data.regorders);
            self.EPapers(data.epapers);
            self.RegOrderDueDate(data.regorderduedates);
            // Not needed as of this time 10-01-2014
            // -------------------------------------
            //self.RegOrderNotes(data.regordernotes);
            //self.RegOrderDueDates(data.regorderduedates);
            //self.EPaperNotes(data.epapernotes);

            // Separate records to respective observables
            for (var i = 0; i < data.allcases.length; i++) {

                // Assign commit date to revise commit date to use only revise commit date
                // if revise commit date is blank, assign value from commit date
                data.allcases[i].Rev_Commit_Date = data.allcases[i].Rev_Commit_Date.trim() || data.allcases[i].Commit_Date;
                data.allcases[i].Rev_Commit_Date_Time = data.allcases[i].Rev_Commit_Date_Time.trim() || data.allcases[i].Commit_Date_Time;

                if (data.allcases[i].Case_Type == 'HTCCT') {
                    self.AllCCTTickets.push(data.allcases[i]);
                } else {
                    if (data.allcases[i].Case_Type == 'HTECR') {
                        self.AllRepairTickets.push(data.allcases[i]);
                    }
                    // Exclude Closed and Cancelled accounts
                    if (!(data.allcases[i].Case_Status_ID == 'CANCL' ||
                        data.allcases[i].Case_Status_ID == 'CLRES' ||
                        data.allcases[i].Case_Status_ID == 'CLURS')) {
                        self.AllCasesOverview.push(data.allcases[i]);
                    }
                }
            }

            // Merge RegOrders and EPapers for Overview
            var mappedOrders = $.map(data.regorders, function (item) {
                // Get only pending records              
                var duedate = self.dueDate(item.Order_ID);
                item["duedate2"] = duedate;
                if (!(item.Order_Status_ID == '1' ||
                    item.Order_Status_ID == '6000' ||
                    item.Order_Status_ID == '5000'))
                    return new Orders(item);
            });
            self.AllOrdersOverview(mappedOrders);
            mappedOrders = $.map(data.epapers, function (item) {
                // Get only pending records
                if (!(item.EPaper_Status_ID == '1' ||
                    item.EPaper_Status_ID == '6000' ||
                    item.EPaper_Status_ID == '5000'))
                    return new Orders(item);
            });
            self.AllOrdersOverview(self.AllOrdersOverview().concat(mappedOrders));

            // Setup DataTable
            $('#cases_tbl').dataTable({
                "dom": 't',
                "order": [[0, "desc"]],
                "oLanguage": {
                    "sEmptyTable": "No Pending Repair Tickets"
                },
                "aLengthMenu": [[3], [3]],
                "iDisplayLength": 3
            });

            $('#orders_tbl').dataTable({
                "dom": 't',
                "order": [[0, "desc"]],
                "oLanguage": {
                    "sEmptyTable": "No Pending Orders"
                },
                "aLengthMenu": [[3], [3]],
                "iDisplayLength": 3,
                "drawCallback": function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var last = null;                   
                    api.column(1, { page: 'current' }).data().each(function (group, i) {
                        if (last !== group) {                    
                            var totalTask = 0;
                            Q.when(
                          
                               $.ajax({
                                   url: 'api/htaccount/GetOrderProgress?orderid=' + group
                               })

                            ).then(function (res) {

                               
                                //var result = [{
                                //    "Order_Num": "2334558", "Order_No_Line": "CD882148", "Service_Type": "ACCOUNT", "Service_Action": "CHANGE", "Order_CRT_Date": "10/7/2009 12:00:00 AM", "Order_Due_Date": "2009-10-07", "Job_ID": "020000170000046349B5000100004080",
                                //    "Status": "complete",
                                //    "WF_XMLDOC": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<workflow name=\"RecordsOnly/AccountsOnly\" id=\"020000170000046349B5000100004080\" status=\"Done\">\n    <rootTask xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" id=\"02000017000004634A03000200004080\">\n        <task name=\"Provisioning\" role=\"wf\" id=\"02000017000004634A0E000200004080\" status=\"Done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n            <message text=\"Account Only\"/>\n            <errorRole role=\"\"/>\n            <task name=\"HoldForDueDateAccount\" role=\"wf\" id=\"02000017000004634A0F000200004080\" status=\"Done\">\n                <dueDate dueDateDelta=\"0\" dueTime=\"20:00:00\"/>\n                <message text=\"Holding For Due Date\"/>\n                <milestone>\n                    <action orderType=\"OCHG\" workflow=\"RecordsOnly/AccountsOnly\"/>\n                    <action orderType=\"OCNL\" workflow=\"RecordsOnly/AccountsOnly\"/>\n                    <action orderType=\"OHLD\" workflow=\"RecordsOnly/AccountsOnly\"/>\n                </milestone>\n            </task>\n        </task>\n        <task name=\"RetailBilling\" role=\"wf\" id=\"02000017000004634A05000200004080\" status=\"Done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n            <include rule=\"Narrowband/SetupRetailBilling\"/>\n            <message text=\"Retail Billing\"/>\n            <errorRole role=\"\"/>\n            <task name=\"PerformRetailBillingServiceDetails\" role=\"bill\" type=\"auto\" id=\"02000017000004634A06000200004080\" status=\"Done\">\n                <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n                <message text=\"Perform Retail Billing Service Details\"/>\n                <errorRole role=\"CRM\"/>\n                <lineStatus include=\"true\"/>\n            </task>\n            <task name=\"UpdateRetailBillingFeatures\" role=\"bill\" type=\"auto\" id=\"02000017000004634A07000200004080\" status=\"Done\">\n                <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n                <message text=\"Update Retail Billing Features\"/>\n                <errorRole role=\"CRM\"/>\n                <lineStatus include=\"true\"/>\n            </task>\n        </task>\n        <task name=\"OrderComplete\" role=\"wf\" id=\"02000017000004634A0D000200004080\" status=\"Done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"19:00:00\"/>\n            <message text=\"Order\"/>\n            <errorRole role=\"\"/>\n        </task>\n    </rootTask>\n</workflow>"
                                //}, {
                                //    "Order_Num": "2334559", "Order_No_Line": "CD882140", "Service_Type": "POTS", "Service_Action": "CHANGE", "Order_CRT_Date": "10/7/2009 12:00:00 AM", "Order_Due_Date": "2009-10-07", "Job_ID": "0200001700000463445B000100004081",
                                //    "Status": "complete",
                                //    "WF_XMLDOC": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<workflow name=\"Narrowband/ProvisionBVT\" id=\"0200001700000463445B000100004081\" status=\"Done\">\n    <rootTask xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" id=\"020000170000046344A9000200004081\">\n        <task name=\"NetworkProvisioning\" role=\"wf\" id=\"020000170000046344AB000200004081\" status=\"done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n            <message text=\"Network Provisioning\"/>\n            <errorRole role=\"\"/>\n            <task name=\"BVT\" role=\"wf\" id=\"020000170000046344AD000200004081\" status=\"Done\">\n                <dueDate dueDateDelta=\"0\" dueTime=\"00:00:00\"/>\n                <message text=\"Network BVT\"/>\n                <errorRole role=\"\"/>\n                <task name=\"HoldForDueDateBvt\" role=\"wf\" id=\"020000170000046344AE000200004081\" status=\"Done\">\n                    <dueDate dueDateDelta=\"0\" dueTime=\"04:15:00\"/>\n                    <message text=\"Holding For Due Date\"/>\n                </task>\n                <task name=\"PerformBVT\" role=\"netnb\" type=\"auto\" id=\"020000170000046344AF000200004081\" status=\"Done\">\n                    <dueDate dueDateDelta=\"0\" dueTime=\"17:00:00\"/>\n                    <message text=\"Perform BVT Provisioning\"/>\n                    <errorRole role=\"NEAT_SL\"/>\n                    <lineStatus include=\"true\"/>\n                </task>\n            </task>\n            <task name=\"ProvisioningComplete\" role=\"wf\" id=\"020000170000046344AC000200004081\" status=\"Done\">\n                <dueDate dueDateDelta=\"1\" dueTime=\"04:00:00\"/>\n                <message text=\"Provisioning Complete\"/>\n                <errorRole role=\"\"/>\n            </task>\n        </task>\n        <task name=\"RetailBilling\" role=\"wf\" id=\"020000170000046344B2000200004081\" status=\"Done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n            <include rule=\"Narrowband/SetupRetailBilling\"/>\n            <message text=\"Retail Billing\"/>\n            <errorRole role=\"\"/>\n            <task name=\"PerformBillingSuspend\" role=\"bill\" type=\"auto\" id=\"020000170000046344B3000200004081\" status=\"Done\">\n                <dueDate dueDateDelta=\"0\" dueTime=\"18:00:00\"/>\n                <include rule=\"Narrowband/SetupBillingSuspend\"/>\n                <message text=\"Perform Retail Billing Suspend\"/>\n                <errorRole role=\"CRM\"/>\n                <lineStatus include=\"true\"/>\n            </task>\n        </task>\n        <task name=\"OrderComplete\" role=\"wf\" id=\"020000170000046344B5000200004081\" status=\"Done\">\n            <dueDate dueDateDelta=\"0\" dueTime=\"19:00:00\"/>\n            <message text=\"Order\"/>\n            <errorRole role=\"\"/>\n        </task>\n    </rootTask>\n</workflow>"
                                //}];


                                var discrep = false;
                                var suspend = false;
                                var hold = false;
                                var complete = false;


                                if (res.length > 0) {

                                    var data = res;
                                    var doneNum = 0;
                                    var numOfHoldStatus = 0;
                                    var childTasksNum = 0;
                                    var objik = 0;
                                    var ariy = 0;
                                    var excludedTasks = ['ORDERCOMPLETE', 'HOLDCOMPLETE', 'CANCELCOMPLETE'];


                                    Q.when(

                                        $.each(res, function () {
                                            
                                            var self = this;
                                            var status = self.Status.trim().toUpperCase();                                      
                                            if (status === 'DISCREP') {
                                                discrep = true;
                                                return false;
                                            } else if (status === 'SUSPENDED') {
                                                suspend = true;
                                                return false;
                                            } else if (status === 'HOLD COMPLETE') {
                                                numOfHoldStatus++;
                                            }

                                            else {
                                                
                                                var $tasksXml = $.parseXML(self.WF_XMLDOC);
                                                var $allTasks = $($tasksXml).find("task");
                                                //console.log($tasksXml);
                                                $.each($allTasks, function () {
                                                    var childTasks = $(this).find("task");
                                                    var taskName = $(this).attr("name");
                                                    var taskStatus = $(this).attr("status");
                                                    //check if task is a child task and is not excluded in counting and status != routed
                                                    if (childTasks.length == 0 && excludedTasks.indexOf(taskName.toUpperCase()) == -1 && taskStatus.toUpperCase() != 'ROUTED') {
                                                        //thisTask.status.toUpperCase().trim();
                                                        if (taskStatus.toUpperCase() === 'DONE') {
                                                            doneNum++;
                                                        }
                                                        childTasksNum++;
                                                    }
                                                   
                                                })

                                            }
                                            
                                        })
   

                                    ).then(function () {

                                        //var floor_percentageComplete = Math.floor(percentageComplete);
                                        //$(rows).eq(i).after('<tr class="group"><td colspan="6"><span class="progress-value" style="width:100px;">60%</span><div style="width:95%;float:right;"><progress style="width:100%;background-color:white;" max="100" value="60" style><div class="progress-bar"><span style="width: 60%;">Progress</span></div></progress></div></td></tr>');

                                        var percentageComplete = (doneNum / childTasksNum) * 100;
                                        if (suspend) {
                                            $(rows).eq(i).after('<tr class="group" style="height: 3em;vertical-align: top;"><td colspan="6"><span class="msg" style="color:red">Order is suspended; Please open the order to check further.</span></td></tr>');
                                        } else if (discrep) {
                                            $(rows).eq(i).after('<tr class="group" style="height: 3em;vertical-align: top;"><td colspan="6"><span class="msg" style="color:red">Order is discreped; Please open the order to check further.</span></td></tr>');
                                        }
                                        else if (res.length == numOfHoldStatus) {
                                            $(rows).eq(i).after('<tr class="group" style="height: 3em;vertical-align: top;"><td colspan="6"><span style="color:red;z-index:10000;position:absolute;margin-top:-7px;font-size:1.05em;font-weight:bold;">Order is On Hold</span></td></tr>');
                                        }
                                        else {
                                            var floor_percentageComplete = Math.floor(percentageComplete);
                                            $(rows).eq(i).after('<tr class="group"><td colspan="6"><span class="progress-value" style="width:100px;">' + floor_percentageComplete + '%</span><div style="width:95%;float:right;"><progress style="width:100%;background-color:white;" max="100" value="' + floor_percentageComplete + '" style><div class="progress-bar"><span style="width: ' + floor_percentageComplete + '%;">Progress</span></div></progress></div></td></tr>');
                                        }
                                        last = group;
                                        
                                    })
                                }                   
                                else {
                                    $(rows).eq(i).after('<tr class="group" style="height: 3em;vertical-align: top;"><td colspan="6" ><span class="msg" style="color:red">Order not in TIBCO</span></td></tr>');
                                }
                               
                            });
                        }
                    });
                }
            });


            dtAllTickets = $('#RepairTickets').dataTable({
                "dom": 't',
                "order": [[10, "desc"]],
                "aLengthMenu": [[3, -1], [3, -1]],
                "iDisplayLength": 3,
                "columnDefs": [{
                "targets": [0, 1],
                    "visible": false
                }],
                "bRegex": true,
                "bSmart": true,
                "bFilter": true,
                //Show message if no Results after filtering Aris
                "language": {
                    "zeroRecords": "No Repair Tickets Found"
                },               
            });
            // Default Filter for Pending 3
            self.OptionRepair('0');
            self.FilterTickets();
            if (dtAllTickets.fnSettings().fnRecordsDisplay() == 0) {
                self.OptionRepair('2');
                self.FilterTickets(true);
            }

            $.fn.dataTable.ext.search.push(
                function (settings, data, dataIndex) {
                    if (settings.sTableId == 'RepairTickets' ||
                        settings.sTableId == 'detailedOrders' ||
                        settings.sTableId == 'ePapers' ||
                        settings.sTableId == 'cct') {               // Modified by Dj 11/4/2014. 
                        var min = new Date(minim).getTime();
                        var max = new Date(maxim + ' 23:59:59').getTime();
                        var dt = new Date(data[1]).getTime();

                        if (min && !isNaN(min)) {
                            if (dt < min || !dt) return false;
                        }

                        if (max && !isNaN(max)) {
                            if (dt > max || !dt) return false;
                        }

                        return true;
                    } else {
                        return true; // So other datatables will not be filtered
                    }
                }
            );
           
            dtOrders = $('#detailedOrders').dataTable({
                "dom": 't',
                "order": [[6, "desc"]],
                "aLengthMenu": [[3, -1], [3, -1]],
                "iDisplayLength": 3,
                "drawCallback": function (settings) {
                    // hide all tooltips
                    $('.qtip:visible', $('#detailedOrders').parent()).qtip("hide");

                    $('#detailedOrders tbody tr').each(function () {
                        // Get the td cell for order details table row
                        var cell = $('td:eq(7)', this);
                        // Check if the row's order details is not yet loaded
                        if (cell.length && !cell.is('.loaded')) {
                            // modify cell immediately to be loaded to prevent from reloading
                            cell.addClass('loaded');
                            cell.html('Loading...');

                            // contact server for order details
                            $.ajax({
                                url: "/api/htaccount/GetOrderProgress?orderid=" + $('td:eq(0)', this).text(),
                                global: false,
                                success: function (data) {
                                    self.LoadDiagram(cell, data);
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    alert(xhr.responseJSON.MessageDetail || errorThrown)
                                }
                            });
                        }
                    });
                },
                "aoColumnDefs": [{
                        "targets": [0, 1],
                        "visible": false
                    }, {
                        "targets": [9],
                        "bSortable": false
                    }],
                "bRegex": true,
                "bSmart": true,
                "bFilter": true,
                //Show message if no Results after filtering Aris
                "language": {
                    "zeroRecords": "No Orders Found"
                },
            });
            
            // Default Filter for Pending 3
            self.OptionCRM('0');
            self.FilterOrders();
            if (dtOrders.fnSettings().fnRecordsDisplay() == 0) {
                self.OptionCRM('2');
                self.FilterOrders(true);
            }

            ePaper = $('#ePapers').dataTable({
                "dom": 't',
                "order": [[6, "desc"]],
                "aLengthMenu": [[3, -1], [3, -1]],
                "iDisplayLength": 3,
                "drawCallback": function (settings) {
                    // hide all tooltips
                    $('.qtip:visible', $('#ePapers').parent()).qtip("hide");

                    $('#ePapers tbody tr').each(function () {
                        // Get the td cell for order details table row
                        var cell = $('td:eq(7)', this);

                        // Check if the row's order details is not yet loaded
                        if (cell.length && !cell.is('.loaded')) {
                            // modify cell immediately to be loaded to prevent from reloading
                            cell.addClass('loaded');
                            cell.html('Loading...');

                            // contact server for order details
                            $.ajax({
                                url: "/api/htaccount/GetOrderProgress?orderid=" + $('td:eq(0)', this).text(),
                                global: false,
                                success: function (data) {
                                    self.LoadDiagram(cell, data);
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    alert(xhr.responseJSON.MessageDetail || errorThrown)
                                }
                            });
                        }
                    });
                },
                "columnDefs": [{
                        "targets": [0, 1],
                        "visible": false
                    }, {
                        "targets" : [9],
                        "bSortable": false
                    }],
                //Show message if no Results after filtering Aris
                "language": {
                    "zeroRecords": "No Orders Found"
                },
            });
            self.OptionEPaper('0');
            self.FilterePapers();
            if (ePaper.fnSettings().fnRecordsDisplay() == 0) {
                self.OptionEPaper('2');
                self.FilterePapers(true);
            }

            dtCCT = $('#cct').dataTable({
                "dom": 't',
                "order": [[10, "desc"]],
                "aLengthMenu": [[3, -1], [3, -1]],
                "iDisplayLength": 3,
                "columnDefs": [{
                    "targets": [0, 1],
                    "visible": false
                }],
                //Show message if no Results after filtering Aris
                "language": {
                    "zeroRecords": "No Tickets Found"
                },
            });

            self.OptionCCT('0');
            self.FilterCCT();
            if (dtCCT.fnSettings().fnRecordsDisplay() == 0) {
                self.OptionCCT('2');
                self.FilterCCT(true);
            }

            self.InitElements();
        };

        self.FilterTickets = function (show3) {
            // Reset all filters
            $('#RepairTickets').DataTable().columns(0).search(''); // Status
            $('#RepairTickets').DataTable().columns(1).search(''); // Commitment Date
            minim = '';
            maxim = '';

            if (self.OptionRepair() == '0') {
                //$('#RepairTickets').DataTable().columns(0).search('Pending Dispatch');
                $('#RepairTickets').dataTable().fnFilter('^((?!(CLRES|CLURS)).)*$', 0, true, false);
                self.showRepair(true);
                dtAllTickets.fnSettings()._iDisplayLength = 3;
                dtAllTickets.fnDraw();
            } else if (self.OptionRepair() == '1') {
                self.showRepair(false);
                $('#RepairTickets').dataTable().fnFilter('^((?!(CLRES|CLURS)).)*$', 0, true, false);
                dtAllTickets.fnSettings()._iDisplayLength = -1;
                dtAllTickets.fnDraw();
            } else if (self.OptionRepair() == '2') {
                self.showRepair(false);
                $('#RepairTickets').dataTable().fnFilter('(CLRES|CLURS)', 0, true, false);
            dtAllTickets.fnSettings()._iDisplayLength = show3 ? 3 : -1;
                dtAllTickets.fnDraw();
            } else if (self.OptionRepair() == '3') {
                self.showRepair(false);
                self.ShowAllTickets();
            } else { // Date Range
                self.showRepair(false);
                minim = $('#dtFromRepair').val()
                maxim = $('#dtToRepair').val();
                dtAllTickets.fnSettings()._iDisplayLength = -1;
                dtAllTickets.fnDraw();
            }
        };

        self.FilterePapers = function (show3) {
            $('#ePapers').DataTable().columns(0).search(''); 
            $('#ePapers').DataTable().columns(1).search(''); 
            minim = '';
            maxim = '';
            if (self.OptionEPaper() == '0') {
                self.showEPaper(true);
                $('#ePapers').dataTable().fnFilter('^((?!(6000|1|5000)).)*$', 0, true, false);
                ePaper.fnSettings()._iDisplayLength = 3;
                ePaper.fnDraw();
            } else if (self.OptionEPaper() == '1') {
                self.showEPaper(false);
                $('#ePapers').dataTable().fnFilter('^((?!(6000|1|5000)).)*$', 0, true, false);
                ePaper.fnSettings()._iDisplayLength = -1;
                ePaper.fnDraw();
            } else if (self.OptionEPaper() == '2') {
                self.showEPaper(false);
                $('#ePapers').dataTable().fnFilter('(6000|1)', 0, true, false);
                ePaper.fnSettings()._iDisplayLength = show3 ? 3 : -1;
                ePaper.fnDraw();
            } else if (self.OptionEPaper() == '3') {
                self.showEPaper(false);
                self.ShowAllePapers();
            } else { // Date Range
                self.showEPaper(false);
                minim = $('#dtFromEPaper').val()
                maxim = $('#dtToEPaper').val();
                ePaper.fnSettings()._iDisplayLength = -1;
                ePaper.fnDraw();
            }
        }

        self.FilterOrders = function (show3) {
            $('#detailedOrders').DataTable().columns(0).search(''); // Status
            $('#detailedOrders').DataTable().columns(1).search(''); // Commitment Date
            minim = '';
            maxim = '';
            if (self.OptionCRM() == '0') {
                self.showCRM(true);
                $('#detailedOrders').dataTable().fnFilter('^((?!(6000|1|5000)).)*$', 0, true, false);
                dtOrders.fnSettings()._iDisplayLength = 3;
                dtOrders.fnDraw();
            } else if (self.OptionCRM() == '1') {
                self.showCRM(false);
                $('#detailedOrders').dataTable().fnFilter('^((?!(6000|1|5000)).)*$', 0, true, false);
                dtOrders.fnSettings()._iDisplayLength = -1;
                dtOrders.fnDraw();
            } else if (self.OptionCRM() == '2') {
                $('#detailedOrders').dataTable().fnFilter('(6000|1)', 0, true, false);
                dtOrders.fnSettings()._iDisplayLength = show3 ? 3 : -1;
                dtOrders.fnDraw();
                self.showCRM(false);
            } else if (self.OptionCRM() == '3') {
                self.showCRM(false);
                self.ShowAllOrders();
            } else { 
                self.showCRM(false);
                minim = $('#dtFromCRM').val()
                maxim = $('#dtToCRM').val();
                dtOrders.fnSettings()._iDisplayLength = -1;
                dtOrders.fnDraw();
            }
        };

        self.FilterCCT = function (show3) {
            $('#cct').DataTable().columns(0).search(''); // Status
            $('#cct').DataTable().columns(1).search(''); // Commitment Date

            if (self.OptionCCT() == '0') {
                self.showCCT(true);
                $('#cct').dataTable().fnFilter('(NEW|PEND)', 0, true, false);
                dtCCT.fnSettings()._iDisplayLength = 3;
                dtCCT.fnDraw();
            } else if (self.OptionCCT() == '1') {
                self.showCCT(false);
                $('#cct').dataTable().fnFilter('(NEW|PEND)', 0, true, false);
                dtCCT.fnSettings()._iDisplayLength = -1;
                dtCCT.fnDraw();
            } else if (self.OptionCCT() == '2') {
                self.showCCT(false);
                $('#cct').dataTable().fnFilter('^((?!(NEW|PEND)).)*$', 0, true, false);
                dtCCT.fnSettings()._iDisplayLength = show3 ? 3 : -1;
                dtCCT.fnDraw();
            } else if (self.OptionCCT() == '3') {
                self.showCCT(false);
                self.ShowAllCCT();
            } else { // Date Range
                self.showCCT(false);
                minim = $('#dtFromCCT').val()
                maxim = $('#dtToCCT').val();
                dtCCT.fnSettings()._iDisplayLength = -1;
                dtCCT.fnDraw();
            }
        };

        self.ResetAllFilter = function (tblData) {
            
        };

        self.ShowAllTickets = function () {
            // Reset all filters
            $('#RepairTickets').DataTable().columns(0).search(''); // Status
            $('#RepairTickets').DataTable().columns(1).search(''); // Commitment Date
            self.showRepair(false);
            minim = '';
            maxim = '';

            dtAllTickets.fnSettings()._iDisplayLength = -1;
            dtAllTickets.fnDraw();
        };

        self.ShowAllOrders = function () {
            // Reset all filters
            self.showCRM(false);
            $('#detailedOrders').DataTable().columns(0).search('');
            $('#detailedOrders').DataTable().columns(1).search('');
            minim = '';
            maxim = '';
            dtOrders.fnSettings()._iDisplayLength = -1;
            dtOrders.fnDraw();
        };
      
      ;
        self.strtWork = function (input) {
            var start = input;
            self.work = ko.observableArray();
            if (self.RegOrderDueDate().length != 0) {
                var len = self.RegOrderDueDate().length;
                for (var a = 0; a < len ; a++) {
                    if (self.RegOrderDueDate()[a].Capture_ID == start) {
                        if (self.RegOrderDueDate()[a].Start_Work_By_Date.trim() != "") {
                            self.work.push(new Date(self.RegOrderDueDate()[a].Start_Work_By_Date));
                        }
                    }
                }
            }
            var minDate = new Date(Math.min.apply(null, ko.toJS(self.work)));
            return moment(minDate).format('YYYY/MM/DD') == "Invalid date" ? "" : moment(minDate).format('MM/DD/YYYY');
        };

        self.dueDate = function (input) {
            var start = input;
            self.duedate = ko.observableArray();
            if (self.RegOrderDueDate().length != 0) {
                var len = self.RegOrderDueDate().length;
                for (var a = 0; a < len ; a++) {
                    if (self.RegOrderDueDate()[a].Capture_ID == start) {
                        if (self.RegOrderDueDate()[a].Due_Date.trim() != "") {
                            self.duedate.push(new Date(self.RegOrderDueDate()[a].Due_Date));
                        }
                    }
                }
            }
            var minDate = new Date(Math.min.apply(null, ko.toJS(self.duedate)));
            return moment(minDate).format('YYYY/MM/DD') == "Invalid date" ? "" : moment(minDate).format('MM/DD/YYYY');
        };

        self.ShowAllCCT = function () {
            self.showCCT(false);
            $('#cct').DataTable().columns(0).search('');
            $('#cct').DataTable().columns(1).search(''); 
            minim = '';
            maxim = '';
            dtCCT.fnSettings()._iDisplayLength = -1;
            dtCCT.fnDraw();
        };

        self.ShowAllePapers = function () {
            self.showEPaper(false);
            $('#ePapers').DataTable().columns(0).search('');
            $('#ePapers').DataTable().columns(1).search('');
            minim = '';
            maxim = '';
            ePaper.fnSettings()._iDisplayLength = -1;
            ePaper.fnDraw();
        };

        //Josef: PIC info link on products and services
        self.GetPic = function (accountNo, tnAndIndex) {

            var tnAndIndex_arr = tnAndIndex.split(",");
            var tn = tnAndIndex_arr[0];
            var index = tnAndIndex_arr[1];
            var pic;


            $.ajax({
                url: 'api/htaccount/GetPic?id=' + accountNo + '&tn=' + tn + '&index=' + index,
                success: function (kenanData) {
                   
                    var index_int = parseInt(index); // must be the same as the server-side datatype

                    if (self.selectedPicsIndex.indexOf(index_int) < 0) {
                        self.selectedPicsIndex.push(index_int);

                    self.pics.push(kenanData);

                    self.pics.sort(function (l, r) {
                        return l.index == r.index ? 0 : (l.index < r.index ? -1 : 1);
                    });
                    }


                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(JSON.parse(xhr.responseText).responseText)
                }
            });

            //alert("veiwmodel GetPic");
        };

        //To show or not to show Status
        self.showRepair = ko.observable(true);
        self.showCCT = ko.observable(true);
        self.showCRM = ko.observable(true);
        self.showEPaper = ko.observable(true);

        self.countRepairPending = ko.observable(0);
        self.countRepairClosed = ko.observable(0);
        self.countCCTPending = ko.observable(0);
        self.countCCTComplete = ko.observable(0);
        self.countCRMPending = ko.observable(0);
        self.countCRMComplete = ko.observable(0);
        self.EPaperPending = ko.observable(0);
        self.EPaperComplete = ko.observable(0);

        self.ShowOrders = ko.computed(function () {
            if (self.RegOrders().length == 0 && self.EPapers().length == 0) {
                return false;
            } else {
                return true;
            }
        });
        self.filterStatus = function () {

            self.countRepairPending(0);
            self.countRepairClosed(0);
            self.countCCTPending(0);
            self.countCCTComplete(0);
            self.countCRMPending(0);
            self.countCRMComplete(0);
            self.EPaperPending(0);
            self.EPaperComplete(0);

            if (self.RegOrders().length != 0) {
                ko.utils.arrayFilter(self.RegOrders(), function (items) {
                    if (items.Order_Status_ID == '6000') {
                        self.countCRMComplete(self.countCRMComplete() + 1);
                    } else if (items.Order_Status_ID == '1' || items.Order_Status_ID == '5000') {

                    } else {
                        self.countCRMPending(self.countCRMPending() + 1);
                    }
                });
            }           

            if (self.AllRepairTickets().length != 0) {
                ko.utils.arrayFilter(self.AllRepairTickets(), function (data) {
                    if (data.Case_Status_ID == 'CLRES' || data.Case_Status_ID == 'CLURS') {
                        self.countRepairClosed(self.countRepairClosed() + 1);
                    } else if (data.Case_Status_ID == 'CANCL') {

                    } else {
                        self.countRepairPending(self.countRepairPending() + 1);
                    }
                });
            }

            if (self.AllCCTTickets().length != 0) {
                ko.utils.arrayFilter(self.AllCCTTickets(), function (data) {
                    if (data.Case_Status_ID == 'CLRES' || data.Case_Status_ID == 'COMP' || data.Case_Status_ID == 'TCOMP') {
                        self.countCCTComplete(self.countCCTComplete() + 1);
                    } else {
                        self.countCCTPending(self.countCCTPending() + 1);
                    }
                });
            }

            if (self.EPapers().length != 0) {
                ko.utils.arrayFilter(self.EPapers(), function (data) {
                    if (data.EPaper_Status_ID == '6000') {
                        self.EPaperComplete(self.EPaperComplete() + 1);
                    } else if (data.EPaper_Status_ID == '1' || data.EPaper_Status_ID == '5000') {

                    } else {
                        self.EPaperPending(self.EPaperPending() + 1);
                    }
                });
            }
        };


        //Josef: PIC info link on products and services
        self.RemovePic = function (pic) {

            self.pics.remove(pic);
            self.selectedPicsIndex.remove(pic.index);

        };  

        // Use this for comparison as to where the task belong
        // NOTE: Never forget to put a 'comma' (,) in every item even if it's the last one. 
        self.TaskClassification = ko.observable({
            "PrePro": "checkopennxx,manualswitchtranslation,performlnpsubscription,manuallyrevieworder,manuallyperformgrooming,manualreservefacilities,",
            "NetworkPro": "holdforduedatenetworkprovisioning,performnarrowbandprovisioning,performfttpbbgwprovisioning,performhsiprovisioning,ispprovisioning,performvoicemail,holdforpotscompletion,holdfordslcompletion,performhsidisconnect,performiasprovisioning,performvideoadd,performvideochgdisc,holdforhotcutbeforeprovisioning,holdforhotcutafterprovisioning,holdforduedatehsidisconnect," +
                          "holdforduedateisp,setupispcustomer,getterminalclli,holdforduedatevideochgdisc,holdforduedatetvfeatures,performtvfeatures,holdforduedatevideoprovisioning,holdforduedatelnpprovisioning,manuallayer1provisioning,layer2planning,testlayers2and3,holdforduedateispdisconnect,aneatvoipprovisioning,manualconfigprovisioning,manualswitchtranslation,manualdnsprovisioning," +
                          "manualhsiprovisioning,manualiasprovisioning,manualispprovisioning,manuallyprovisionnetwork,manualnarrowbandprovisioning,manualfttpbbgwprovisioning,manualvideoadd,manualtvfeatures,sendfoc,performaaisdsprovisioning,sendsoc,manuallyprovisionaaisds,disconnectswitchtranslation,manualhsidisconnect,manualispprovisioningsupersedure,manualvideochgdisc,manualvoicemail," +
                          "manualaccessprovisioning,manuallyholdeipdscompletion,cancelnarrowbandprovisioning,cancelispprovisioning,performcentrexprovisioning,manualcentrexprovisioning,",
            "Dispatch": "holdforrelateddispatch,getterminaladdress,getfttpfacility,performwfmdispatch,manualwfmdispatch,performlinetest,holdfordispatchbeforedrop,performfttpwfmdrop,performbbgwdropupdate,",
            "PreBill": "holdforduedatelnp,manuallycoordinatehotcut,performlnpservice,performportwithinlnp,performnarrowbandtndisconnect,performnarrowbandtnchange,performnarrowbanddrchange,performbbgwfttpupdate,holdforrelatedorder,holdforduedateasap,holdforduedatedsl,holdforduedatedsl,holdforduedatevideo,holdforduedateaccount,rnshold,holdforduedate,holdforbillingduedate,manuallyholdeipdscompletion,provisioningcomplete,",
            "Bill": "performretailbillingservicedetails,updateretailbillingfeatures,holdforhotcutbeforebilling,holdforhotcutafterbilling,performlsrcabsbilling,performasrcabsbilling,holdforpotshsicompletion,performipvpnretailbillingservicedetails,updateipvpnretailbillingfeatures,manualbilling,manualpiccare,manuale911,holdforduedaterecords,manuallyperformbilling,performasrcabsbilling,ordercomplete,performepaperbillingservicedetails,updateepaperbillingfeatures,cancelcomplete,holdcomplete,"
            });

        // function to load the diagram in orders
        self.LoadDiagram = function (cell, data) {

            var wrapper = $('<div class="wrapper"></div>');
            var totalService = 0;
            var totalComplete = 0;
            var totalCancelled = 0;
            var totalHold = 0;

            var proceed = true;
            $.each(data, function (count, item) {
                var itemStatus = item.Status.toUpperCase();
                totalService++;
            if (itemStatus == "COMPLETE") {
                    totalComplete++;
                } else if (itemStatus == "CANCELLED" || itemStatus == "CANCEL COMPLETE") {
                    totalCancelled++;
                } else if (itemStatus == "HOLD COMPLETE") {
                    totalHold++;                    
                }
            });

            // Check if all status are the same
            if (totalComplete == totalService && totalService > 0) {
                var svc = $('<div class="service"></div>');
                $(svc).append('<div class="container passed">Order is Complete</div>');
                $(wrapper).html(svc);
                proceed = false;
            } else if (totalCancelled == totalService && totalService > 0) {
                var svc = $('<div class="service"></div>');
                $(svc).append('<div class="container warning">Order is Cancelled</div>');
                $(wrapper).html(svc);
                proceed = false;
            } else if (totalHold == totalService && totalService > 0) {
                var svc = $('<div class="service"></div>');
                $(svc).append('<div class="container onhold">Order is on Hold</div>');
                $(wrapper).html(svc);
                proceed = false;
            }
           
            // Iterate each service
            if (proceed) {
                $.each(data, function (i, item) {
                    var svc = $('<div class="service"></div>');
                    $(svc).append('<div class="type">' + item.Service_Type + '</div>');

                    // Check if Status is "DISCREP", "SUSPENDED", "COMPLETE", "CANCELLED" and "HOLD COMPLETE"
                    if (item.Status.toUpperCase() == "DISCREP") {
                        $(svc).append('<div class="container clrRed">Order is discrep\'ed; Please open the order to check further.</div>');
                        $(wrapper).append(svc);
                        return;
                    } else if (item.Status.toUpperCase() == "SUSPENDED") {
                        $(svc).append('<div class="container clrRed">Workflow is Suspended</div>');
                        $(wrapper).append(svc);
                        return;
                    } else if (item.Status.toUpperCase() == "COMPLETE") {
                        $(svc).append('<div class="container clrGreen">Workflow is Complete</div>');
                        $(wrapper).append(svc);
                        totalComplete++;
                        return;
                    } else if (item.Status.toUpperCase() == "CANCELLED" || item.Status.toUpperCase() == "CANCEL COMPLETE") {
                        $(svc).append('<div class="container clrRed">Workflow is Cancelled</div>');
                        $(wrapper).append(svc);
                        totalCancelled++;
                        return;
                    } else if (item.Status.toUpperCase() == "HOLD COMPLETE") {
                        $(svc).append('<div class="container clrRed">Workflow is on Hold</div>');
                        $(wrapper).append(svc);
                        totalHold++;
                        return;
                    }

                    var $xmldoc = $.parseXML(item.WF_XMLDOC);
                    var $tasks = $($xmldoc).find("task");
                    var blocks = JSON.parse('{"PrePro":{"Tasks":[],"Status":[],"Details":[]},"NetworkPro":{"Tasks":[],"Status":[],"Details":[]},"Dispatch":{"Tasks":[],"Status":[],"Details":[]},"PreBill":{"Tasks":[],"Status":[],"Details":[]},"Bill":{"Tasks":[],"Status":[],"Details":[]}}');

                    // Classify each task detail according to Task Group
                    $.each($tasks, function () {
                        // Check if task is leaf node (task has no child)
                        if ($(this).find("task").length == 0) {
                            var taskName = $(this).attr('name') || '';
                            var taskStatus = $(this).attr('status').toUpperCase() || '';

                            // TaskName is appended with ',' to match the exact word in task classification ('HoldForDueDate' will be true in 'HoldForDueDateISP', 'HoldForDueDateLNP', etc)
                            if (self.TaskClassification().PrePro.indexOf(taskName.toLowerCase() + ',') != -1) {
                                blocks.PrePro["Tasks"].push(taskName); blocks.PrePro["Status"].push(taskStatus);
                            } else if (self.TaskClassification().NetworkPro.indexOf(taskName.toLowerCase() + ',') != -1) {
                                blocks.NetworkPro["Tasks"].push(taskName); blocks.NetworkPro["Status"].push(taskStatus);
                            } else if (self.TaskClassification().Dispatch.indexOf(taskName.toLowerCase() + ',') != -1) {
                                blocks.Dispatch["Tasks"].push(taskName); blocks.Dispatch["Status"].push(taskStatus);
                            } else if (self.TaskClassification().PreBill.indexOf(taskName.toLowerCase() + ',') != -1) {
                                blocks.PreBill["Tasks"].push(taskName); blocks.PreBill["Status"].push(taskStatus);
                            } else if (self.TaskClassification().Bill.indexOf(taskName.toLowerCase() + ',') != -1) {
                                blocks.Bill["Tasks"].push(taskName); blocks.Bill["Status"].push(taskStatus);
                            }
                        }
                    });

                    var con = $('<div class="container">Loading...</div>');

                    // Call 2nd SP for service task details
                    $.ajax({
                        url: "/api/htaccount/GetServiceTaskDetails?jobid=" + item.Job_ID + "&duedate=" +
                                moment((new Date(item.Order_CRT_Date)) <= (new Date(item.Order_Due_Date)) ? (new Date(item.Order_CRT_Date)) : (new Date(item.Order_Due_Date))).format('YYYY-MM-DD'),
                        global: false,
                        success: function (taskDetail) {
                            
                            $(con).html(''); // clear out "Loading..." message

                            // Re-classify returned tasks, and sort according to above sequence
                            $.each(taskDetail, function (i, task) {
                                var str = '<span>Task Name : </span>' + task.Task_Name + '<br />' +
                                          '<span>Ready Date : </span>' + task.Ready_Time + '<br />' +
                                          '<span>Assigned To : </span>' + task.Assigned_To + '<br />' +
                                          '<span>Acquired By : </span>' + task.Acquired_By + '<br />' +
                                          '<span>Task Status : </span>' + task.Status + '<br />' +
                                          '<span>Task Due Date : </span>' + task.Due_Date + '<br />' +
                                          '<div></div>';
                                var ind;
                                if ((ind = $.inArray(task.Task_Name, blocks.PrePro.Tasks)) != -1) {
                                    blocks.PrePro.Details[ind] = str;
                                    blocks.PrePro.Status[ind] = task.Status.toUpperCase();
                                } else if ((ind = $.inArray(task.Task_Name, blocks.NetworkPro.Tasks)) != -1) {
                                    blocks.NetworkPro.Details[ind] = str;
                                    blocks.NetworkPro.Status[ind] = task.Status.toUpperCase();
                                } else if ((ind = $.inArray(task.Task_Name, blocks.Dispatch.Tasks)) != -1) {
                                    blocks.Dispatch.Details[ind] = str;
                                    blocks.Dispatch.Status[ind] = task.Status.toUpperCase();
                                } else if ((ind = $.inArray(task.Task_Name, blocks.PreBill.Tasks)) != -1) {
                                    blocks.PreBill.Details[ind] = str;
                                    blocks.PreBill.Status[ind] = task.Status.toUpperCase();
                                } else if ((ind = $.inArray(task.Task_Name, blocks.Bill.Tasks)) != -1) {
                                    blocks.Bill.Details[ind] = str;
                                    blocks.Bill.Status[ind] = task.Status.toUpperCase();
                                }
                            });

                            // Create blocks
                            if (blocks.PrePro.Tasks.length != 0) {
                                $(con).append('<div class="tasks prepro' +
                                                (($.inArray('ACQUIRED', blocks.PrePro.Status) != -1 || $.inArray('READY', blocks.PrePro.Status) != -1) ? ' progress' :
                                                ($.inArray('ACQUIRED', blocks.PrePro.Status) == -1 && $.inArray('READY', blocks.PrePro.Status) == -1 && $.inArray('WAITING', blocks.PrePro.Status) == -1) ? ' done' : '') +
                                              '"><div class="boxlabel"></div>Pre-<br />Prov</div>' +
                                              '<div class="qtiphidden"></div>' +
                                          '<span>&#65515;</span>');
                            }
                            if (blocks.NetworkPro.Tasks.length != 0) {
                                $(con).append('<div class="tasks networkpro' +
                                                (($.inArray('ACQUIRED', blocks.NetworkPro.Status) != -1 || $.inArray('READY', blocks.NetworkPro.Status) != -1) ? ' progress' :
                                                ($.inArray('ACQUIRED', blocks.NetworkPro.Status) == -1 && $.inArray('READY', blocks.NetworkPro.Status) == -1 && $.inArray('WAITING', blocks.NetworkPro.Status) == -1) ? ' done' : '') +
                                              '"><div class="boxlabel"></div>Network-<br />Prov</div>' +
                                              '<div class="qtiphidden"></div>' +
                                          '<span>&#65515;</span>');
                            }
                            if (blocks.Dispatch.Tasks.length != 0) {
                                $(con).append('<div class="tasks dispatch' +
                                                (($.inArray('ACQUIRED', blocks.Dispatch.Status) != -1 || $.inArray('READY', blocks.Dispatch.Status) != -1) ? ' progress' :
                                                ($.inArray('ACQUIRED', blocks.Dispatch.Status) == -1 && $.inArray('READY', blocks.Dispatch.Status) == -1 && $.inArray('WAITING', blocks.Dispatch.Status) == -1) ? ' done' : '') +
                                              '"><div class="boxlabel"></div>Dispatch</div>' +
                                              '<div class="qtiphidden"></div>' +
                                          '<span>&#65515;</span>');
                            }
                            if (blocks.PreBill.Tasks.length != 0) {
                                $(con).append('<div class="tasks prebill' +
                                                (($.inArray('ACQUIRED', blocks.PreBill.Status) != -1 || $.inArray('READY', blocks.PreBill.Status) != -1) ? ' progress' :
                                                ($.inArray('ACQUIRED', blocks.PreBill.Status) == -1 && $.inArray('READY', blocks.PreBill.Status) == -1 && $.inArray('WAITING', blocks.PreBill.Status) == -1) ? ' done' : '') +
                                              '"><div class="boxlabel"></div>Pre-<br />Billing</div>' +
                                              '<div class="qtiphidden"></div>' +
                                          '<span>&#65515;</span>');
                            }
                            if (blocks.Bill.Tasks.length != 0) {
                                $(con).append('<div class="tasks bill' +
                                                (($.inArray('ACQUIRED', blocks.Bill.Status) != -1 || $.inArray('READY', blocks.Bill.Status) != -1) ? ' progress' :
                                                ($.inArray('ACQUIRED', blocks.Bill.Status) == -1 && $.inArray('READY', blocks.Bill.Status) == -1 && $.inArray('WAITING', blocks.Bill.Status) == -1) ? ' done' : '') +
                                              '"><div class="boxlabel"></div>Billing</div>' +
                                          '<div class="qtiphidden"></div>');
                            }

                            // Populate message/s to be used for tooltip
                            // Display only last 'Completed' status for Completed block
                            // Display 'Acquired' and 'Ready' status for In Progress block
                            $('.prepro', con).next('div').html(
                                ($('.prepro', con).is('.done')) ? blocks.PrePro.Details[blocks.PrePro.Tasks.length - 1] :
                                ($('.prepro', con).is('.progress')) ?
                                    ($.grep(blocks.PrePro.Details, function (s, i) {
                                        return (blocks.PrePro.Status[i] == 'ACQUIRED' || blocks.PrePro.Status[i] == 'READY');
                                    }).join("")) : ''); // Join all the task details
                            $('.networkpro', con).next('div').html(
                                ($('.networkpro', con).is('.done')) ? blocks.NetworkPro.Details[blocks.NetworkPro.Tasks.length - 1] :
                                ($('.networkpro', con).is('.progress')) ?
                                    ($.grep(blocks.NetworkPro.Details, function (s, i) {
                                        return (blocks.NetworkPro.Status[i] == 'ACQUIRED' || blocks.NetworkPro.Status[i] == 'READY');
                                    }).join("")) : ''); // Join all the task details
                            $('.dispatch', con).next('div').html(
                                ($('.dispatch', con).is('.done')) ? blocks.Dispatch.Details[blocks.Dispatch.Tasks.length - 1] :
                                ($('.dispatch', con).is('.progress')) ?
                                    ($.grep(blocks.Dispatch.Details, function (s, i) {
                                        return (blocks.Dispatch.Status[i] == 'ACQUIRED' || blocks.Dispatch.Status[i] == 'READY');
                                    }).join("")) : ''); // Join all the task details
                            $('.prebill', con).next('div').html(
                                ($('.prebill', con).is('.done')) ? blocks.PreBill.Details[blocks.PreBill.Tasks.length - 1] :
                                ($('.prebill', con).is('.progress')) ?
                                    ($.grep(blocks.PreBill.Details, function (s, i) {
                                        return (blocks.PreBill.Status[i] == 'ACQUIRED' || blocks.PreBill.Status[i] == 'READY');
                                    }).join("")) : ''); // Join all the task details
                            $('.bill', con).next('div').html(
                                ($('.bill', con).is('.done')) ? blocks.Bill.Details[blocks.Bill.Tasks.length - 1] :
                                ($('.bill', con).is('.progress')) ?
                                    ($.grep(blocks.Bill.Details, function (s, i) {
                                        return (blocks.Bill.Status[i] == 'ACQUIRED' || blocks.Bill.Status[i] == 'READY');
                                    }).join("")) : ''); // Join all the task details

                            // Create tooltip
                            $('.tasks', con).each(function () {
                                if ($(this).is('.done') || $(this).is('.progress')) { // Progress | Done --> only clickable
                                    $(this).qtip({
                                        content: {
                                            //title: "Title",
                                            text: $(this).next('div'), // Use the "div" element next to this for the content
                                            button: true
                                        },
                                        style: { classes: 'qtip-dark qtip-shadow qtip-rounded', },
                                        suppress: false,
                                        position: {
                                            my: 'bottom center',
                                            at: 'top center',
                                            container: $(this).closest(".dataTable").parent(),
                                        },
                                        show: { event: 'click' },
                                        hide: { event: false },
                                    });
                                }
                            });
                        }, // End of function callback
                        error: function (xhr, textStatus, errorThrown) {
                            alert(xhr.responseJSON.MessageDetail || errorThrown)
                        }
                    });


                    //$.get("/api/htaccount/GetServiceTaskDetails?jobid=" + item.Job_ID + "&duedate=" + 
                    //    moment((new Date(item.Order_CRT_Date)) <= (new Date(item.Order_Due_Date)) ? (new Date(item.Order_CRT_Date)) : (new Date(item.Order_Due_Date))).format('YYYY-MM-DD'),
                    //    function (taskDetail) {

                            
                    //}); // End of callback function

                    $(svc).append(con);
                    $(wrapper).append(svc);
                });
            }

            // Add content to cell
            cell.html(wrapper);
        }
    }
