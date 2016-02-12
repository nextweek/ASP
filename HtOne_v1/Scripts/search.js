/*UPDATE September 19,2014*/

var cNameValue, fNameValue, lNameValue;
var searchResultsArray = [];
var searchResults = 0;
var selectedResults = 0;
var selectedResultsArray = [];

var txt_CompNameValue = "";
var txt_fNameValue = "";
var txt_lNameValue = "";
var txtHTSearchContent = "";

var _paging = [5, 10, 20, 50, 100];
var windows = [false, false, false];
var selectedViaLink;
var selectedViaLinkIndex;

var ajaxSearch;

var previousSearches = [];
var previousSearchesIndex;
var previousSearchesNumber = 0;

var ifFromDashboard = false;
var selected = [];

var ShowDisconnected = false;


var close;
var opened;

var closeSearch;
var openSearch;

var one = 0;
var two = 0;

var sizeCounter = 0;
var widthMethod = false;
var uncheckID;
var windowWidth = [1, 2, 3];



//EDD - MAX ALERT IN SEARCH
$(function () {
    // Max Dashboard Style change, Rachel 09/24
    $("#dialog-1").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        buttons: {
            OK: function () {
                $(this).dialog("close");
            }
        },
        open: function (event, ui) {
            $("#dialog-1").parent().siblings(".ui-widget-overlay").css({
                "background": "black"
            });

            $("#dialog-1").parent('.ui-dialog').css({
                "font-weight": "normal",
                "font-size": "100%",
                "font-family": "Segoe UI, Arial, Tahoma",
                "z-index": "999"
            });

            //$("#dialog-1").siblings().children(".ui-dialog-titlebar-close").hide();   //Rachel, 09/25 [Close button, DE39]

            $("#dialog-1").siblings(".ui-widget-content").css({
                "border": "0",
                "padding-right": "37%"
            });

            $("#dialog-1").siblings(".ui-dialog-buttonpane").find("button.ui-button").css({
                "background": "#00A9E0",
                "color": "white",
                "width": "80px",
                "height": "22px",
                "border-radius": "0px",
                "margin": "0px"
            });

            $("#dialog-1").siblings(".ui-dialog-buttonpane").find(".ui-button-text").css({
                "font-size": "84%",
                "padding": "0px"
            });
        }
    });
});

function maxDashAlert() {
    $("#dialog-1").dialog("open");
    $(".ui-widget-overlay").css({
        "background": "black"
    });
}

$('.pakita').mouseenter(function () {
    $(this).stop();
    $(this).fadeIn(50);
}).mouseleave(function () {
    $(this).fadeOut(250);
});

$("#Img1").click(function () {
    $('.pakita').toggle();
});

//EDD - MAX ALERT IN SEARCH - END

function initialize() {
    $(document).ready(function () {

        //$('textarea').bind("change keyup input", function () {
        //    alert("tes");
        //    var limitNum = $(this).attr("maxlength");

        //    if ($(this).val().length > limitNum) {
        //        $(this).val($(this).val().substring(0, limitNum));
        //    }

        //});

        $(document).on('keyup', 'textarea[maxlength]', function (e) {
            //alert("test");
            var maxLength = $(this).attr('maxlength');
            if (e.keyCode > 47 && $(this).val().length >= maxLength) {
                $(this).val($(this).val().substring(0, maxLength)).trigger('change');
            }
            return true;
        });

        vm = new SearchViewModel();

        vm.isUserAdmin();
        vm.getAdminUsername();

        vm.filteredItems = ko.dependentObservable(function () {
            //return this.TickerInfos();

            var filterVal = this.filterText();

            if (!filterVal) {
                return this.TickerInfos();
            }
            else {

                if (this.TickerInfos().length > 0) {
                    return ko.utils.arrayFilter(this.TickerInfos(), function (item) {
                        //var status = item.Status() == null ? '' : item.Status();  //.toLowerCase();
                        var createDate = item.CreateDate() == null ? '' : vm.formatDate(item.CreateDate());
                        var addedBy = item.AddedBy() == null ? '' : item.AddedBy();
                        var itemType = item.ItemType() == null ? '' : item.ItemType();
                        var description = item.Description() == null ? '' : item.Description();
                        var lastModBy = item.LastModBy() == null ? '' : item.LastModBy();
                        var lastModDate = item.LastModDate() == null ? '' : item.LastModDate();
                        var status = vm.getEnumName(vm.statuses, item.Status());
                        var itemType = vm.getEnumName(vm.itemTypes, item.ItemType());

                        if (createDate.indexOf(filterVal) > -1
                            || status.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
                            || itemType.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
                            || addedBy.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
                            || description.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
                            || lastModBy.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
                            || lastModDate.indexOf(filterVal) > -1
                            ) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });


                }

            }

        }, vm);

        $.ajaxSetup({
            global: true,
        });
        vm.tickerInfoLoaded(false);
        $.ajax({
            url: 'api/Ticker/GetAllTickers',
            success: function (data) {
                vm.tickerInfoLoaded(true);
                $.each(data, function (i, tickInfo) {

                    var tickInfoMapped = new TickerInfo(tickInfo.MSG_ID, tickInfo.ADDED_ON, tickInfo.ADDED_BY, tickInfo.MSG_TYPE, tickInfo.MSG_DESCR, tickInfo.MSG_STATUS, tickInfo.MODIFIED_BY, vm.formatDate(tickInfo.MODIFIED_ON));
                    //var tickInfoMapped = new TickerInfo(tickInfo.TickerInfoId, tickInfo.CreateDate, tickInfo.AddedBy, tickInfo.ItemType, tickInfo.Description, tickInfo.Status, tickInfo.LastModBy, model.formatDate(tickInfo.LastModDate));
                    vm.TickerInfos.push(tickInfoMapped);

                });

                $('.marquee').html($('.hidden_tickers').html());
                $mq = $('.marquee').marquee({
                    pauseOnHover: true,
                    //duplicated: true,
                    duration: 15000
                });

                setTimeout(RefreshTickerList, vm.TickerElapse());
            },
            error: function (xhr, textStatus, errorThrown) {
                alert(JSON.parse(xhr.responseText).responseText)
            }
        });

        //$.ajax({
        //    url: 'api/Ticker/GetAllTickers',
        //    success: function (data) {
        //        for (var a = 0 ; a < data.length; a++) {
        //            var test1 = data[a].MSG_TYPE;
        //            var test2 = data.MSG_TYPE
        //            self.TickerInfos2.push(new ticker(data[a].MSG_TYPE, data[a].MSG_STATUS, data[a].MSG_DESCR));
        //        }
        //    },
        //    error: function (xhr, textStatus, errorThrown) {
        //        alert(JSON.parse(xhr.responseText).responseText)
        //    }
        //});



        ko.applyBindings(vm);

        // Function to auto refresh ticker
        function RefreshTickerList() {
            if (!vm.ManageTickerIsShown()) {
                vm.TickerInfos([]);
                // Call api again to reload ticker from server.
                $.ajax({
                    url: 'api/Ticker/GetAllTickers',
                    global: false,
                    success: function (data) {
                        vm.tickerInfoLoaded(true);
                        $.each(data, function (i, tickInfo) {

                            var tickInfoMapped = new TickerInfo(tickInfo.MSG_ID, tickInfo.ADDED_ON, tickInfo.ADDED_BY, tickInfo.MSG_TYPE, tickInfo.MSG_DESCR, tickInfo.MSG_STATUS, tickInfo.MODIFIED_BY, vm.formatDate(tickInfo.MODIFIED_ON));
                            //var tickInfoMapped = new TickerInfo(tickInfo.TickerInfoId, tickInfo.CreateDate, tickInfo.AddedBy, tickInfo.ItemType, tickInfo.Description, tickInfo.Status, tickInfo.LastModBy, model.formatDate(tickInfo.LastModDate));
                            vm.TickerInfos.push(tickInfoMapped);

                        });

                        $('.marquee').html($('.hidden_tickers').html());
                        $mq = $('.marquee').marquee({
                            pauseOnHover: true,
                            //duplicated: true,
                            duration: 15000
                        });
                    }
                });
            }

            setTimeout(RefreshTickerList, vm.TickerElapse());
        }

        for (var i = 0; i < windowWidth.length; i++) {
            windowWidth[i] = (screen.availWidth / windowWidth[i]) - 18;
        }

        var htSearchOriginalWidth = $('#txtHTSearch').width();
        var dropdownWidth, htSearchWidth;
        var browser = navigator.appName;

        window.callback = function (accountInfo) {
            closeSearch = 0;
            openSearch = 0;
            selected = accountInfo;
            ifFromDashboard = true;
            openDashboardViaLink();
        }

        $("#managTicker-dialog").dialog({
            autoOpen: false,
            modal: true,
            //resizable: false,
            width: 1200,
            height: 600,
            open: function (event, ui) {
                $('.ui-dialog').css('z-index', 1100);
                $('.ui-widget-overlay').css('z-index', 1100);
            }
        });


        //Added by Edd for Dropdown Search Criteria - Sept262014
        $('#searchDropdown select').change(function () {
            $("#div_searchError").hide();
            var selectedLength = $('#searchDropdown select').val();
            setUpDropdownWithSearchBox(selectedLength);



            if (selectedLength == "Account Name") {
                $("#searchNameOptions").show();
                var textboxPosition = $('#txtHTSearch').position();
                //$('#searchDropdown').css({
                //    'left': textboxPosition.left
                //});

                document.getElementById("txtHTSearch").disabled = true;
                document.getElementById("btnSearch").disabled = true;
                document.getElementById("HTSearchClear").disabled = true;
            } else if (selectedLength == "Telephone Number" || selectedLength == "Account Number" || selectedLength == "Circuit Id" || selectedLength == "Ticket Number" || selectedLength == "Order Number") {

                if (selectedLength == "Account Number") {
                    $('#txtHTSearch').removeNumeric();
                    $(document.getElementById('txtHTSearch')).prop("maxLength", 15);
                } else if (selectedLength == "Telephone Number") {
                    $('#txtHTSearch').numeric();
                    $(document.getElementById('txtHTSearch')).prop("maxLength", 10);
                } else if (selectedLength == "Ticket Number") {
                    $('#txtHTSearch').numeric();
                    $(document.getElementById('txtHTSearch')).prop("maxLength", 100);
                } else {
                    $('#txtHTSearch').removeNumeric();
                    $(document.getElementById('txtHTSearch')).prop("maxLength", 100);
                }
                $("#searchNameOptions").hide();
                document.getElementById("txtHTSearch").disabled = false;
                document.getElementById("btnSearch").disabled = false;

                var txt = document.getElementById('txtHTSearch');

                if (txt.value != "" && txt.value != "Enter a Keyword") {
                    $('#HTSearchClear').removeAttr("disabled");
                    //txt.focus();
                }
                else {

                    $('#HTSearchClear').attr("disabled", "disabled");
                }

                var textboxPosition = $('#txtHTSearch').position();
                //$('#searchDropdown').css({
                //    'left': textboxPosition.left
                //});

            }
        });

        function setUpDropdownWithSearchBox(selectedLength) {
            htSearchWidth = htSearchOriginalWidth;
            $('#asOne').css('background-color', '#fff');
            switch (selectedLength) {
                case 'Telephone Number':
                    //$('#searchDropdown').css('width', '145px');
                    $('#searchDropdown').css('width', '155px');
                    $('#searchDropdown select').css('width', '185px');
                    break;
                case 'Circuit Id':
                    //$('#searchDropdown').css('width', '80px');
                    $('#searchDropdown').css('width', '90px');
                    $('#searchDropdown select').css('width', '120px');
                    break;
                case 'Account Name':
                    //$('#searchDropdown').css('width', '115px');
                    $('#searchDropdown').css('width', '125px');
                    $('#searchDropdown select').css('width', '155px');
                    $('#asOne').css('background-color', '#BDBDBD');
                    break;
                case 'Account Number':
                    //$('#searchDropdown').css('width', '125px');
                    $('#searchDropdown').css('width', '135px');
                    $('#searchDropdown select').css('width', '165px');
                    break;
                case 'Order Number':
                    //$('#searchDropdown').css('width', '115px');
                    $('#searchDropdown').css('width', '125px');
                    $('#searchDropdown select').css('width', '155px');
                    break;
                case 'Ticket Number':
                    //$('#searchDropdown').css('width', '120px');
                    $('#searchDropdown').css('width', '130px');
                    $('#searchDropdown select').css('width', '160px');
                    break;
            }

            dropdownWidth = $('#searchDropdown').width() + 7;
            $('#txtHTSearch').css('margin-left', dropdownWidth);
            $('#txtHTSearch').css('width', (htSearchWidth - dropdownWidth));
            $('#fiveDiv').css('width', (htSearchWidth + dropdownWidth));
            $('#searchDropdown select').blur();
        }

        $('#searchDropdown select').trigger('change');

        window.maxDash = function (number) {
            var maxDash = false;
            var found = false;

            for (var x = 0; x < selectedResultsArray.length; x++) {
                if (typeof (selectedResultsArray[x].AccountNo) != 'unknown' && 
                    typeof (selectedResultsArray[x].AccountNo) != 'undefined' &&
                    selectedResultsArray[x].AccountNo == number) {

                    found = true;
                }
            }

            if (countOpenDash() == 3 && found == false) {
                maxDash = true;
            }
            return maxDash;
        }

        //josef: function that returns how many dashboards are currently opened. Reusable.
        function countOpenDash() {
            var closeSearch = 0;
            var openSearch = 0;

            for (var a = 0; a < 3; a++) {
                if (windows[a]) {
                    if (windows[a].closed) {
                        closeSearch++;
                    } else {
                        openSearch++;
                    }
                } else {
                    closeSearch++;
                }
            }
            return openSearch;
        }


        $(window).unload(function () {
            for (var x = 0; x < 3; x++) {
                if (windows[x]) {
                    windows[x].close();
                }
                windows[x] = false;
            }
            $('#rbnTN').click();
            $('#HTSearchClear').click();
            $('#txtClearAccName').click();
        });

        /*---- Loader ----*/
        function ajaxindicatorstart(text) {
            if (jQuery('body').find('#resultLoading').attr('id') != 'resultLoading') {
                jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="Images/ajax-loader.gif"><div>' + text + '</div><input type="button" id="CancelSearchButton" value="Cancel search"/></div><div class="bg"></div></div>');
            }

            $('#CancelSearchButton').click(function () {
                ajaxindicatorstop();
                ajaxSearch.abort();
                ajaxSearch = false;
                $("#div_searchError").hide();
            });

            jQuery('#resultLoading').css({
                'width': '100%',
                'height': '100%',
                'position': 'fixed',
                'z-index': '10000000',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'margin': 'auto'
            });

            jQuery('#CancelSearchButton').css({
                'color': 'white',
                'background': 'none',
                'border-color': 'white',
                'z-index': '999999999999',
                'position': 'absolute',
                'margin-top': '6%',
                'left': '0',
                'right': '0',
                'width': '130px',
                'margin': 'auto',
                'border-radius': '0 0 0 0'
            });

            jQuery('#resultLoading .bg').css({
                'background': '#000000',
                'opacity': '0.7',
                'width': '100%',
                'height': '100%',
                'position': 'absolute',
                'top': '0'
            });

            jQuery('#resultLoading>div:first').css({
                'width': '250px',
                'height': '75px',
                'text-align': 'center',
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'margin': 'auto',
                'font-size': '16px',
                'z-index': '10',
                'color': '#ffffff'

            });

            jQuery('#resultLoading .bg').height('100%');
            jQuery('#resultLoading').fadeIn(300);
            jQuery('body').css('cursor', 'wait');
        }

        function ajaxindicatorstop() {
            jQuery('#resultLoading .bg').height('100%');
            jQuery('#resultLoading').fadeOut(300);
            jQuery('body').css('cursor', 'default');
        }

        $(document).ajaxStart(function () {          
          ajaxindicatorstart('Loading');            
        }).ajaxStop(function () {
            ajaxindicatorstop();
        });
        /*------ end ------*/

        /*---- Placeholder ----*/
        function addPlaceholder() {
            if ($(this).val() === '') {
                $(this).val($(this).attr('placeholder')).addClass('placeholder');
                $(this).css('color', 'gray');
            }
        }

        function removePlaceholder() {
            if ($(this).val() === $(this).attr('placeholder')) {
                $(this).val('').removeClass('placeholder');
                $(this).css('color', 'black')
            }
        }

        if (!('placeholder' in $('<input>')[0])) {
            $('input[placeholder], textarea[placeholder]').blur(addPlaceholder).focus(removePlaceholder).each(addPlaceholder);
            $('input[placeholder], textarea[placeholder]').blur();

            $('form').submit(function () {
                $(this).find('input[placeholder], textarea[placeholder]').each(removePlaceholder);
            });
        }
        /*---- end of Placeholder ----*/

        //This is the initial state of the radio buttons
        if ($('#rbnTN').is(':checked')) {
            $('#rbnTN').click();
            document.getElementById("HTSearchClear").disabled = true;
        }

        /*---- When searching via Account Name fields ----*/
        $('#weGo_accntName').click(function () {
            var txt_CompName = document.getElementById("txt_CompName");
            var txt_fName = document.getElementById("txt_fName");
            var txt_lName = document.getElementById("txt_lName");

            txt_CompNameValue = txt_CompName.value.trim();
            txt_fNameValue = txt_fName.value.trim();
            txt_lNameValue = txt_lName.value.trim();

            if (txt_CompNameValue === "Enter a Keyword" || txt_CompName.disabled == true) {
                txt_CompNameValue = "";
            } if (txt_fNameValue === "Enter a Keyword" || txt_fName.disabled == true) {
                txt_fNameValue = "";
            } if (txt_lNameValue === "Enter a Keyword" || txt_lName.disabled == true) {
                txt_lNameValue = "";
            }

            var searchCriteria = $('#searchDropdown select').val();
            if ((txt_CompNameValue.length == 0 || txt_CompNameValue.length < 3) && (txt_fNameValue.length == 0 || txt_lNameValue.length == 0)) {
                errorMessage('Invalid Search. Try again.');
            } else if (txt_CompNameValue.length > 0 && (txt_fNameValue.length > 0 || txt_lNameValue.length > 0)) {
                errorMessage('Invalid Search. Try again.');
            } else {
                $("#div_searchError").hide();
                search(searchCriteria);
                $('#txtClearAccName').removeAttr("disabled");
            }
        });

        //When pressing Enter to calculate
        $("#txt_CompName").keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $('#weGo_accntName').click();
            }
        });

        $("#txt_fName").keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $('#weGo_accntName').click();
            }
        });

        $("#txt_lName").keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $('#weGo_accntName').click();
            }
        });
        /*-------------------------------------------------*/

        /*---- Pagination of results ----*/
        $("#showFirst").click(function () {
            if ($(this).css("opacity") === "1") {
                setPage(1);
            }
        });

        $("#showNext").click(function () {
            if ($(this).css("opacity") === "1") {
                setPage(parseInt($("#pages_showing").val()) + 1);
            }
        });

        $("#showPrevious").click(function () {
            if ($(this).css("opacity") === "1") {
                setPage(parseInt($("#pages_showing").val()) - 1);
            }
        });

        $("#showLast").click(function () {
            if ($(this).css("opacity") === "1") {
                setPage(totalPages);
            }
        });

        $("#pages_showing").keydown(function (event) {
            if (event.keyCode == 13) {
                var p = 1;
                if (jQuery.isNumeric($("#pages_showing").val()) && $("#pages_showing").val() >= 1) {
                    p = parseInt($("#pages_showing").val());
                }
                setPage(p);
            }
        });

        /*---- For Searching via TN/Circuit ID & Account Number ----*/
        $("#btnSearch").click(function (event) {

            event.preventDefault();
            validateSearchBox();

        });

        $("#txtHTSearch").keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                $("#btnSearch").click();
            }
        });

        //Validation for TN/Circuit ID & Account Number
        function validateSearchBox() {
            var isValidSearch = true;

            txtHTSearchContent = document.getElementById('txtHTSearch').value.trim();
            if (txtHTSearchContent === "Enter a Keyword") {
                txtHTSearchContent = null;
            }
            var searchCriteria = $('#searchDropdown select').val(); //updated by edd 09-29-2014
            var value = txtHTSearchContent.replace(/\D/g, '');
            var indexValue = txtHTSearchContent.indexOf("%");

            if (txtHTSearchContent === null || txtHTSearchContent === "" || searchCriteria == "Account Name") {
                errorMessage('Invalid Search. Try again.');
                isValidSearch = false;
            } else if (parseInt(txtHTSearchContent) === 0) {
                errorMessage('Invalid Search. Try Again');
                isValidSearch = false;
            } else {
                switch (searchCriteria) {
                    //case "Account Number":
                    //    if ((value.length < 15) && indexValue < 1) {
                    //        errorMessage('Please enter atleast 15 digits')
                    //        isValidSearch = false;
                    //    }
                    //    else if (value.length > 15) {
                    //        errorMessage('Error: Account Number should not be more than 15 digits');
                    //        isValidSearch = false;
                    //    }
                    //    break;

                    case "Account Number":

                        var SearchContent = txtHTSearchContent.replace(/[%]/g, '');
                            
                         if (txtHTSearchContent.search("%") != -1) {

                            var count = 0;
                            for (var i = 0; i < txtHTSearchContent.length; i++) {
                                if (txtHTSearchContent.charAt(i) == '%') {
                                    ++count;
                                }
                            }

                            if (count == 1) {
                                if (SearchContent.length <= 6) {
                                    errorMessage('Please enter at least 7 digits.');
                                    isValidSearch = false;
                                }
                                else {
                                    isValidSearch = true;
                                }
                            }

                        }else if ((value.length < 15) && indexValue < 1) {
                                    errorMessage('Please enter atleast 15 digits')
                                    isValidSearch = false;
                                }
                                else if (value.length > 15) {
                                    errorMessage('Error: Account Number should not be more than 15 digits');
                                    isValidSearch = false;
                                }
                        
                        break;

                    case "Circuit Id":
                        var SearchContent = txtHTSearchContent.replace(/[%]/g, '');
                        if (txtHTSearchContent.search("%") != -1) {

                            var count = 0;
                            for (var i = 0; i < txtHTSearchContent.length; i++) {
                                if (txtHTSearchContent.charAt(i) == '%') {
                                    ++count;
                                }
                            }

                            if (count == 1) {
                                if (SearchContent.length <= 10) {
                                    errorMessage('Circuit ID should be at least 11 characters long.');
                                    isValidSearch = false;
                                }
                                else {
                                    isValidSearch = true;
                                }
                            }
                            else if (count == 2) {
                                if (SearchContent.length <= 5) {
                                    errorMessage('Circuit ID should be at least 6 characters long.');
                                    isValidSearch = false;
                                }
                                else {
                                    isValidSearch = true;
                                }
                            }
                        }
                        break;
                }
            }
            if (isValidSearch == true) {
                search(searchCriteria);
                isValidSearch = false;
            }
        }


        function showResultsDiv() {
            $("#search-results-container").show();
            $("#search-results-left").show();
            $("#search-results-main").show();
            $("#showPerPage").hide();
            $("#search-results-right").show();
            $("#previousSearchAccounts").css('margin-left', '20em');
        }

        function search(searchCriteria) {
            selectedResultsArray = [];
            sessionStorage.setItem('selectedResultsArray', JSON.stringify(selectedResultsArray));

            searchResultsArray = [];
            selectedViaLink = "";
            selectedResults = 0;
            $('#btnDisconnected').attr("disabled", "disabled").prop('value', 'Show Disconnected');
            ShowDisconnected = false;

            for (var x = 0; x < 3; x++) {
                if (windows[x]) {
                    windows[x].close();
                }
                windows[x] = false;
            }

            var emptyParam = ' ';

            if (searchCriteria === "Account Name") {
                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }
                var fName = txt_fNameValue;
                var lName = txt_lNameValue;
                var coName = txt_CompNameValue;
                var coNameFin = coName;
                if (coName.indexOf("&") > -1) {
                    coNameFin = coName.replace("&", "CHR(38)");
                }
                if (coName.indexOf("'") > -1) {
                    coNameFin = coName.split("'").join("''");
                }
                if (coName.indexOf("’") > -1) {
                    coNameFin = coName.split("’").join("''");
                }


                if (fName === "Enter a Keyword") {
                    fName = null;
                } if (lName === "Enter a Keyword") {
                    lName = null;
                } if (coName === "Enter a Keyword") {
                    coName = null;
                }

                //var url = "api/htaccount/SearchByName?firstname=" + fName + "&lastname=" + lName + "&companyname=" + coNameFin;

                var url = "api/htaccount/SearchByAcctName?firstname=" + fName + "&lastname=" + lName + "&companyname=" + coNameFin + "&active=" + true;

                if (fName.length == 0 && lName.length == 0) {
                    //url = "api/htaccount/SearchByName?firstname=" + emptyParam + "&lastname=" + emptyParam + "&companyname=" + coNameFin + "%";
                    url = "api/htaccount/SearchByAcctName?firstname=" + emptyParam + "&lastname=" + emptyParam + "&companyname=" + coNameFin + "%" + "&active=" + ADstatus;
                    document.getElementById("txt_fName").disabled = true;
                    document.getElementById("txt_lName").disabled = true;
                }
                if (coName.length == 0) {
                    //url = "api/htaccount/SearchByName?firstname=" + fName + "%&lastname=" + lName + "%&companyname=" + emptyParam;
                    url = "api/htaccount/SearchByAcctName?firstname=" + fName + "%&lastname=" + lName + "%&companyname=" + emptyParam + "&active=" + ADstatus;
                    document.getElementById("txt_CompName").disabled = true;
                }

                $.ajaxSetup({
                    global:true,
                });
                ajaxSearch = $.ajax({
                    type: "GET",
                    url: url,
                    success: function (Data) {
                        if (Data.length === 0) {
                            errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                        } else {
                            for (var j = 0; j < Data.length; j++) {
                                var resultElements =
                                {
                                    customerName: Data[j].AccountName,
                                    accountNum: Data[j].AccountNo,
                                    telNum: Data[j].Btn,
                                    billingAddress: Data[j].BillingAddress,
                                    alternateAddress: Data[j].AlternateAddress,
                                    products: Data[j].Products,
                                    market: Data[j].MarketCode,
                                    type: Data[j].AccountType,
                                    status: Data[j].KenanStatus
                                }

                                searchResultsArray.push(resultElements);

                            }
                            generateResults(searchResultsArray);
                        }
                    },
                    error: function (Data) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    },
                    dataType: "json",
                    cache: false
                });
            } else if (searchCriteria === "Telephone Number") {
                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }
                //var url = "api/htaccount/searchbytn?telnum=" + txtHTSearchContent;
                var url = "api/htaccount/SearchByTN?tn=" + txtHTSearchContent + "&active=" + ADstatus;
                $.ajaxSetup({
                    global: true,
                });
                ajaxSearch = $.ajax({
                    type: "GET",
                    url: url,
                    success: function (Data) {
                        if (Data.length === 0) {
                            errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                        } else {
                            for (var j = 0; j < Data.length; j++) {
                                var resultElements =
                                {
                                    customerName: Data[j].AccountName,
                                    accountNum: Data[j].AccountNo,
                                    telNum: Data[j].Btn,
                                    billingAddress: Data[j].BillingAddress,
                                    alternateAddress: Data[j].AlternateAddress,
                                    products: Data[j].Products,
                                    market: Data[j].MarketCode,
                                    type: Data[j].AccountType,
                                    status: Data[j].KenanStatus
                                }

                                searchResultsArray.push(resultElements);
                            }
                            generateResults(searchResultsArray);
                        }
                    },
                    error: function (Data) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    },
                    dataType: "json",
                    cache: false
                });

            } else if (searchCriteria === "Circuit Id") {
                var isAllNum = /^\d+$/.test(txtHTSearchContent);

                if (isAllNum) {
                    txtHTSearchContent = txtHTSearchContent + ".";
                }

                txtHTSearchContent = txtHTSearchContent.replace('%', '%25');
                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }
                //var url = "api/htaccount/searchbytn?telnum=" + txtHTSearchContent;
                var url = "/api/htaccount/SearchByCKT?cktid=" + txtHTSearchContent + "&active=" + ADstatus;
                $.ajaxSetup({
                    global: true,
                });
                ajaxSearch = $.ajax({
                    type: "GET",
                    url: url,
                    success: function (Data) {
                        if (Data.length === 0) {
                            errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                        } else {
                            for (var j = 0; j < Data.length; j++) {
                                var resultElements =
                                {
                                    customerName: Data[j].AccountName,
                                    accountNum: Data[j].AccountNo,
                                    telNum: Data[j].Btn,
                                    billingAddress: Data[j].BillingAddress,
                                    alternateAddress: Data[j].AlternateAddress,
                                    products: Data[j].Products,
                                    market: Data[j].MarketCode,
                                    type: Data[j].AccountType,
                                    status: Data[j].KenanStatus
                                }

                                searchResultsArray.push(resultElements);
                            }
                            generateResults(searchResultsArray);
                        }
                    },
                    error: function (Data) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    },
                    dataType: "json",
                    cache: false
                });

            } else if (searchCriteria === "Account Number") {
                //var txtHTSearchContent = $("#txtHTSearch").val().trim();
                txtHTSearchContent = txtHTSearchContent.replace('%', '%25');

                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }
                //var url = "api/htaccount?id=" + txtHTSearchContent;
                var url = "api/htaccount/SearchByAcctNum?acctNum=" + txtHTSearchContent + "&active=" + ADstatus;
                $.ajaxSetup({
                    global: true,
                });
                ajaxSearch = $.getJSON(url,
                function (Data) {
                    if (Data.length === 0) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    } else {
                        for (var j = 0; j < Data.length; j++) {
                            var resultElements =
                            {
                                customerName: Data[j].AccountName,
                                accountNum: Data[j].AccountNo,
                                telNum: Data[j].Btn,
                                billingAddress: Data[j].BillingAddress,
                                alternateAddress: Data[j].AlternateAddress,
                                products: Data[j].Products,
                                market: Data[j].MarketCode,
                                type: Data[j].AccountType,
                                status: Data[j].KenanStatus
                            }

                            searchResultsArray.push(resultElements);
                        }
                        generateResults(searchResultsArray);
                    }
                })
                .fail(
                function (jqXHR, textStatus, err) {
                    results = [];
                    errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                });
            } else if (searchCriteria === "Ticket Number") {
                //var txtHTSearchContent = $("#txtHTSearch").val().trim();
                txtHTSearchContent = txtHTSearchContent.replace('%', '%25');
                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }

                var url = "api/htaccount/SearchByCaseID?caseid=" + txtHTSearchContent + "&active=" + ADstatus;
                $.ajaxSetup({
                    global: true,
                });
                ajaxSearch = $.getJSON(url,
                function (Data) {
                    if (Data.length === 0) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    } else {
                        for (var j = 0; j < Data.length; j++) {
                            var resultElements =
                            {
                                customerName: Data[j].AccountName,
                                accountNum: Data[j].AccountNo,
                                telNum: Data[j].Btn,
                                billingAddress: Data[j].BillingAddress,
                                alternateAddress: Data[j].AlternateAddress,
                                products: Data[j].Products,
                                market: Data[j].MarketCode,
                                type: Data[j].AccountType,
                                status: Data[j].KenanStatus
                            }

                            searchResultsArray.push(resultElements);
                        }
                        generateResults(searchResultsArray);
                    }
                })
                .fail(
                function (jqXHR, textStatus, err) {
                    results = [];
                    errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                });
            } else if (searchCriteria === "Order Number") {
                //var txtHTSearchContent = $("#txtHTSearch").val().trim();
                txtHTSearchContent = txtHTSearchContent.replace('%', '%25');
                if ($('#active').is(':checked')) {
                    var ADstatus = true;
                } else if ($('#disconn').is(':checked')) {
                    var ADstatus = false;
                }
                var url = "api/htaccount/SearchByOrderID?orderid=" + txtHTSearchContent + "&active=" + ADstatus;
                $.ajaxSetup({
                    global: true,
                });
                ajaxSearch = $.getJSON(url,
                function (Data) {
                    if (Data.length === 0) {
                        errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                    } else {
                        for (var j = 0; j < Data.length; j++) {
                            var resultElements =
                            {
                                customerName: Data[j].AccountName,
                                accountNum: Data[j].AccountNo,
                                telNum: Data[j].Btn,
                                billingAddress: Data[j].BillingAddress,
                                alternateAddress: Data[j].AlternateAddress,
                                products: Data[j].Products,
                                market: Data[j].MarketCode,
                                type: Data[j].AccountType,
                                status: Data[j].KenanStatus
                            }

                            searchResultsArray.push(resultElements);
                        }
                        generateResults(searchResultsArray);
                    }
                })
                .fail(
                function (jqXHR, textStatus, err) {
                    results = [];
                    errorMessage('No Matches Were Found For Your Search Criteria. Please Try Again');
                });
            }

        }

        function errorMessage(message) {
            document.getElementById("div_searchError").style.display = "block";
            document.getElementById('lbl_errorMsg').innerHTML = message;
            $("#search-results-container").hide();
        }

        //$('#active, #disconn').click(function () {
        //    var radButtons = this;
        //    var valButton = $(radButtons).val();
        //    if (valButton == 'disconn') {
        //        ShowDisconnected = true;
        //        $("#btnDisconnected").prop('value', 'Hide Disconnected');
        //        initializePaging();
        //        setPage(1);
        //    } else if (valButton == 'active' ) {
        //        ShowDisconnected = false;
        //        $("#btnDisconnected").prop('value', 'Show Disconnected');
        //        initializePaging();
        //        setPage(1);
        //    }

        //});


        // Added by DJ 09/15/2014
        $("#btnDisconnected").click(function (event) {
            event.preventDefault();
            if ($("#btnDisconnected").prop('value') === "Show Disconnected") {
                ShowDisconnected = true;
                $("#btnDisconnected").prop('value', 'Hide Disconnected');
                initializePaging();
                setPage(1);
            }
            else {
                ShowDisconnected = false;
                $("#btnDisconnected").prop('value', 'Show Disconnected');
                initializePaging();
                setPage(1);
            }

            var textboxPosition = $('#txtHTSearch').position();
            //$('#searchDropdown').css({
            //    'left': textboxPosition.left
            //});
            setPositionSizes('imgDownArrow');
            setPositionSizes('HTSearchClear');

        });

        function generateResults(searchResultsArray) {
            $("#show_per_page").empty();
            if ($("#result-list li").length > 0) {
                $("#result-list li").remove();
            }

            $('#weGo').attr("disabled", "disabled");
            $('#unselectAll').attr("disabled", "disabled");

            var resultList = document.getElementById('result-list');
            for (var i = 0; i < searchResultsArray.length; i++) {
                var customer = searchResultsArray[i].customerName.split(",").join(", ");
                var products = searchResultsArray[i].products.split(",").join(", ");
                var telephone = searchResultsArray[i].telNum.replace(/[^0-9a-zA-Z]+/g, '');
                var status = searchResultsArray[i].status;

                if (!(searchResultsArray[i].alternateAddress == "" || typeof searchResultsArray[i].alternateAddress === undefined)) {
                    var address = "Service Address: " + searchResultsArray[i].alternateAddress;
                } else {
                    var address = "Billing Address: " + searchResultsArray[i].billingAddress;
                }

                var resultList = document.getElementById('result-list');
                var listItem = document.createElement('li');
                listItem.setAttribute('id', 'result_item_' + i);

                // Added by DJ 09/17/2014
                //if (status === 'DISC_DONE' || status === 'DISC_REQ' || status === 'CLOS' || status === 'CDIS' || status === 'DIS') {
                if ($('#disconn').is(':checked')) {
                    listItem.setAttribute('class', 'inactive');
                } else {
                    listItem.setAttribute('class', 'active');
                }

                listItem.innerHTML = '<div class="result-item-info">'
                    + '<h2 class="result-item-header" ' +
                        //((status === 'DISC_DONE' || status === 'DISC_REQ' || status === 'CLOS' || status === 'CDIS' || status === 'DIS') ? 'style="color: #D63030"' : '')   // Added by DJ 09/16/2014
                        (($('#disconn').is(':checked')) ? 'style="color: #D63030"' : '')
                    + 'id="result_header_' + i + '"><span id="result_name_' + i + '">' + customer + '</span> - <span id="result_num_' + i + '">' + searchResultsArray[i].accountNum + '</span> <span>[' + searchResultsArray[i].type + ']</span></h2>'
                    + '<p id="result_tn_' + i + '">' + telephone + '</p>'
                    + '<p id="result_addr_' + i + '">' + address + '</p>'
                    + '<p id="result_services_' + i + '">Products: ' + products + '</p>'
                    + '<p id="result_market_' + i + '">Market Code: ' + searchResultsArray[i].market + '</p>'
                    + '</div><div class="select_result">'
                    + '<input type="checkbox" id="chk_result_' + i + '" class="chk_result" />'
                    + '<label for="chk_result_' + i + '" id="chk_result_lbl_' + i + '" ></label>'
                    + '</div>';
                resultList.appendChild(listItem);

                $("#chk_result_" + i).change(function () {
                    selectedResults = $('.chk_result:checked + label').length;
                    if (selectedResults > 0) {
                        $('#weGo').removeAttr('disabled');
                        $('#unselectAll').removeAttr('disabled');

                        if (selectedResults === 3) {
                            $(".chk_result").each(function (index) {
                                if (!$('#chk_result_' + index).is(':checked')) {
                                    $('#chk_result_' + index).prop("disabled", "disabled");
                                }
                            });
                        } else {
                            $(".chk_result").each(function (index) {
                                if (!$('#chk_result_' + index).is(':checked')) {
                                    $('#chk_result_' + index).removeAttr('disabled');
                                }
                            });
                        }

                    } else {
                        $('#weGo').attr("disabled", "disabled");
                        $('#unselectAll').attr("disabled", "disabled");
                    }

                    $("#selected_counter").text(selectedResults);

                    //get index of checkbox: chk_result_index
                    var index = this.id.replace(/\D/g, '');
                    var id = searchResultsArray[index].accountNum;
                    if (!$('#chk_result_' + id).is(':checked')) {
                        for (var x = 0; x < selectedResultsArray.length; x++) {
                            //if (selectedResultsArray[x].Object === id) {
                            if (selectedResultsArray[x].AccountNo == id) {
                                selectedResultsArray.splice(x, 1);
                            }
                        }
                    }
                });

                $('#result_header_' + i).click(function () {
                    var id = parseInt(this.id.substring(14));
                    if (!$("#chk_result_" + id).is(':checked') && selectedResults !== 3) {
                        $("#chk_result_" + id).click();
                        //selectedViaLink = id;
                        selectedViaLink = searchResultsArray[id].accountNum;
                        selectedViaLinkIndex = id;
                        openDashboardViaLink()
                    } else if ($("#chk_result_" + id).is(':checked')) {
                        //selectedViaLink = id;
                        selectedViaLink = searchResultsArray[id].accountNum;
                        selectedViaLinkIndex = id;
                        openDashboardViaLink()
                    }
                });
            }

            $("#div_searchError").hide();
            $("#search-content").css("margin-top", ".8in");
            showResultsDiv();

            // Added by DJ 09/17/2014
            // If no active account/s, notify user
            if ($('#result-list li[class^="active"]').length === 0) {
                // Notify user for disconnected account results
                //errorMessage('No Active Accounts Found. Found ' + $('#result-list li[class^="inactive"]').length + ' Disconnected Account/s. ' +
                //              'Click Show Disconnected Button To Display.');
                ShowDisconnected = true;
                $("#btnDisconnected").prop('value', 'Hide Disconnected');
                //showResultsDiv();
            }

            // Check if there's an inactive account/s
            if ($('#result-list li[class^="inactive"]').length !== 0)
                $('#btnDisconnected').removeAttr('disabled');

            // Initialize Paging
            initializePaging();
            setPage(1);

            $(window).trigger('resize');
            $(window).resize();

            if (browser === "Microsoft Internet Explorer") {
                var textboxPosition = $('#txtHTSearch').position();
                //$('#searchDropdown').css({
                //    'left': textboxPosition.left
                //});
            }

        }

        /////////////////////////////////////////////////////////////////////////////
        // Added by DJ 09/17/2014
        /////////////////////////////////////////////////////////////////////////////
        var totalResult = 0;
        var page = 5; // default to 5
        var totalPages = 1;

        function setPage(pageNum) {
            var start = 0;
            var end = 0;
            pageNum = (pageNum > totalPages) ? totalPages : pageNum;
            $("#pages_showing").val(pageNum);

            end = pageNum * page;
            start = end - page + 1;
            start = (start > end) ? end : start;
            $("#result-list li").hide();
            if (ShowDisconnected) { // && $('#disconn').is(':checked')) {
                $('#result-list li').slice(start - 1, end).show();
            } else {
                $('#result-list li[class^="active"]').slice(start - 1, end).show();
            }



            $("#result_showing_first").text(start);
            $("#result_showing_last").text((end > totalResult) ? totalResult : end);

            $("#pages_showing").val(pageNum);
            $("#selected_counter").text($('.chk_result:checked + label').length);

            // Set Opacity
            if (pageNum == 1) {
                $("#showFirst").css('opacity', '0.5');
                $("#showPrevious").css('opacity', '0.5');
            } if (pageNum == totalPages) {
                $("#showNext").css('opacity', '0.5');
                $("#showLast").css('opacity', '0.5');
            } if (pageNum < totalPages) {
                $("#showNext").css('opacity', '1');
                $("#showLast").css('opacity', '1');
            } if (pageNum > 1) {
                $("#showFirst").css('opacity', '1');
                $("#showPrevious").css('opacity', '1');
            }
        }

        function initializePaging() {

            if (ShowDisconnected) {
                totalResult = $('#result-list li').length;
            } else {
                totalResult = $('#result-list li[class^="active"]').length;
            }

            if ($("#show_per_page").find('option').length === 0) {
                //$("#show_per_page").html(""); // Clear options. reintialize
                for (var i = 0; _paging[i] < totalResult; i++) {
                    $("#show_per_page").append("<option value='" + _paging[i] + "'>" + _paging[i] + "</option>");
                }
                $("#show_per_page").append("<option value='" + searchResults + "'>All</option>");
            }

            totalPages = 1;

            if ($("#show_per_page option:selected").val() == 0) { // show all
                page = totalResult;
                totalPages = 1;
            } else {
                page = $("#show_per_page option:selected").val();
                totalPages = parseInt(totalResult / page);
                totalPages += (totalResult % page !== 0) ? 1 : 0;
            }

            $("#pages_total").text(totalPages);
            $("#result_total").text(totalResult);
        }

        $("#show_per_page").change(function () {
            initializePaging();
            setPage(1);
        });

        $('#weGo').click(function () {
            selectedResultsArray = [];

            var counter = 0;
            for (var index = 0; index < $(".chk_result").length; index++) {
                if (counter === 3) {
                    break;
                }

                if ($('#chk_result_' + index).is(':checked')) {
                    counter++;

                    var number = $('#result_num_' + index).text();
                    var name = $('#result_name_' + index).text();
                    var telephone = $('#result_tn_' + index).text();
                    var type = searchResultsArray[index].type;

                    selected =
                    {
                        //Object: index,
                        AccountName: name,
                        AccountNo: number,
                        BTN: telephone,
                        AccountType: type
                    }

                    selectedResultsArray.push(selected);
                    selected = null;
                }
            }
            openDashboardWindows(selectedResultsArray, counter);
            //}
            //else {
            //    createCookie('maxAlert', 1, 1);
            //}
        });

        function removeFalse() {
            for (var i = 0; i < selectedResultsArray.length; i++) {
                if (selectedResultsArray[i] == false) {
                    selectedResultsArray.splice(i, 1);
                    removeFalse();
                }
            }

            return selectedResultsArray;
        }

        function openDashboardViaLink() {
            selectedResultsArray = JSON.parse(sessionStorage.getItem('selectedResultsArray'));
            if (selectedResultsArray == null) {
                selectedResultsArray = [];
            }

            for (var y = 0; y < windows.length; y++) {
                if ((windows[y].closed || !windows[y]) && selectedResultsArray != null) {
                    selectedResultsArray[y] = false;
                }
            }

            var found = false;
            selectedResultsArray = removeFalse(selectedResultsArray);

            if (ifFromDashboard) {
                selectedViaLink = selected.AccountNo;
            }

            for (var x = 0; x < selectedResultsArray.length; x++) {
                //if (selectedResultsArray[x].Object === index) {
                if (selectedResultsArray[x].AccountNo == selectedViaLink) {
                    found = true;
                }
            }

            //if (selectedResultsArray.length != 3) {
            if (found != true) {
                if (!ifFromDashboard) {
                    var index = selectedViaLinkIndex;
                    var number = $('#result_num_' + index).text();
                    var name = $('#result_name_' + index).text();
                    var telephone = $('#result_tn_' + index).text();
                    var type = searchResultsArray[index].type;

                    selected =
                    {
                        //Object: index,
                        AccountName: name,
                        AccountNo: number,
                        BTN: telephone,
                        AccountType: type
                    }
                }

                selectedResultsArray.push(selected);
                selected = null;
            }
            var counter = 1;
            openDashboardWindows(selectedResultsArray, counter);
            /*}
            else {
                maxDashAlert();
                $("#chk_result_" + uncheckID).click();
            }*/

            selectedViaLink = "";
            ifFromDashboard = false;
        }

        /*---- Dashboard ----*/
        function openDashboardWindows(selectedResultsArray, counter) {
            var topPos = 0;
            var leftPos;
            var selectedAccNos = getAccountNos(selectedResultsArray);
            var widthMethod;
            var newlyOpened = [], refocus = [];

            var finalCounter;
            one = selectedResultsArray.length;

            closeSearch = 0;
            openSearch = 0;
            sizeCounter = 0;

            for (var a = 0; a < 3; a++) {
                if (windows[a]) {
                    if (windows[a].closed) {
                        closeSearch++;
                    } else {
                        openSearch++;
                    }
                } else {
                    closeSearch++;
                }
            }


            if (one != 3) {
                widthMethod = false;
            } else {
                if (closeSearch == 3) {
                    widthMethod = false;
                } else {
                    widthMethod = true;
                }
            }

            /*if (two < one) {
                finalCounter = one - two;
            } else {
                if (one == 3 || one == 2) {
                    finalCounter = two - one;
                } else if (one == 1) {
                    finalCounter = one;
                }
            }*/

            if (closeSearch == 3) { //first search, no opened Dashboards
                finalCounter = one;
            } else if (selectedViaLink != "") {
                finalCounter = 1;
            } else if (closeSearch > 0) {   //count of closed windows
                finalCounter = closeSearch;
            }

            for (i = 0; i < counter; i++) {

                if (selectedViaLink != "") {
                    var temp_i = i;
                    //i = selectedAccNos.indexOf(parseInt(selectedViaLink)); Changed, 09/24 Rachel [DE51 fix]
                    i = selectedAccNos.indexOf(selectedViaLink);
                }

                var accNo = selectedResultsArray[i].AccountNo;
                var accNam = selectedResultsArray[i].AccountName;
                var accBtn = selectedResultsArray[i].BTN;
                var accType = selectedResultsArray[i].AccountType;

                if (window.screen) {
                    //var h = window.innerHeight + 5;
                    var h = screen.height;
                    var w = windowWidth[finalCounter - 1];
                    if (finalCounter == 1) {
                        w = screen.width;
                    }

                    /*if (finalCounter == 3) {
                        w = (window.screen.availWidth / 3.1);
                    } else {
                        w = (window.screen.availWidth / finalCounter) - 15;
                    }*/

                    if (!widthMethod) {
                        if (i == 0) {
                            leftPos = 0;
                        } else if (i == 1) {
                            leftPos += w + 15;
                        } else if (i == 2) {
                            leftPos += w + 15;
                        }
                    } else {
                        if (i > 0) {
                            var prev = i - 1;
                            if (newlyOpened.indexOf(prev) >= 0) {
                                leftPos += w + 15;
                            } else {
                                leftPos = 0;
                            }
                        } else if (i == 0) {
                            leftPos = 0;
                        }

                        /*if (i == 0) {
                            leftPos = 0;
                            sizeCounter++;
                        } else if (i == 1) {
                            if (finalCounter != 2) {
                                leftPos += w + 15;
                            } else {
                                if (sizeCounter != 1) {
                                    leftPos += w + 15;
                                    sizeCounter = 0;
                                } else {
                                    leftPos = 0;
                                }
                            }
                        } else if (i == 2) {
                            leftPos += w + 15;
                        }*/
                    }

                    if (windows[i] && !windows[i].closed) {
                        var path = windows[i].location.search.split("|");
                        //var num = parseInt(path[0].replace(/[^0-9]/g, ''));   Changed, 09/24 Rachel [DE51 fix]
                        var num = path[0].replace(/[^0-9]/g, '');
                        if (accNo != num) {
                            windows[i] = window.open('Dashboard.aspx?num=' + accNo + "|accountName=" + accNam + "|btn=" + accBtn + "|accountType=" + accType, '_blank', 'scrollbars=1,resizable=1,width=' + w + ',height=' + h + ', top=' + topPos + ', left=' + leftPos, "winPop");
                            newlyOpened.push(i);
                        }
                        refocus.push(i);
                    } else {
                        if (openSearch == 3) {
                            if (selectedViaLink != "") {
                                for (var j = 0; j < searchResultsArray.length; j++) {
                                    if (searchResultsArray[j].accountNum == selectedViaLink) {
                                        uncheckID = j;
                                        if ($("#chk_result_" + uncheckID).is(':checked')) {
                                            $("#chk_result_" + uncheckID).click();
                                        }
                                        uncheckID = 0;
                                        break;
                                    }
                                }
                            }
                            maxDashAlert();
                            break;
                        } else {
                            windows[i] = window.open('Dashboard.aspx?num=' + accNo + "|accountName=" + accNam + "|btn=" + accBtn + "|accountType=" + accType, '_blank', 'scrollbars=1,resizable=1,width=' + w + ',height=' + h + ', top=' + topPos + ', left=' + leftPos, "winPop");
                            newlyOpened.push(i);
                        }
                    }

                    windows[i].window.focus();
                }

                if (selectedViaLink != "") {
                    i = temp_i;
                }
            }

            for (var i = 0; i < refocus.length; i++) {
                var index = refocus[i];
                setTimeout(function () {
                    windows[index].window.focus();
                }, 0);
            }

            for (var i = 0; i < newlyOpened.length; i++) {
                var index = newlyOpened[i];
                windows[index].focus();
            }

            two = one;
            setPreviousSearches();
            sessionStorage.setItem('selectedResultsArray', JSON.stringify(selectedResultsArray));
        }

        function getAccountNos(selectedResultsArray) {
            var selectedAccNos = [];
            for (var i = 0; i < selectedResultsArray.length; i++) {
                //var number = parseInt(selectedResultsArray[i].AccountNo); Changed, 09/24 Rachel [DE51 fix]
                var number = selectedResultsArray[i].AccountNo;
                selectedAccNos[i] = number;
            }

            var tempWindows = [false, false, false];
            for (var i = 0; i < 3; i++) {
                if (windows[i] && !windows[i].closed) {
                    var path = windows[i].location.search.split("|");
                    //var num = parseInt(path[0].replace(/[^0-9]/g, ''));   Changed, 09/24 Rachel [DE51 fix]
                    var num = path[0].replace(/[^0-9]/g, '');
                    var winNo = selectedAccNos.indexOf(num);
                    if (winNo >= 0) {
                        tempWindows[winNo] = windows[i];
                    } else {
                        windows[i].close();
                        windows[i] = false;
                    }
                }
            }
            windows = tempWindows;

            return selectedAccNos;
        }

        $('#unselectAll').click(function () {
            for (var index = 0; index < $(".chk_result").length; index++) {
                if ($('#chk_result_' + index).is(':checked')) {
                    $('#chk_result_' + index).click();
                }
            }

            $('#unselectAll').attr("disabled", "disabled");
        });


        /*TEXT CLEAR BUTTON*/
        $('input').bind('keyup keydown paste', function () {
            var textBox = $(this).attr('id');
            var txt = document.getElementById($(this).attr('id'));
            setTimeout(function () {
                switch (textBox) {
                    case "txtHTSearch": /*HT SEARCH TEXTBOX*/
                        if (txt.value != "") {
                            $('#HTSearchClear').removeAttr("disabled");
                            $('#HTSearchClear').css("opacity", '1');

                        }
                        else {
                            $('#HTSearchClear').attr("disabled", "disabled");
                            $('#HTSearchClear').css("opacity", '0');

                        }
                        break;
                    case "txt_CompName": /*COMPANY NAME TEXTBOX*/
                        if (txt.value != "") {
                            $('#txtClearAccName').removeAttr("disabled");
                            document.getElementById("txt_fName").disabled = true;
                            document.getElementById("txt_lName").disabled = true;
                        }
                        else {
                            $('#txtClearAccName').attr("disabled", "disabled");

                            document.getElementById("txt_fName").disabled = false;
                            document.getElementById("txt_lName").disabled = false;
                        }
                        break;
                    case "txt_fName": /*FIRST NAME TEXTBOX*/
                        var lName = document.getElementById("txt_lName").value;
                        if (lName == "Enter a Keyword") {
                            lName = "";
                        }

                        if (txt.value === "" && lName === "") {
                            $('#txtClearAccName').attr("disabled", "disabled");
                            document.getElementById("txt_CompName").disabled = false;
                        }
                        else {
                            $('#txtClearAccName').removeAttr("disabled");
                            document.getElementById("txt_CompName").disabled = true;
                        }
                        break;

                    case "txt_lName": /*LAST NAME TEXTBOX*/
                        var fName = document.getElementById("txt_fName").value;
                        if (fName == "Enter a Keyword") {
                            fName = "";
                        }

                        if (txt.value === "" && fName === "") {
                            $('#txtClearAccName').attr("disabled", "disabled");
                            document.getElementById("txt_CompName").disabled = false;
                        }
                        else {
                            $('#txtClearAccName').removeAttr("disabled");
                            document.getElementById("txt_CompName").disabled = true;
                        }
                        break;
                }
            }, 0);
        });


        $('#HTSearchClear').click(function () {
            var txt = document.getElementById('txtHTSearch');
            txt.value = '';

            if (txt.value != "" || txt.value === "Enter a Keyword") {
                $('#HTSearchClear').removeAttr("disabled");
                $('#HTSearchClear').css("opacity", '1');

            }
            else {
                $('#HTSearchClear').attr("disabled", "disabled");
                $('#HTSearchClear').css("opacity", '0');

            }

            txt.focus();
        });

        $('#txtClearAccName').click(function () {
            var txtComp = document.getElementById('txt_CompName');
            var txtFirst = document.getElementById('txt_fName');
            var txtLast = document.getElementById('txt_lName');

            $(txtComp).val("").focus().blur();
            $(txtFirst).val("").focus().blur();
            $(txtLast).val("").focus().blur();

            $('#txtClearAccName').attr("disabled", "disabled");

            txtComp.disabled = false;
            txtFirst.disabled = false;
            txtLast.disabled = false;
        });

        /*TEXT CLEAR BUTTON*/

        //$('#txtHTSearch').ready(function () {
        //    setPositionSizes('btnSearch');
        //});

        //$('#imgDownArrow').ready(function () {
        //    setPositionSizes('imgDownArrow');
        //});

        $(window).resize(function () {
            setPositionSizes('searchDropdown');
            setPositionSizes('fiveDiv');
            setPositionSizes('imgDownArrow');
            setPositionSizes('HTSearchClear');
        });

        function setPositionSizes(object) {
            var textboxPosition = $('#txtHTSearch').position();
            var textboxWidth = $('#txtHTSearch').width();
            var searchDropdownWidth = $('#searchDropdown').width();

            switch (object) {
                case 'fiveDiv':
                    var textboxHeight = $('#txtHTSearch').height();
                    $('#fiveDiv').css({
                        'width': textboxWidth + +searchDropdownWidth + 6,
                        'top': textboxPosition.top + textboxHeight + 4,
                        'left': textboxPosition.left
                    });
                    break;
                case 'imgDownArrow':
                    var downArrowWidth = $('#imgDownArrow').width();
                    $('#imgDownArrow').css({
                        'position': 'absolute',
                        'top': textboxPosition.top + 8,
                        'left': (textboxPosition.left + textboxWidth + searchDropdownWidth) - (downArrowWidth + 10)
                    });
                    break;
                case 'HTSearchClear':
                    var downArrowWidth = $('#imgDownArrow').width();
                    var clearButtonWidth = $('#HTSearchClear').width();
                    $('#HTSearchClear').css({
                        'position': 'absolute',
                        'top': textboxPosition.top + 8,
                        'left': (textboxPosition.left + textboxWidth + searchDropdownWidth) - (downArrowWidth + clearButtonWidth + 25)
                    });
                    break;
                case 'searchDropdown':
                    var textboxHeight = $('#txtHTSearch').height();
                    if (browser === "Netscape") {
                        $('#searchDropdown').css({
                            //'left': textboxPosition.left,
                            'top': textboxPosition.top
                        });
                    }
                    else if (browser === "Microsoft Internet Explorer") {
                        $('#searchDropdown').css({
                            'top': textboxPosition.top,
                            //'left': textboxPosition.left,
                        });
                    }
                    break;
            }
        }

        displayPreviousSearches();

        function setPreviousSearches() {
            previousSearches = JSON.parse(sessionStorage.getItem('previousSearches'));
            if (previousSearches == null) {
                previousSearches = [];
            }

            var previousSearchesAccNos = [];
            for (var i = 0; i < previousSearches.length; i++) {
                //previousSearchesAccNos.push(parseInt(previousSearches[i].AccountNo)); Changed, 09/24 Rachel [DE51 fix]
                previousSearchesAccNos.push(previousSearches[i].AccountNo);
            }

            for (var i = 0; i < selectedResultsArray.length; i++) {
                //var number = parseInt(selectedResultsArray[i].AccountNo); Changed, 09/24 Rachel [DE51 fix]
                var number = selectedResultsArray[i].AccountNo;
                var previous = {
                    AccountName: selectedResultsArray[i].AccountName,
                    AccountNo: selectedResultsArray[i].AccountNo,
                    BTN: selectedResultsArray[i].BTN,
                    AccountType: selectedResultsArray[i].AccountType
                }

                if (previousSearchesAccNos.indexOf(number) < 0) {
                    previousSearches.unshift(previous);
                } else {
                    for (var j = 0; j < previousSearches.length; j++) {
                        if (previousSearches[j].AccountNo == number) {
                            previousSearches.splice(j, 1);
                            previousSearches.unshift(previous);
                        }
                    }
                }

                if (previousSearches.length > 5) {
                    previousSearches.pop();
                }
            }

            sessionStorage.setItem('previousSearches', JSON.stringify(previousSearches));

            displayPreviousSearches();
        }
        //UPDATED BY EDD 9/19/2014
        $('#imgDownArrow').click(function () {
            setPositionSizes('fiveDiv');
            //$('#fiveDiv').slideToggle(100);
            var e = document.getElementById('fiveDiv');
            if (e.style.display === 'block')
                e.style.display = 'none';
            else
                e.style.display = 'block';
        });

        $(document).mouseup(function (e) {
            var container = $("#fiveDiv");
            var container2 = $("#fiveDiv_label");
            var container3 = $(".search-list-header");
            var container4 = $('#search-list');
            var container5 = $('#imgDownArrow');
            var container6 = $('#search-list li');
            var container7 = $('.search-item-header');
            var container8 = $('.search-item-header span');

            if (!container.is(e.target) && !container2.is(e.target) && !container3.is(e.target) && !container4.is(e.target) && !container5.is(e.target) && !container6.is(e.target))  // if the target of the click isn't the container...
            {
                container.hide();
            }
        });
        //UPDATED BY EDD 9/19/2014 - END

        function displayPreviousSearches() {
            if ($('#search-list li').length > 0) {
                $('#search-list li').remove();
            }

            previousSearches = JSON.parse(sessionStorage.getItem('previousSearches'));
            if (previousSearches == null) {
                previousSearches = [];
            }

            for (var i = 0; i < previousSearches.length; i++) {
                var searchList = document.getElementById('search-list');
                var listItem = document.createElement('li');
                listItem.setAttribute('id', 'search_item_' + i);
                var accName = truncate(previousSearches[i].AccountName, 47);
                listItem.innerHTML = '<h2 class="search-item-header" id="search_header_' + i + '"><span id="search_name_' + i + '">' + accName + '</span> - <span id="search_num_' + i + '">' + previousSearches[i].AccountNo + '</span></h2>';
                searchList.appendChild(listItem);

                $('#search_header_' + i).click(function () {
                    previousSearchesIndex = this.id.replace(/\D/g, '');
                    //previousSearchesNumber = parseInt(previousSearches[previousSearchesIndex].AccountNo); Changed, 09/24 Rachel [DE51 fix]
                    previousSearchesNumber = previousSearches[previousSearchesIndex].AccountNo;
                    selectedViaLink = previousSearches[previousSearchesIndex].AccountNo;
                    openPreviouslyOpenedDashboard();
                    selectedViaLink = "";
                });
            }
        }

        function openPreviouslyOpenedDashboard() {
            selectedResultsArray = JSON.parse(sessionStorage.getItem('selectedResultsArray'));
            if (selectedResultsArray == null) {
                selectedResultsArray = [];
            }

            var selectedAccNos = [];
            for (var i = 0; i < windows.length; i++) {
                if (windows[i] && !windows[i].closed) {
                    var path = windows[i].location.search.split("|");
                    //selectedAccNos.push(parseInt(path[0].replace(/[^0-9]/g, '')));    Changed, 09/24 Rachel [DE51 fix]
                    selectedAccNos.push(path[0].replace(/[^0-9]/g, ''));
                }
            }

            if (selectedAccNos.indexOf(previousSearchesNumber) >= 0) {
                openDashboardWindows(selectedResultsArray, 1);
            } else {
                for (var y = 0; y < windows.length; y++) {
                    if ((windows[y].closed || !windows[y]) && selectedResultsArray != null) {
                        selectedResultsArray[y] = false;
                    }
                }

                selectedResultsArray = removeFalse(selectedResultsArray);

                if (selectedResultsArray.length != 3) {
                    var index = previousSearchesIndex;
                    var number = previousSearches[index].AccountNo;
                    var name = previousSearches[index].AccountName;
                    var telephone = previousSearches[index].BTN;
                    var type = previousSearches[index].AccountType;

                    var selected =
                    {
                        AccountName: name,
                        AccountNo: number,
                        BTN: telephone,
                        AccountType: type
                    }

                    selectedResultsArray.push(selected);
                    selected = null;

                    openDashboardWindows(selectedResultsArray, 1);
                } else {
                    maxDashAlert();
                }
            }
        }

        function truncate(string, len) {
            var word = decodeURI(string);
            if (word.length > len)
                return word.substring(0, len) + '...';
            else
                return word;
        };

        function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

    });
}