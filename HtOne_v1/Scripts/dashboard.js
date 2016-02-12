function initialize() {
    var FacsDataArray = [];
    
    $(document).ready(function () {
        /*---- Loader ----*/
        function ajaxindicatorstart(text) {
            if (jQuery('body').find('#resultLoading').attr('id') != 'resultLoading') {
                jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="Images/ajax-loader.gif"><div>' + text + '</div></div><div class="bg"></div></div>');
            }

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

            jQuery('#resultLoading .bg').css({
                'background': '#000000',
                'opacity': '1',
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

        jQuery(document).ajaxStart(function () {
            ajaxindicatorstart('Loading');
        }).ajaxStop(function () {
            ajaxindicatorstop();
        });
        /*------ end ------*/

        var tabTopLength = ['4em','7.9em', '11.9em', '15.9em', '19.9em', '23.6em'];

        var accountNumber = queryString("num");
        var accountNm = queryString("accountName");
        var accountBtn = queryString("btn");
        var accountType = queryString("accountType");

        var lblAccountNumber = document.getElementById("widget_accountNum");
        lblAccountNumber.innerHTML = accountNumber;

        var lblAccountName = document.getElementById("widget_accountName");
        lblAccountName.textContent = decodeURI(accountNm);

        var lblWidget_btnNo = document.getElementById("widget_btnNo");
        lblWidget_btnNo.innerHTML = decodeURI(accountBtn);

        var lblAccountType = document.getElementById("widget_accountType");
        lblAccountType.innerHTML = accountType;
        if (accountType.toLowerCase().indexOf('parent') >= 0) {
            $('#widget_accountType').parent('p').append('<p class="child_info">To view child accounts, please see <span class="child_info_prodLink">Products & Services</span>.</p>');
            $('#accountType').parent('p').append('<p class="child_info">To view child accounts, please see <span class="child_info_prodLink" onclick="document.getElementById(\'products-widget\').click();">Products & Services</span>.</p>');

            // josef commented 11/25/2014
            //$('#accountType').parent('p').csss('font-size', '85%');
        }

        var showFacilities_id = ["1", "23"];
        var showFacilities_desc = ["POTS", "HSI"];

        var FACSDropdownArray = [];

        var ifProperlySetup = false;

        var ifMultiple_FACS = false;
        var others = [];    //container for values from different SP results
        others["ifWithOtherServices"] = false;

        var childAccountInfo = [];
        var parentAccountArray = [];


        vm = new ViewModel(accountNumber);
        ko.applyBindings(vm);

     
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
                        "font-weight" : "normal",
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
        }
        $.ajax({
            url: 'api/Ticker/GetAllTickers',
            global: false,
            success: function (data) {
                
                $.each(data, function (i, tickInfo) {

                    var tickInfoMapped = new TickerInfo(tickInfo.MSG_ID, tickInfo.ADDED_ON, tickInfo.ADDED_BY, tickInfo.MSG_TYPE, tickInfo.MSG_DESCR, tickInfo.MSG_STATUS, tickInfo.MODIFIED_BY, vm.formatDate(tickInfo.MODIFIED_ON));
                    //var tickInfoMapped = new TickerInfo(tickInfo.TickerInfoId, tickInfo.CreateDate, tickInfo.AddedBy, tickInfo.ItemType, tickInfo.Description, tickInfo.Status, tickInfo.LastModBy, model.formatDate(tickInfo.LastModDate));
                    vm.TickerInfos.push(tickInfoMapped);

                });

                $('.marquee').html($('.hidden_tickers').contents());
                $('.marquee').marquee({
                    pauseOnHover: true,
                    //duplicated: true,
                    duration: 15000
                });

            },
            error: function (xhr, textStatus, errorThrown) {
                alert(JSON.parse(xhr.responseText).responseText)
            }
        });

        var PermNotes;
        var url = "api/htaccount/CustomerInfo?id=" + accountNumber + "&accountName=" + decodeURI(accountNm) + "&btn=" + accountBtn + "&accountType=" + accountType;
        $.ajax({
            type: "GET",
            url: url,
            success: function (Data) {
                for (var i = 0; i < Data.length; i++) {
                    /*---- Customer Information ----*/

                    //parent account info
                    if (accountType.toLowerCase().indexOf('child') >= 0) {
                        //$('#widget_accountType').parent('p').append('<p style="font-size: 100%;">Parent Account: <span class="parent_dashLink" onclick="openDashboardWindow(parentAccountArray, parent);">' + Data[i].ParentAcctNo + '</span></p>');  // Rachel, 09/25 [DE31]
                        $('#widget_accountType').parent('p').append('<p style="font-size: 100%;">Parent Account: <span class="parent_dashLink" id="parent_dashLink_overview">' + Data[i].ParentAcctNo + '</span></p>');
                        $('#accountType').parent('p').append('<p style="font-weight: bold;">Parent Account: <span class="parent_dashLink" id="parent_dashLink_detailed">' + Data[i].ParentAcctNo + '</span></p>');

                        $('#parent_dashLink_detailed').click(function () {
                            openDashboardWindow(parentAccountArray, 'parent');
                        });

                        $('#parent_dashLink_overview').click(function () {  // Rachel, 09/25 [DE31]
                            openDashboardWindow(parentAccountArray, 'parent');
                        });

                        parentAccountArray.ParentAcctNo = Data[i].ParentAcctNo;
                        parentAccountArray.ParentAcctName = Data[i].ParentAcctName;
                        parentAccountArray.ParentBTN = Data[i].ParentBTN;
                        parentAccountArray.ParentAccountType = Data[i].ParentAccountType;
                    }

                    // -- overview data 
                    var lblAccountStatus = document.getElementById("widget_accountStatus");
                    if (typeof Data[i].AccountStatus === "undefined" || Data[i].AccountStatus == null) {
                        lblAccountStatus.innerHTML = "";
                    } else {
                        lblAccountStatus.innerHTML = Data[i].AccountStatus;
                    }

                    var lblAuthorizedParties = document.getElementById("widget_authorizedParties");
                    if (typeof Data[i].AuthorizedParties === "undefined" || Data[i].AuthorizedParties == null) {
                        lblAuthorizedParties.innerHTML = "";
                    } else {
                        var parties = Data[i].AuthorizedParties.split("|");
                        if (parties.length > 1) {
                            lblAuthorizedParties.innerHTML = "Multiple";
                        } else {
                            lblAuthorizedParties.innerHTML = Data[i].AuthorizedParties;
                        }
                    }

                    var lblAccountStarted = document.getElementById("widget_accountStarted");
                    if (typeof Data[i].AccountStartDate === "undefined" || Data[i].AccountStartDate == null) {
                        lblAccountStarted.innerHTML = "";
                    } else {
                        var convertedDate = convertDateFormat(Data[i].AccountStartDate);
                        lblAccountStarted.innerHTML = convertedDate;
                    }

                    var lblSharedPassword = document.getElementById("widget_sharedPassword");
                    if (typeof Data[i].Password === "undefined" || Data[i].Password == null) {
                        lblSharedPassword.innerHTML = "";
                    } else {
                        lblSharedPassword.innerHTML = Data[i].Password;
                    }

                    var lblSharedQuestion = document.getElementById("widget_sharedQuestion");
                    if (typeof Data[i].Question === "undefined" || Data[i].Question == null) {
                        lblSharedQuestion.innerHTML = "";
                    } else {
                        lblSharedQuestion.innerHTML = Data[i].Question;
                    }

                    var lblSharedAnswer = document.getElementById("widget_sharedAnswer");
                    if (typeof Data[i].Answer === "undefined" || Data[i].Answer == null) {
                        lblSharedAnswer.innerHTML = "";
                    } else {
                        lblSharedAnswer.innerHTML = Data[i].Answer;
                    }

                    var lblServiceAddress = document.getElementById("widget_serviceAddress");
                    var lblServiceAddressText = document.getElementById("widget_serviceAddressLbl");
                    if (typeof Data[i].Sites === "undefined" || Data[i].Sites == null || Data[i].Sites.length == 0) {
                        lblServiceAddress.innerHTML = "";
                        lblServiceAddress.style.display = "none";
                        lblServiceAddressText.style.display = "none";
                    } else {
                        var array = Data[i].Sites;
                        if (array.length > 1) {
                            lblServiceAddress.innerHTML = "Multiple";
                        }
                        else {
                            lblServiceAddress.innerHTML = Data[i].Sites;
                        }
                    }

                    var lblBTN = document.getElementById("widget_btnNo");
                    var lblBTNText = document.getElementById("widget_btnNoLbl");
                    if (typeof Data[i].Btn === "undefined" || Data[i].Btn == null || Data[i].Btn.length == 0) {
                        lblBTN.innerHTML = "";
                        lblBTN.style.display = "none";
                        lblBTNText.style.display = "none";
                    } else {
                        lblBTN.innerHTML = Data[i].Btn;
                    }

                    var lblWidget_cktId = document.getElementById("widget_cktId");
                    var lblWidget_cktIdText = document.getElementById("widget_cktIdLbl");
                    if (typeof Data[i].CircuitIds === "undefined" || Data[i].CircuitIds == null || Data[i].CircuitIds.length == 0) {
                        lblWidget_cktId.innerHTML = "";
                        lblWidget_cktId.style.display = "none";
                        lblWidget_cktIdText.style.display = "none";
                    } else {
                        if (Data[i].CircuitIds.length > 1) {
                            lblWidget_cktId.innerHTML = "Multiple";
                        }
                        else {
                            lblWidget_cktId.innerHTML = Data[i].CircuitIds[0];
                        }
                    }

                    var lblWidget_winbackPorted = document.getElementById("widget_winbackPorted");
                    if (typeof Data[i].Winback === "undefined" || Data[i].Winback == null) {
                        lblWidget_winbackPorted.innerHTML = "";
                    } else {
                        lblWidget_winbackPorted.innerHTML = Data[i].Winback;
                    }

                    // -- detailed info
                    var detailedAccountName = document.getElementById("accountName");
                    if (typeof decodeURI(accountNm) === "undefined" || decodeURI(accountNm) == null) {
                        detailedAccountName.innerHTML = "";
                    } else {
                        detailedAccountName.textContent = decodeURI(accountNm);
                    }

                    var detailedAccountNum = document.getElementById("accountNum");
                    if (typeof Data[i].CustomerInfoDetail.id === "undefined" || Data[i].CustomerInfoDetail.id == null) {
                        detailedAccountNum.innerHTML = "";
                    } else {
                        detailedAccountNum.innerHTML = Data[i].CustomerInfoDetail.id;
                    }

                    var detailedClassOfService = document.getElementById("classOfService");
                    if (typeof Data[i].ClassOfService === "undefined" || Data[i].ClassOfService == null) {
                        detailedClassOfService.innerHTML = "";
                    } else {
                        detailedClassOfService.innerHTML = Data[i].ClassOfService
                    }

                    var detailedAccountType = document.getElementById("accountType");
                    detailedAccountType.innerHTML = accountType;

                    var detailedlblAccountStatus = document.getElementById("lblAccountStatus");
                    var detailedAccountStatus = document.getElementById("accountStatus");
                    if (typeof Data[i].AccountStatus === "undefined" || Data[i].AccountStatus == null) {
                        detailedAccountStatus.innerHTML = "";
                    } else {
                        detailedAccountStatus.innerHTML = Data[i].AccountStatus;
                        if (Data[i].AccountStatus === "Active") {
                            detailedAccountStatus.style.color = "YellowGreen";
                            detailedAccountStatus.style.fontWeight = "Bold";
                            detailedlblAccountStatus.style.color = "YellowGreen";
                        }
                        else {
                            detailedAccountStatus.style.color = "#D63030";
                            detailedAccountStatus.style.fontWeight = "Bold";
                            detailedlblAccountStatus.style.color = "#D63030";
                        }
                    }

                    var detailedAccountStarted = document.getElementById("accountStartDate");
                    if (typeof Data[i].AccountStartDate === "undefined" || Data[i].AccountStartDate == null) {
                        detailedAccountStarted.innerHTML = "";
                    } else {
                        var convertedDate = convertDateFormat(Data[i].AccountStartDate);
                        detailedAccountStarted.innerHTML = convertedDate;
                    }

                    var detailedAccountBalance = document.getElementById("accountBalance");
                    if (typeof Data[i].AccountBalance === "undefined" || Data[i].AccountBalance == null) {
                        detailedAccountBalance.innerHTML = "";
                    } else {
                        var balance_float = parseFloat(Data[i].AccountBalance.substring(1));
                        var balance_str = "$" + balance_float.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        detailedAccountBalance.innerHTML = balance_str;
                    }

                    var detailedLastPaymentMadeAmt = document.getElementById("lastPaymentMade_amt");
                    if (typeof Data[i].CustomerInfoDetail.Payments === "undefined" || Data[i].CustomerInfoDetail.Payments == null || Data[i].CustomerInfoDetail.Payments.length == 0) {
                        detailedLastPaymentMadeAmt.innerHTML = "None";
                    } else {
                        var index = Data[i].CustomerInfoDetail.Payments.length - 1;
                        var pay = Data[i].CustomerInfoDetail.Payments[index].Amount;
                        var pay_float = parseFloat(pay.substring(1));
                        var pay_str = "$" + pay_float.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        detailedLastPaymentMadeAmt.innerHTML = pay_str;
                    }

                    var detailedLastPaymentMade = document.getElementById("lastPaymentMade_date");
                    if (typeof Data[i].CustomerInfoDetail.Payments === "undefined" || Data[i].CustomerInfoDetail.Payments == null || Data[i].CustomerInfoDetail.Payments.length == 0) {
                        detailedLastPaymentMade.innerHTML = "";
                    } else {
                        var index = Data[i].CustomerInfoDetail.Payments.length - 1;
                        detailedLastPaymentMade.innerHTML = Data[i].CustomerInfoDetail.Payments[index].PostedDate;
                    }

                    var authorizedParties = document.getElementById("authorizedParties");
                    authorizedParties.style.listStyleType = "none";
                    if (typeof Data[i].AuthorizedParties === "undefined" || Data[i].AuthorizedParties == null) {
                        var listItem = document.createElement('li');
                        listItem.innerHTML = '<li><p><span></span></p></li>';
                        authorizedParties.appendChild(listItem);
                    } else {
                        var parties = Data[i].AuthorizedParties.split("|");
                        if (parties.length > 1) {
                            for (var a = 0, count = 1; a < parties.length; a++, count++) {
                                var listItem = document.createElement('li');
                                listItem.innerHTML = '<p><span id="authorized_' + a + '">' + parties[a] + '</span></p>';
                                authorizedParties.appendChild(listItem);
                            }
                        } else {
                            var listItem = document.createElement('li');
                            listItem.innerHTML = '<p><span id="authorized_0">' + Data[i].AuthorizedParties + '</span></p>';
                            authorizedParties.appendChild(listItem);
                        }
                    }

                    var detailedSharedPassword = document.getElementById("sharedPassword");
                    if (typeof Data[i].Password === "undefined" || Data[i].Password == null) {
                        detailedSharedPassword.innerHTML = "";
                    } else {
                        detailedSharedPassword.innerHTML = Data[i].Password;
                    }

                    var detailedSharedQuestion = document.getElementById("sharedQuestion");
                    if (typeof Data[i].Question === "undefined" || Data[i].Question == null) {
                        detailedSharedQuestion.innerHTML = "";
                    } else {
                        detailedSharedQuestion.innerHTML = Data[i].Question;
                    }

                    var detailedSharedAnswer = document.getElementById("sharedAnswer");
                    if (typeof Data[i].Answer === "undefined" || Data[i].Answer == null) {
                        detailedSharedAnswer.innerHTML = "";
                    } else {
                        detailedSharedAnswer.innerHTML = Data[i].Answer;
                    }

                    var detailedCustomContactInfo = document.getElementById("customContactInfo");
                    if (!(typeof Data[i].ContactInfo === "undefined" || Data[i].ContactInfo == null || Data[i].ContactInfo == "")
                        && (Data[i].ContactInfo.replace(/\D/g, '') != "")) {
                        var contactInfo = Data[i].ContactInfo;
                        contactInfo = contactInfo.replace(/[^0-9a-zA-Z]+/g, '');
                        detailedCustomContactInfo.innerHTML = contactInfo.replace(/\D/g, '');
                    } else if (!(typeof Data[i].OrderPhone === "undefined" || Data[i].OrderPhone == null || Data[i].OrderPhone == "")
                        && (Data[i].OrderPhone.replace(/\D/g, '') != "")) {
                        var orderPhone = Data[i].OrderPhone;
                        detailedCustomContactInfo.innerHTML = orderPhone.replace(/\D/g, '');
                    } else if (!(typeof Data[i].Email === "undefined" || Data[i].Email == null || Data[i].Email == "")) {
                        detailedCustomContactInfo.innerHTML = Data[i].Email;
                    } else if (!(typeof Data[i].OrderEmail === "undefined" || Data[i].OrderEmail == null || Data[i].OrderEmail == "")) {
                        detailedCustomContactInfo.innerHTML = Data[i].OrderEmail;
                    } else {
                        detailedCustomContactInfo.innerHTML = "";
                    }

                    setPerm(Data[i].CustomerInfoDetail.Notes);
                    //var permNotes = document.getElementById("permNotes");
                    //if (typeof Data[i].CustomerInfoDetail.Notes === "undefined" || Data[i].CustomerInfoDetail.Notes == null || Data[i].CustomerInfoDetail.Notes.length == 0) {
                    //    var listItem = document.createElement('li');
                    //    listItem.innerHTML = '<li><p><span>None</span></p></li>';
                    //    permNotes.appendChild(listItem);
                    //    //$("#permNotes ul").append(newHTML);
                    //    permNotes.style.listStyleType = "none";
                    //} else {
                    //    others["permNotes"] = [];
                    //    for (var a = 0, count = 1; a < Data[i].CustomerInfoDetail.Notes.length; a++, count++) {
                    //        var listItem = document.createElement('li');

                    //        others["permNotes"].push(Data[i].CustomerInfoDetail.Notes[a].Note_Description);
                    //        if (Data[i].CustomerInfoDetail.Notes[a].Note_User == "HT_CONV_CBSS") {
                    //            var link = "CONVERSION";
                    //        } else {
                    //            var link = truncate(Data[i].CustomerInfoDetail.Notes[a].Note_Description, 30);
                    //        }

                    //        listItem.innerHTML = '<p><span id="permNote_date_' + a + '">' + Data[i].CustomerInfoDetail.Notes[a].Note_Date + ' - <span id="permNote_person_' + a + '">' + Data[i].CustomerInfoDetail.Notes[a].Note_User + '</span> - <span id="permNote_comment_' + a + '" class="permNote_link">' + link + '</span></p>';
                    //        permNotes.appendChild(listItem);

                    //        $("#permNote_comment_" + a).click(function (event) {
                    //            var index = this.id.replace(/\D/g, '');
                    //            $('#permNotes_comments').val(others["permNotes"][index]);
                    //        });

                    //        if (count == 3) {
                    //            break;
                    //        }
                    //    }

                    //    var permNotes_comments = document.createElement("textarea");
                    //    permNotes_comments.id = "permNotes_comments";
                    //    permNotes_comments.readOnly = true;
                    //    permNotes.appendChild(permNotes_comments);
                    //}

                    var detailedIWMP = document.getElementById("iwmp");
                    var detailedTSP = document.getElementById("tsp");
                    var detailedTollBlock = document.getElementById("tollBlock");
                    if (typeof Data[i].CustomerInfoDetail.VMFlagTypes === "undefined" || Data[i].CustomerInfoDetail.VMFlagTypes == null) {
                        detailedIWMP.innerHTML = "";
                        detailedTSP.innerHTML = "";
                        detailedTollBlock.innerHTML = "";
                    } else {
                        for (var vm = 0; vm < Data[i].CustomerInfoDetail.VMFlagTypes.length; vm++) {
                            detailedIWMP.innerHTML = Data[i].CustomerInfoDetail.VMFlagTypes[vm].IWMP;
                            detailedTSP.innerHTML = Data[i].CustomerInfoDetail.VMFlagTypes[vm].TSP;
                            detailedTollBlock.innerHTML = Data[i].CustomerInfoDetail.VMFlagTypes[vm].Toll_Block;
                        }

                    }

                    var detailedCpeContracts = document.getElementById("cpeContracts");
                    if (typeof Data[i].CustomerInfoDetail.CPEs === "undefined" || Data[i].CustomerInfoDetail.CPEs == null) {
                        detailedCpeContracts.innerHTML = "";
                    } else {
                        var newHTML = "";
                        for (var cpe = 0; cpe < Data[i].CustomerInfoDetail.CPEs.length; cpe++) {
                            newHTML += '<p><span id="cpe_sid_' + cpe + '">' + Data[i].CustomerInfoDetail.CPEs[cpe].SID + ' </span><span id="cpe_contract' + cpe + '">' + Data[i].CustomerInfoDetail.CPEs[cpe].Contract + '</span><span id="cpe_contractInfo' + cpe + '"> - ' + Data[i].CustomerInfoDetail.CPEs[cpe].Contract_End_Date + '</span></p>';
                        }
                        $("#cpeContracts").html(newHTML);
                    }

                    var detailedProducts = document.getElementById("productsAvailable");
                    if (typeof Data[i].ServiceTypes === "undefined" || Data[i].ServiceTypes == null || Data[i].ServiceTypes.length == 0) {
                        detailedProducts.innerHTML = "";
                    } else {
                        var newHTML = [];
                        for (var x = 0; x < Data[i].ServiceTypes.length; x++) {
                            newHTML.push(" " + Data[i].ServiceTypes[x].Name);
                        }
                        detailedProducts.innerHTML = newHTML.join();
                    }

                    var detailedMultiTN = document.getElementById("multiTN");
                    if (typeof Data[i].TeleNos === "undefined" || Data[i].TeleNos == null) {
                        detailedMultiTN.innerHTML = "";
                    } else {
                        others["TeleNos"] = Data[i].TeleNos;
                        if (Data[i].TeleNos.length > 1) {
                            detailedMultiTN.innerHTML = "Y";
                        } else {
                            detailedMultiTN.innerHTML = "N";
                        }
                    }

                    var detailedMultiCKT = document.getElementById("multiCKT");
                    if (typeof Data[i].CircuitIds === "undefined" || Data[i].CircuitIds == null) {
                        detailedMultiCKT.innerHTML = "";
                    } else {
                        if (Data[i].CircuitIds.length > 1) {
                            detailedMultiCKT.innerHTML = "Y";
                        }
                        else {
                            detailedMultiCKT.innerHTML = "N";
                        }
                    }

                    var detailedMultiSites = document.getElementById("multiSites");
                    if (typeof Data[i].Sites === "undefined" || Data[i].Sites == null) {
                        detailedMultiSites.innerHTML = "";
                    } else {
                        if (Data[i].Sites.length > 1) {
                            detailedMultiSites.innerHTML = "Y";
                        }
                        else {
                            detailedMultiSites.innerHTML = "N";
                        }
                    }

                    var detailedMultiSites = document.getElementById("siteAddresses");
                    if (typeof Data[i].Sites === "undefined" || Data[i].Sites == null) {
                        detailedMultiSites.innerHTML = "";
                    } else {
                        var newHTML = "";
                        for (var site = 1, obj = 0; obj < Data[i].Sites.length; site++, obj++) {
                            newHTML = '<p><span>Address </span><span id="addressNum_' + obj + '">' + site + '</span>:  <span id="address_' + obj + '">' + Data[i].Sites[obj] + '</span></p>';
                            $("#siteAddresses").append(newHTML);
                        }
                    }

                    /*---- Products & Services ----*/
                    //-- widget                    
                    if ((typeof Data[i].ActiveServiceCount === "undefined" || Data[i].ActiveServiceCount == null || Data[i].ActiveServiceCount == "0")) {
                        if (accountType.toLowerCase().indexOf("parent") >= 0) {
                            ifProperlySetup = true;
                        }
                    }

                    if (ifProperlySetup == true) {
                        $('#products-contents').before('<p class="noProducts">No products and services found on this parent account</p>');
                        $('#products-contents').hide();

                        $('#products-tree').before('<p class="noProducts" style="margin-left: 1em;">No products and services found on this parent account</p>');

                        $('#facs-contents').before('<p class="noProducts">No facilities found on this parent account</p>');
                        $('#facs-contents').hide();
                        $('#facs-page').before('<p class="noProducts" style="margin-left: 1.5em;">No facilities found on this parent account</p>');
                        $('#facs-page').hide();
                    } else {
                        if (parseInt(Data[i].ActiveServiceCount) > 1 || (Data[i].Sites.length > 1) || (Data[i].TeleNos.length > 1)) {
                            ifMultiple_FACS = true;
                            $('#facs-contents').before('<p id="multiProducts"></p>');
                            $('#facs-contents').hide();
                        }

                        var widget_noCustomerSites = document.getElementById("widget_noCustomerSites");
                        if (typeof Data[i].Sites === "undefined" || Data[i].Sites == null || Data[i].Sites.length == 0) {
                            widget_noCustomerSites.innerHTML = 0;
                        } else {
                            widget_noCustomerSites.innerHTML = Data[i].Sites.length;
                        }

                        var lbl_service_type_quantity = document.getElementById("lbl_service_type_quantity");
                        var service_type_quantity = document.getElementById("service_type_quantity");
                        if (typeof Data[i].ServiceTypes === "undefined" || Data[i].ServiceTypes == null || Data[i].ServiceTypes.length == 0) {
                            lbl_service_type_quantity.style.display = "none";
                            service_type_quantity.style.display = "none";
                        } else {
                            lbl_service_type_quantity.style.display = "block";
                            service_type_quantity.style.display = "block";

                            others["ServiceTypes"] = Data[i].ServiceTypes;

                            var newHTML = "";
                            for (var x = 0; x < Data[i].ServiceTypes.length; x++) {
                                newHTML += '<p><span>' + Data[i].ServiceTypes[x].Name + '</span>: <span>' + Data[i].ServiceTypes[x].Count + '</span></p>';
                            }
                            service_type_quantity.innerHTML = newHTML;
                        }

                        var widget_activeServices = document.getElementById("widget_activeServices");
                        if (typeof Data[i].ActiveServiceCount === "undefined" || Data[i].ActiveServiceCount == null) {
                            widget_activeServices.innerHTML = 0;
                        } else {
                            others["ActiveServiceCount"] = Data[i].ActiveServiceCount;
                            widget_activeServices.innerHTML = Data[i].ActiveServiceCount;
                        }

                        var widget_suspendedServices = document.getElementById("widget_suspendedServices");
                        if (typeof Data[i].SuspendedServiceCount === "undefined" || Data[i].SuspendedServiceCount == null) {
                            widget_suspendedServices.innerHTML = 0;
                        } else {
                            widget_suspendedServices.innerHTML = Data[i].SuspendedServiceCount;
                        }

                        getProductsAndServices();
                    }

                    getCaseOrder();
                }
            },
            dataType: "json",
            cache: false
        });

        function setPerm(data) {
            vm.PermContainer(data || "");
            vm.InitPerm();
        };

        function getCaseOrder() {
            var url = "api/htaccount/GetCaseOrder?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (Data) {
                  
                    // Added by DJ 09/30/2014
                    vm.InitializeKO(Data);
                    vm.filterStatus();

                    var widget_pendingCases = document.getElementById("widget_pendingCases");
                    if (typeof Data.cases === "undefined" || Data.cases == null) {
                        widget_pendingCases.innerHTML = 0;
                    } else {
                        widget_pendingCases.innerHTML = Data.cases.length;
                    }

                    var widget_pendingOrders = document.getElementById("widget_pendingOrders");
                    widget_pendingOrders.innerHTML = Data.orders[0] ? Data.orders[0].Order_Count || '0' : '0'; // Changed code. 11/10/2014

                },
                dataType: "json",
                cache: false
            });
        }

        function getProductsAndServices() {
            var url = "api/htaccount/GetProductsAndServices?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (Data) {
                    var organized = [];

                    var mainTree = document.getElementById("products-tree");
                    var mainList = document.createElement('li');
                    mainList.innerHTML = '<p id="products_label">Products & Services</p><br/>'; //Rachel, 09/25 [Product Tree, <br/>]
                    var productsTree = document.createElement('ul'); 

                    var categoryTree = document.createElement('ul');
                    var typeTree = document.createElement('ul');
                    var componentTree = document.createElement('ul');
                    var addressList;
                    var address, category, type;

                    for (var j = 0; j < Data.length; j++) {
                        if (Data[j].Service_Type == 'Centrex' && crmCtxTn.indexOf(Data[j].Service_Id) < 0)
                            crmCtxTn.push(Data[j].Service_Id);
                        address = Data[j].Address.trim();
                        if (address == "") {
                            address = "_";
                        }

                        var serviceId = Data[j].Service_Id.replace(/\s/g, '').replace(/\.$/, '');
                        Data[j].Service_Id = serviceId;

                        if (!(typeof organized[address] === undefined || organized[address] == null)) {
                            category = Data[j].Category.toString();
                            if (!(typeof organized[address][category] === undefined || organized[address][category] == null)) {
                                type = Data[j].Service_Type.toString();
                                if (!(typeof organized[address][category][type] === undefined || organized[address][category][type] == null)) {
                                    var id = Data[j].Service_Id.toString();
                                    if (!(typeof organized[address][category][type][id] === undefined || organized[address][category][type][id] == null)) {
                                        addressList = document.getElementById(address);
                                        categoryTree = addressList.getElementsByClassName(category);
                                        typeTree = categoryTree[0].getElementsByClassName(type);
                                        componentTree = typeTree[0].getElementsByClassName(id)[0];

                                        componentList = document.createElement('li');
                                        var componentItem = document.createElement('p');
                                        componentItem.innerHTML = Data[j].Component;
                                        componentList.appendChild(componentItem);
                                        componentTree.appendChild(componentList);
                                        var br = document.createElement('br');
                                        componentTree.appendChild(br);

                                        var component = Data[j].Component.toString();
                                        organized[address][category][type][id].push(component);
                                    } else {
                                        addressList = document.getElementById(address);
                                        categoryTree = addressList.getElementsByClassName(category);
                                        typeTree = categoryTree[0].getElementsByClassName(type);
                                        //typeTree = typeTree[0].childNodes[0].childNodes[1];
                                        typeTree = typeTree[0].getElementsByTagName('li')[0].getElementsByTagName('ul')[0];

                                        var idList = document.createElement('li');
                                        var idPara = document.createElement('p');
                                        var idSpan = document.createElement('span');
                                        idSpan.className = "serviceId";
                                        idSpan.innerHTML = Data[j].Service_Id + " ";


                                        ////josef test pic link


                                        //var showPics = document.createElement('span');
                                        //showPics.innerHTML = "PICs";
                                        //showPics.className = 'pics';
                                        //idPara.appendChild(showPics);
                                        //idPara.insertBefore(idSpan, idPara.childNodes[0]);

                                        //// end josef

                                        idPara = ifShowFacilities(j);

                                        componentTree = document.createElement('ul');
                                        componentTree.className = Data[j].Service_Id + " serviceComponents";
                                        componentList = document.createElement('li');
                                        var componentItem = document.createElement('p');
                                        componentItem.innerHTML = Data[j].Component;
                                        componentList.appendChild(componentItem);
                                        componentTree.appendChild(componentList);
                                        var br = document.createElement('br');
                                        componentTree.appendChild(br);

                                        idList.appendChild(componentTree);
                                        var br = document.createElement('br');
                                        idList.insertBefore(br, idList.childNodes[0]);
                                        idList.insertBefore(idPara, idList.childNodes[0]);

                                        var br = document.createElement('br');
                                        typeTree.appendChild(br);

                                        typeTree.appendChild(idList);


                                        var componentArray = [];
                                        componentArray.push(Data[j].Component);
                                        organized[address][category][type][id] = componentArray;
                                    }
                                } else {
                                    addressList = document.getElementById(address);
                                    categoryTree = addressList.getElementsByClassName(category);
                                    categoryTree = categoryTree[0].childNodes[0];

                                    typeTree = document.createElement('ul');
                                    typeTree.className = Data[j].Service_Type;

                                    var typeList = document.createElement('li');
                                    typeList.className = "serviceType";
                                    var typePara = document.createElement('p');
                                    var typeLabel = document.createElement('span');
                                    typeLabel.innerHTML = Data[j].Service_Type;
                                    var typeCount = document.createElement('span');
                                    typeCount.innerHTML = " (1)";
                                    typePara.appendChild(typeCount);
                                    typePara.insertBefore(typeLabel, typeCount);

                                    idTree = document.createElement('ul');
                                    idTree.className = "serviceIdTree";
                                    var idList = document.createElement('li');
                                    var idPara = document.createElement('p');
                                    var idSpan = document.createElement('span');
                                    idSpan.className = "serviceId";
                                    idSpan.innerHTML = Data[j].Service_Id + " ";


                                    ////josef test pic link

                                    //var showPics = document.createElement('span');
                                    //showPics.innerHTML = "PICs";
                                    //showPics.className = 'pics';
                                    //idPara.appendChild(showPics);
                                    //idPara.insertBefore(idSpan, idPara.childNodes[0]);

                                    //// end josef

                                    idPara = ifShowFacilities(j);

                                    componentTree = document.createElement('ul');
                                    componentTree.className = Data[j].Service_Id + " serviceComponents";
                                    componentList = document.createElement('li');
                                    var componentItem = document.createElement('p');
                                    componentItem.innerHTML = Data[j].Component;
                                    componentList.appendChild(componentItem);
                                    componentTree.appendChild(componentList);
                                    var br = document.createElement('br');
                                    componentTree.appendChild(br);

                                    idList.appendChild(componentTree);
                                    var br = document.createElement('br');
                                    idList.insertBefore(br, idList.childNodes[0]);
                                    idList.insertBefore(idPara, idList.childNodes[0]);
                                    idTree.appendChild(idList);

                                    typeList.appendChild(idTree);
                                    var br = document.createElement('br');
                                    typeList.insertBefore(br, typeList.childNodes[0]);
                                    typeList.insertBefore(typePara, typeList.childNodes[0]);
                                    typeTree.appendChild(typeList);

                                    categoryTree.appendChild(typeTree);

                                    var componentArray = [];
                                    componentArray.push(Data[j].Component);

                                    var idArray = {};
                                    idArray[Data[j].Service_Id] = componentArray;

                                    organized[address][category][type] = idArray;
                                }
                            } else {
                                addressList = document.getElementById(address);
                                categoryTree = document.createElement('ul');
                                categoryTree.className = Data[j].Category;

                                var categoryList = document.createElement('li');
                                categoryList.className = "serviceCategory";
                                var categoryPara = document.createElement('p');
                                var categoryLabel = document.createElement('span');
                                categoryLabel.innerHTML = Data[j].Category;
                                var categoryCount = document.createElement('span');
                                categoryCount.innerHTML = " (1)";
                                categoryPara.appendChild(categoryCount);
                                categoryPara.insertBefore(categoryLabel, categoryCount);

                                typeTree = document.createElement('ul');
                                typeTree.className = Data[j].Service_Type;
                                var typeList = document.createElement('li');
                                typeList.className = "serviceType";
                                var typePara = document.createElement('p');
                                var typeLabel = document.createElement('span');
                                typeLabel.innerHTML = Data[j].Service_Type;
                                var typeCount = document.createElement('span');
                                typeCount.innerHTML = " (1)";
                                typePara.appendChild(typeCount);
                                typePara.insertBefore(typeLabel, typeCount);

                                idTree = document.createElement('ul');
                                idTree.className = "serviceIdTree";
                                var idList = document.createElement('li');
                                var idPara = document.createElement('p');
                                var idSpan = document.createElement('span');
                                idSpan.className = "serviceId";
                                idSpan.innerHTML = Data[j].Service_Id + " ";

                                ////josef test pic link

                                //var showPics = document.createElement('span');
                                //showPics.innerHTML = "PICs";
                                //showPics.className = 'pics';
                                //idPara.appendChild(showPics);
                                //idPara.insertBefore(idSpan, idPara.childNodes[0]);

                                //// end josef


                                idPara = ifShowFacilities(j);

                                componentTree = document.createElement('ul');
                                componentTree.className = Data[j].Service_Id + " serviceComponents";
                                componentList = document.createElement('li');
                                var componentItem = document.createElement('p');
                                componentItem.innerHTML = Data[j].Component;
                                componentList.appendChild(componentItem);
                                componentTree.appendChild(componentList);
                                var br = document.createElement('br');
                                componentTree.appendChild(br);

                                idList.appendChild(componentTree);
                                var br = document.createElement('br');
                                idList.insertBefore(br, idList.childNodes[0]);
                                idList.insertBefore(idPara, idList.childNodes[0]);
                                idTree.appendChild(idList);

                                typeList.appendChild(idTree);
                                var br = document.createElement('br');
                                typeList.insertBefore(br, typeList.childNodes[0]);
                                typeList.insertBefore(typePara, typeList.childNodes[0]);
                                typeTree.appendChild(typeList);

                                categoryList.appendChild(typeTree);
                                var br = document.createElement('br');
                                categoryList.insertBefore(br, categoryList.childNodes[0]);
                                categoryList.insertBefore(categoryPara, categoryList.childNodes[0]);
                                var br = document.createElement('br');
                                categoryList.insertBefore(br, categoryList.nextSibling);
                                categoryTree.appendChild(categoryList);

                                addressList.appendChild(categoryTree);
                                var br = document.createElement('br');
                                addressList.appendChild(br);

                                var componentArray = [];
                                componentArray.push(Data[j].Component);

                                var idArray = {};
                                idArray[Data[j].Service_Id] = componentArray;

                                var typeArray = {};
                                typeArray[Data[j].Service_Type] = idArray;

                                organized[address][category] = typeArray;
                            }
                        } else {
                            addressList = document.createElement('li');
                            addressList.id = address;
                            addressList.className = "serviceAddress";
                            if (address == "_") {
                                addressList.innerHTML = '<p style="color: white;"><span>' + address + '</span></p><br/>';
                            } else {
                                addressList.innerHTML = '<p><span>' + address + '</span></p><br/>';
                            }

                            categoryTree = document.createElement('ul');
                            categoryTree.className = Data[j].Category;
                            var categoryList = document.createElement('li');
                            categoryList.className = "serviceCategory";
                            var categoryPara = document.createElement('p');
                            var categoryLabel = document.createElement('span');
                            categoryLabel.innerHTML = Data[j].Category;
                            var categoryCount = document.createElement('span');
                            categoryCount.innerHTML = " (1)";
                            categoryPara.appendChild(categoryCount);
                            categoryPara.insertBefore(categoryLabel, categoryCount);

                            typeTree = document.createElement('ul');
                            typeTree.className = Data[j].Service_Type;
                            var typeList = document.createElement('li');
                            typeList.className = "serviceType";
                            var typePara = document.createElement('p');
                            var typeLabel = document.createElement('span');
                            typeLabel.innerHTML = Data[j].Service_Type;
                            var typeCount = document.createElement('span');
                            typeCount.innerHTML = " (1)";
                            typePara.appendChild(typeCount);
                            typePara.insertBefore(typeLabel, typeCount);

                            idTree = document.createElement('ul');
                            idTree.className = "serviceIdTree";
                            var idList = document.createElement('li');
                            var idPara = document.createElement('p');
                            var idSpan = document.createElement('span');
                            idSpan.className = "serviceId";
                            idSpan.innerHTML = Data[j].Service_Id + " ";


                            ////josef test pic link

                            //var showPics = document.createElement('span');
                            //showPics.innerHTML = "PICs";
                            //showPics.className = 'pics';
                            //idPara.appendChild(showPics);
                            //idPara.insertBefore(idSpan, idPara.childNodes[0]);

                            //// end josef


                            idPara = ifShowFacilities(j);

                            componentTree = document.createElement('ul');
                            componentTree.className = Data[j].Service_Id + " serviceComponents";
                            componentList = document.createElement('li');
                            var componentItem = document.createElement('p');
                            componentItem.innerHTML = Data[j].Component;
                            componentList.appendChild(componentItem);
                            componentTree.appendChild(componentList);
                            var br = document.createElement('br');
                            componentTree.appendChild(br);

                            idList.appendChild(componentTree);
                            var br = document.createElement('br');
                            idList.insertBefore(br, idList.childNodes[0]);
                            idList.insertBefore(idPara, idList.childNodes[0]);
                            idTree.appendChild(idList);

                            typeList.appendChild(idTree);
                            var br = document.createElement('br');
                            typeList.insertBefore(br, typeList.childNodes[0]);
                            typeList.insertBefore(typePara, typeList.childNodes[0]);
                            typeTree.appendChild(typeList);

                            categoryList.appendChild(typeTree);
                            var br = document.createElement('br');
                            categoryList.insertBefore(br, categoryList.childNodes[0]);
                            categoryList.insertBefore(categoryPara, categoryList.childNodes[0]);
                            var br = document.createElement('br');
                            categoryList.insertBefore(br, categoryList.nextSibling);
                            categoryTree.appendChild(categoryList);
                            
                            addressList.appendChild(categoryTree);
                            var br = document.createElement('br');
                            addressList.appendChild(br);
                            productsTree.appendChild(addressList);
                            if (productsTree.children.length > 1) {
                                var br = document.createElement('br');
                                productsTree.insertBefore(br, productsTree.lastChild);
                            }

                            mainList.appendChild(productsTree);
                            mainTree.appendChild(mainList);

                            var componentArray = [];
                            componentArray.push(Data[j].Component);

                            var idArray = {};
                            idArray[Data[j].Service_Id] = componentArray;

                            var typeArray = {};
                            typeArray[Data[j].Service_Type] = idArray;

                            var categoryArray = {};
                            categoryArray[Data[j].Category] = typeArray;

                            organized[address] = categoryArray;
                        }
                    }

                    enableTree();

                    function ifShowFacilities(index) {

                        var index = j;
                        emfConfig_Id = Data[j].EmfConfig_Id;
                       

                        if (showFacilities_id.indexOf(emfConfig_Id) >= 0) {
                            var short_desc = showFacilities_desc[showFacilities_id.indexOf(emfConfig_Id)];
                            var showFacilities = document.createElement('span');
                            showFacilities.innerHTML = "Show Facilities";
                            showFacilities.className = 'showFacilities';
                            idPara.appendChild(showFacilities);
                            idPara.insertBefore(idSpan, idPara.childNodes[0]);


                            var option = {
                                ServiceId: Data[j].Service_Id, // this is tn
                                ServiceType: Data[j].Service_Type, // this POTS or HSI
                                EmfConfigId: emfConfig_Id,
                                ShortDesc: short_desc
                            }

                            FACSDropdownArray.push(option);
                            option = null;
                        } else {
                            others["ifWithOtherServices"] = true;
                            idPara.appendChild(idSpan);
                        }


                        //josef test pic link

                        if (Data[j].Service_Type == 'POTS') {
                            var showPics = document.createElement('span');
                            showPics.innerHTML = "PICs";
                            showPics.className = 'pics';
                            showPics.value = Data[j].Service_Id + "," + index;
                            idPara.appendChild(showPics);
                            idPara.insertBefore(idSpan, idPara.childNodes[0]);
                        }
                       

                        // end josef


                        return idPara;
                    }


                    if (ifMultiple_FACS) {
                        var multiProducts = document.getElementById('multiProducts');
                        if (FACSDropdownArray.length == 0 || others["ifWithOtherServices"]) {
                            multiProducts.innerHTML = "Multiple services, service address or TNs detected.<br/>NOTE: There are services on this account that are currently not supported by this application.";
                            if (FACSDropdownArray.length == 0) {
                                $('#facs-dropdown > select').css('width', '40%');
                            }
                        } else {
                            multiProducts.innerHTML = "Multiple services, service address or TNs detected.";
                        }
                    } else {
                        if (others["ActiveServiceCount"] == 0) {
                            $('#facs-contents').before('<p class="noProducts">No facilities found on this account</p>');
                            $('#facs-contents').hide();
                            $('#facs-dropdown > select').css('width', '40%');
                        } else {
                            if (FACSDropdownArray.length == 0) {
                                $('#facs-contents').before('<p class="noProducts">NOTE: There are services on this account that are currently not supported by this application.</p>');
                                $('#facs-contents').hide();
                                $('#facs-dropdown > select').css('width', '40%');
                            }
                        }
                    }

                    getFacsOverview_CRM();
                },
                dataType: "json",
                cache: false
            });
        }

        
        function getChildAccountInfo() {
            var url = "api/htaccount/GetChildAccountInfo?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (Data) {
                    childAccountInfo = Data;
                    var active = 0;

                    if (Data.length > 0) {
                        var tree = document.createElement('ul');
                        for (var j = 0; j < Data.length; j++) {
                            if (!(Data[j].KenanStatus == "DISC_DONE" || Data[j].KenanStatus == "DISC_REQ")) {
                                active++;
                                if (!Data[j].AlternateAddress == "") {
                                    var address = Data[j].AlternateAddress;
                                } else {
                                    var address = Data[j].BillingAddress;
                                }

                                var listItem = document.createElement('li');
                                listItem.setAttribute('id', 'child_account_' + j);
                                listItem.innerHTML = '<p><span id="child_num_' + j + '" class="child_account_num">' + Data[j].AccountNo + '</span> - ' + address + '</p>';
                                tree.appendChild(listItem);

                                var br = document.createElement('br');
                                tree.appendChild(br);
                            }
                        }

                        if (active > 0) {
                            var childTree = document.getElementById("child-tree");
                            var childList = document.createElement('li');
                            childList.innerHTML = '<p>Child Accounts</p><br/>';

                            childList.appendChild(tree);
                            childTree.appendChild(childList);

                            $('#child-tree li').each(function () {
                                if ($(this).children('ul').length > 0) {
                                    $(this).addClass('parent');
                                }
                            });

                            $('#child-tree li.parent > p').click(function (event) {
                                var selection = document.getSelection().toString();
                                if (!selection) {
                                    $(this).parent().toggleClass('active');
                                    $(this).parent().children('ul').slideToggle('fast', function () {
                                        if ($(this).is(':visible')) {
                                            $(this).css('display', 'inline-block');
                                        }
                                    });
                                }
                            });

                            $('#child-tree li.parent > p').click();

                            $('.child_account_num').click(function () {
                                openDashboardWindow(this, 'child');
                            });
                        } else {
                            if ($('#noChild').length == 0) {
                                $('#child-tree').before('<p class="noProducts" id="noChild" style="margin-left: 1em;">No child accounts found</p>');    //Rachel, 0924 [DE37 Fix]
                            }
                        }
                    } else {
                        if ($('#noChild').length == 0) {
                            $('#child-tree').before('<p class="noProducts" id="noChild" style="margin-left: 1em;">No child accounts found</p>');
                        }
                    }
                },
                dataType: "json",
                cache: false
            });
        }

        function getAccountLevelComponents() {
            var url = "api/htaccount/GetAccountLevelComponents?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (Data) {
                    if (Data.length > 0) {
                        var levelComponentsTree = document.getElementById("levelComponents-tree");
                        var levelComponentsList = document.createElement('li');
                        levelComponentsList.innerHTML = '<p>Account Level Components</p><br/>';

                        var tree = document.createElement('ul');
                        tree.className = "levelComponents";
                        for (var j = 0; j < Data.length; j++) {
                            var listItem = document.createElement('li');
                            listItem.setAttribute('id', 'level_component_' + j);
                            listItem.innerHTML = '<p><span>' + Data[j] + '</span></p>';
                            tree.appendChild(listItem);

                            var br = document.createElement('br');
                            tree.appendChild(br);
                        }

                        levelComponentsList.appendChild(tree);
                        levelComponentsTree.appendChild(levelComponentsList);

                        $('#levelComponents-tree li').each(function () {
                            if ($(this).children('ul').length > 0) {
                                $(this).addClass('parent');
                            }
                        });

                        $('#levelComponents-tree li.parent > p').click(function (event) {
                            var selection = document.getSelection().toString();
                            if (!selection) {
                                $(this).parent().toggleClass('active');
                                $(this).parent().children('ul').slideToggle('fast', function () {
                                    if ($(this).is(':visible')) {
                                        $(this).css('display', 'inline-block');
                                    }
                                });
                            }
                        });

                        $('#levelComponents-tree li.parent > p').click();
                    }
                },
                dataType: "json",
                cache: false
            });
        }

        function openDashboardWindow(object, accountType) {
            if (accountType == 'child') {
                var index = object.id.replace(/\D/g, '');
                //var number = parseInt(childAccountInfo[index].AccountNo); Changed, 09/24 Rachel [DE51 fix]
                var number = childAccountInfo[index].AccountNo;
                var name = childAccountInfo[index].AccountName;
                var telephone = childAccountInfo[index].Btn;
                if (telephone == "undefined") {
                    telephone = "";
                }
                var type = childAccountInfo[index].AccountType;
            } else if (accountType == 'parent') {
                //var number = parseInt(object.ParentAcctNo);   Changed, 09/24 Rachel [DE51 fix]
                var number = object.ParentAcctNo;
                var name = object.ParentAcctName;
                var telephone = object.ParentBTN;
                if (telephone == "undefined") {
                    telephone = "";
                }
                var type = object.ParentAccountType;
            }

            function setArray(name, number, telephone, type) {
                this.AccountNo = number;
                this.AccountName = name;
                this.Btn = telephone;
                this.AccountType = type;
            }
            
            if (opener.maxDash(number) == true) {
                maxDashAlert();
            } else {
                opener.callback(new setArray(name, number, telephone, type));
            }
        }

        var crmCtxTn = [];
        function getFacsOverview_CRM() {
            var url = "api/htaccount/GetServices?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (facsOverview_crm) {
                    FacsDataArray["facsOverview_crm"] = facsOverview_crm;

                    // stores all TN with ServiceType == CTX
                    for (var a = 0; a < facsOverview_crm.length; a++) {
                        if (facsOverview_crm[a].ServiceType == 'CTX') {
                            crmCtxTn.push(facsOverview_crm[a].ServiceId);
                        }
                    }

                    if (!ifMultiple_FACS) {
                        setFacsOverview(facsOverview_crm, "crm");
                    }

                    if (FACSDropdownArray.length > 0) {
                        if (accountBtn == "" && others["TeleNos"].length == 1) {
                            accountBtn = others["TeleNos"][0];
                        }

                        if (accountBtn != "") {
                            getFacsOverview_NB();
                        }                        
                    }

                    getFacs_iPlanet();
                },
                dataType: "json",
                cache: false
            });
        }

        function getFacsOverview_NB() {
            if (others["ActiveServiceCount"] == 1) {
                for (var a = 0; a < FACSDropdownArray.length; a++) {
                    if (FACSDropdownArray[a].EmfConfigId == "1") {
                        accountBtn = FACSDropdownArray[a].ServiceId;
                        break;
                    }
                }
            }

            var url = "api/htaccount/GetFacility?tel_num=" + accountBtn;
            $.ajax({
                type: "GET",
                url: url,
                success: function (facsOverview_nb) {
                    FacsDataArray["facsOverview_nb"] = facsOverview_nb;

                    if (!ifMultiple_FACS) {
                        setFacsOverview(facsOverview_nb, "nb");
                    }                    
                },
                error: function () {
                    return;
                },
                dataType: "json",
                cache: false
            });
        }
        
        var facs_iplanet = [];
        function getFacs_iPlanet() {
            var url = "api/htaccount/CustomerByAccountSVC?id=" + accountNumber;
            $.ajax({
                type: "GET",
                url: url,
                success: function (facs_iplanet) {
                    FacsDataArray["facs_iplanet"] = facs_iplanet;
                    if (!ifMultiple_FACS) {
                        setFacsOverview(facs_iplanet, "iplanet");
                    }
                    enumerateFACSdropdown();
                },
                error: function (Data) {
                    FacsDataArray["facs_iplanet"] = facs_iplanet;
                    enumerateFACSdropdown();
                },
                dataType: "json",
                cache: false
            });
        }

        function setFacsOverview(facsOverview, source) {
            switch (source) {
                case "crm":
                    var serviceTypesArray = [], facilityTypesArray = [];
                    for (var a = 0; a < facsOverview.length; a++) {
                        if (serviceTypesArray.indexOf(facsOverview[a].ServiceType) < 0) {
                            serviceTypesArray.push(facsOverview[a].ServiceType);
                        }
                        if (facilityTypesArray.indexOf(facsOverview[a].FacilityType) < 0) {
                            facilityTypesArray.push(facsOverview[a].FacilityType);
                        }
                    }

                    if (facsOverview.length == 0 || serviceTypesArray.length == 0) {
                        var array = others["ServiceTypes"];
                        if (!(array == undefined || array == null)) {
                            for (var a = 0; a < array.length; a++) {
                                if (serviceTypesArray.indexOf(array[a].Name) < 0) {
                                    serviceTypesArray.push(array[a].Name);
                                }
                            }
                        }
                    }

                    var widget_serviceTypes = document.getElementById("widget_serviceTypes");
                    widget_serviceTypes.innerHTML = serviceTypesArray.join(", ");

                    var widget_facTypes = document.getElementById("widget_facTypes");
                    widget_facTypes.innerHTML = facilityTypesArray.join(", ");
                    break;

                case "nb":
                    var serviceStatus = [];
                    var cablePair = [];
                    var lniPort = [];
                    var sagRemarks = [];

                    for (var a = 0; a < facsOverview.length; a++) {
                        if ((facsOverview[a].Status != "") && (serviceStatus.indexOf(facsOverview[a].Status) < 0)) {
                            serviceStatus.push(facsOverview[a].Status);
                        }

                        if ((facsOverview[a].Cable_Pair != "") && (cablePair.indexOf(facsOverview[a].Cable_Pair) < 0)) {
                            cablePair.push(facsOverview[a].Cable_Pair);
                        }

                        if ((facsOverview[a].Port != "") && (lniPort.indexOf(facsOverview[a].Port) < 0)) {
                            lniPort.push(facsOverview[a].Port);
                        }

                        if ((facsOverview[a].Remarks != "") && (sagRemarks.indexOf(facsOverview[a].Remarks) < 0)) {
                            sagRemarks.push(facsOverview[a].Remarks);
                        }
                    }

                    var widget_serviceStatus = document.getElementById("widget_serviceStatus");
                    widget_serviceStatus.innerHTML = serviceStatus.join(", ");

                    var widget_cablePair = document.getElementById("widget_cablePair");
                    widget_cablePair.innerHTML = cablePair.join(", ");

                    var widget_lni = document.getElementById("widget_lni");
                    widget_lni.innerHTML = lniPort.join(", ");

                    var widget_sagRemarks = document.getElementById("widget_sagRemarks");
                    widget_sagRemarks.innerHTML = sagRemarks.join(", ");
                    break;

                case "iplanet":
                    var widget_serviceStatus = document.getElementById("widget_serviceStatus");
                    var nb_serviceStatus = widget_serviceStatus.innerHTML;
                    if (nb_serviceStatus == "") {
                        var serviceStatus = [];
                        for (var a = 0; a < facsOverview.length; a++) {
                            serviceStatus.push(facsOverview[a].statusField);
                        }
                        widget_serviceStatus.innerHTML = serviceStatus.join(", ");
                    }                    
            }
        }

        function convertDateFormat(mediumFormat) {
            var date = new Date(mediumFormat);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var shortFormat = month + "/" + day + "/" + year;
            return (shortFormat);
        }

        function queryString(key) {
            fullQs = window.location.search.substring(1);
            qsParamsArray = fullQs.split("|");
            for (i = 0; i < qsParamsArray.length; i++) {
                strKey = qsParamsArray[i].split("=");
                if (strKey[0] == key) {
                    return strKey[1];
                }
            }
        }

        $('#overview-tab').click(function () {
            changeTab(this.id);
            return false;
        });

        $('.widget').resizable();
        $('.widget').click(function (event) {
            var selection = document.getSelection().toString();
            if (!selection) {
                if ((event.target.className == "parent_dashLink") || ($(event.target).parents("#orders-box").length > 0)) {
                    //openDashboardWindow(parentAccountArray, 'parent');    // Rachel, 09/25 [DE31]
                } else {
                    for (var i = 0; i < $('.tab').length; i++) {
                        $('.tab').css('opacity', '0.5');
                    }
                }
            }
        });

        $('#customInfo-widget').click(function (event) {
            var selection = document.getSelection().toString();
            if (!selection) {
                if (event.target.className == "child_info_prodLink") {
                    $('#products-widget').click();
                } else if (event.target.className == "parent_dashLink") {
                    //openDashboardWindow(parentAccountArray, 'parent');    // Rachel, 09/25 [DE31]
                } else {
                    if ($('#customInfo-tab').length === 0) {
                        for (var i = 0; i < $('.content').length; i++) {
                            var boxes = $('.content')[i].id;
                            if ($('.content')[i].id !== "customInfo-box") {
                                $('#' + boxes).hide();
                            }
                        }

                        $('#customInfo-box').css('display', 'inline-block');

                        var top = $('.tab').length - 1;
                        var customInfoTab = $('<div class="tab" id="customInfo-tab">'
                            + '<p><span>Customer</span> <span class="close"></span></p>'
                            + '</div>');
                        customInfoTab.css('top', tabTopLength[top]);
                        customInfoTab.appendTo('#tab-container');

                        $('#customInfo-tab .close').click(function () {
                            $("#customInfo-tab").remove();
                            closePage("customInfo-tab");
                            return false;
                        });

                        $('#customInfo-tab').click(function () {
                            changeTab(this.id);
                            return false;
                        });
                    } else {
                        changeTab("customInfo-tab");
                    }
                }
            }
        });

        $('#products-widget').click(function () {
            var selection = document.getSelection().toString();
            if (!selection) {
                if ($('#products-tab').length === 0) {
                    for (var i = 0; i < $('.content').length; i++) {
                        var boxes = $('.content')[i].id;
                        if ($('.content')[i].id !== "products-box") {
                            $('#' + boxes).hide();
                        }
                    }
                    $('#products-box').css('display', 'inline-block');

                    var top = $('.tab').length - 1;
                    var productsTab = $('<div class="tab" id="products-tab">'
                        + '<p><span>Products</span> <span class="close"></span></p>'
                        + '</div>');
                    productsTab.css('top', tabTopLength[top]);
                    productsTab.appendTo('#tab-container');

                    $('#products-tab .close').click(function () {
                        $("#products-tab").remove();
                        closePage("products-tab");
                        return false;
                    });

                    $('#products-tab').click(function () {
                        changeTab(this.id);
                        return false;
                    });

                } else {
                    changeTab("products-tab");
                }

                if (childAccountInfo.length == 0 && (accountType.toLowerCase().indexOf('parent') >= 0)) {
                    getChildAccountInfo();
                }

                if ($('#levelComponents-tree li').length == 0) {
                    getAccountLevelComponents();
                }
            }
        });

        $('#facs-widget').click(function () {
            var selection = document.getSelection().toString();
            if (!selection) {
                if ($('#facs-tab').length === 0) {
                    for (var i = 0; i < $('.content').length; i++) {
                        var boxes = $('.content')[i].id;
                        if ($('.content')[i].id !== "facs-box") {
                            $('#' + boxes).hide();
                        }
                    }

                    $("#service-dropdown").prop("selectedIndex", -1);
                    $('#facs-box').css('display', 'inline-block');
                    $('#facs-box .page').css('display', 'none');


                    var top = $('.tab').length - 1;
                    var productsTab = $('<div class="tab" id="facs-tab">'
                        + '<p><span>FACS</span> <span class="close"></span></p>'
                        + '</div>');
                    productsTab.css('top', tabTopLength[top]);
                    productsTab.appendTo('#tab-container');

                    $('#facs-tab .close').click(function () {
                        $("#facs-tab").remove();
                        closePage("facs-tab");
                        return false;
                    });

                    $('#facs-tab').click(function () {
                        changeTab(this.id);
                        return false;
                    });
                } else {
                    changeTab("facs-tab");
                }
            }
        });

        $('#orders_cases-widget').click(function () {            
            var selection = document.getSelection().toString();
            if (!selection) {
                if ($('#cases_order').length === 0) {
                    for (var i = 0; i < $('.content').length; i++) {
                        var boxes = $('.content')[i].id;
                        if ($('.content')[i].id !== "orders-box") {
                            $('#' + boxes).hide();
                        }
                    }

                    $('#orders-box').css('display', 'inline-block');
                    $('#orders-box .page').css('display', 'inline-block !important');

                    var top = $('.tab').length - 1;
                    var ordersTab = $('<div class="tab" id="cases_order">'
                        + '<p><span>Orders</span> <span class="close"></span></p>'
                        + '</div>');
                    ordersTab.css('top', tabTopLength[top]);
                    ordersTab.appendTo('#tab-container');

                    $('#cases_order .close').click(function () {
                        $("#cases_order").remove();
                        closePage("cases_order");
                        return false;
                    });

                    $('#cases_order').click(function () {
                        changeTab(this.id);
                        return false;
                    });
                } else {
                    changeTab("cases_order");
                }
            }
        });

        $('#billing-widget').click(function () {
            var selection = document.getSelection().toString();
            if (!selection) {
                if ($('#billing-tab').length === 0) {
                    for (var i = 0; i < $('.content').length; i++) {
                        var boxes = $('.content')[i].id;
                        if ($('.content')[i].id !== "billing-box") {
                            $('#' + boxes).hide();
                        }
                    }

                    $('#billing-box').css('display', 'inline-block');

                    var top = $('.tab').length - 1;
                    var billingTab = $('<div class="tab" id="billing-tab">'
                        + '<p><span>Billing</span> <span class="close"></span></p>'
                        + '</div>');
                    billingTab.css('top', tabTopLength[top]);
                    billingTab.appendTo('#tab-container');

                    $('#billing-tab .close').click(function () {
                        $("#billing-tab").remove();
                        closePage("billing-tab");
                        return false;
                    });

                    $('#billing-tab').click(function () {
                        changeTab(this.id);
                        return false;
                    });
                } else {
                    changeTab("billing-tab");
                }
            }
        });

        function closePage(pageName) {
            closeExpandMenu();
            switch (pageName) {
                case "customInfo-tab":
                    $('#customInfo-box').hide();
                    break;
                case "products-tab":
                    $('#products-box').hide();
                    break;
                case "facs-tab":
                    $('#facs-box').hide();
                    break;
                case "cases_order":
                    $('#orders-box').hide();
                    break;
                case "billing-tab":
                    $('#billing-box').hide();
                    break;
            }

            var numTabs = $('.tab').length;
            for (var obj = 1, j = 0; obj < numTabs; obj++, j++) {
                var tabId = $('.tab')[obj].id;
                $('#' + tabId).css('top', tabTopLength[j]);
            }

            $('#overview-box').css('display', 'inline-block');
            $('#overview-tab').css('opacity', '1');
        }

        function changeTab(selectedTab) {
            if ($('#' + selectedTab).css('opacity') === '0.5') {

                closeExpandMenu();

                var numVisibleTabs = $('.content').filter(":visible").length;
                for (var i = 0; i < numVisibleTabs; i++) {
                    var boxId = $('.content').filter(":visible")[i].id;
                    $('#' + boxId).hide();
                }

                var numTabs = $('.tab').length;
                for (var j = 0; j < numTabs; j++) {
                    var tabId = $('.tab')[j].id;
                    $('#' + tabId).css('opacity', '0.5');
                    if ($('#' + tabId + ' .close').length > 0) {
                        $('#' + tabId + ' .close').hide();
                    }
                }

                switch (selectedTab) {
                    case "overview-tab":
                        $('#overview-box').css('display', 'inline-block');
                        $('#overview-tab').css('opacity', '1');
                        break;
                    case "customInfo-tab":
                        $('#customInfo-box').css('display', 'inline-block');
                        $('#customInfo-tab').css('opacity', '1');
                        $('#customInfo-tab span').show();
                        break;
                    case "products-tab":
                        $('#products-box').css('display', 'inline-block');
                        $('#products-tab').css('opacity', '1');
                        $('#products-tab span').show();
                        break;
                    case "facs-tab":
                        $('#facs-box').css('display', 'inline-block');
                        $('#facs-tab').css('opacity', '1');
                        $('#facs-tab span').show();
                        break;
                    case "cases_order":
                        $('#orders-box').css('display', 'inline-block');
                        $('#cases_order').css('opacity', '1');
                        $('#cases_order span').show();
                        break;
                    case "billing-tab":
                        $('#billing-box').css('display', 'inline-block');
                        $('#billing-tab').css('opacity', '1');
                        $('#billing-tab span').show();
                        break;
                }
            }
        }

        /* Products & Services, collapsible tree */
        function enableTree() {
            var children = $("#products-tree").children().children('ul');
            var category_count = 0, count = 0;
            for (var x = 0; x < children.length; x++) {
                var address = children[x].children;
                for (var y = 0; y < address.length; y++, category_count = 0) {
                    if (address[y].nodeName == "LI") {
                        //var category = address[y].childNodes[0];  //Rachel, 09/25 [Product Tree, <br/>]
                        var category = $(address[y]).children('ul').children('.serviceCategory');
                        //var category_countObj = category.childNodes[0].childNodes[1]; //Rachel, 09/25 [Product Tree, <br/>]
                        var category_countObj = category.children('p')[0].childNodes[1];
                        category = category[0];
                        for (var z = 1; z < category.children.length; z++) {
                            if (category.childNodes[z].nodeName == "UL") {
                                var type = category.childNodes[z].childNodes[0];
                                var countObj = type.childNodes[0].childNodes[1];
                                for (var a = 1; a < type.children.length; a++, count = 0) {
                                    if (type.childNodes[a].nodeName == "UL") {
                                        var typeTree = type.childNodes[a];
                                        count = $(typeTree).children('li').length;
                                        countObj.innerHTML = " (" + count + ")";
                                        category_count += count;
                                    }
                                }
                            }
                        }
                        category_countObj.innerHTML = " (" + category_count + ")";
                    }
                }
            }

            $('#products-tree li').each(function () {
                if ($(this).children('ul').length > 0) {
                    $(this).addClass('parent');
                }
            });

            $('#products-tree li.parent > p').click(function (event) {
                var selection = document.getSelection().toString();
                if (!selection) {
                    if (event.target.className == "showFacilities") {
                        var value = this.childNodes[0].innerHTML.trim();
                        $('#facs-widget').click();
                        if ($("#service-dropdown").val() != value) {
                            $("#service-dropdown option[value='" + value + "']").prop("selected", true).change();
                        }
                    }
                    //josef test pics
                    else if (event.target.className == "pics") {

                        //var vm = new ViewModel();
                        //ko.applyBindings(vm);
                        
                      var accountNo = accountNumber;
                      var tnAndIndex = event.target.value;
                      vm.GetPic(accountNo, tnAndIndex);
                      
 
                    }

                   //end josef



                    else if (event.target.className != "serviceId") {
                        $(this).parent().toggleClass('active');
                        if(!$(this).parent().hasClass('active')){
                            collapse_item($(this).parent());
                        }
                        //$(this).parent().children('ul').slideToggle('fast');
                        $(this).parent().children('ul').slideToggle('fast', function () {
                            if ($(this).is(':visible')) {
                                $(this).css('display', 'inline-block');
                            }
                        });

                        if (this.id == 'products_label') {
                            $(this).parent().find('.serviceCategory').each(function () {
                                if (!$(this).hasClass('active')) {
                                    $(this).children('br').first().hide();
                                }

                                if (!$(this).parent().hasClass('active')) {
                                    $(this).parent().siblings('br').hide();
                                }
                            });
                        }

                        if ($(this).parent().hasClass('serviceCategory')) {
                            if ($(this).parent().hasClass('active')) {
                                $(this).parent().children('br').first().show();
                            } else {
                                $(this).parent().children('br').first().hide();
                            }
                        } else if ($(this).parent().hasClass('serviceAddress')) {
                            if ($(this).parent().hasClass('active')) {
                                $(this).parent().children('br').show();
                            } else {
                                $(this).parent().children('br').hide();
                            }
                        }
                    }
                }
            });

            $('#products_label').click();
            
            var expand_menu_obj;
            var lastOptionSelected;
            var selection = document.getSelection().toString();
            var childTreeClicked, componentTreeClicked;
            $('.products-page .contents').contextmenu(function (event) {
                childTreeClicked = $(event.target).parents('#child-tree').length;
                componentTreeClicked = $(event.target).parents('#levelComponents-tree').length;
                selection = document.getSelection().toString();
                if (!selection && childTreeClicked == 0 && componentTreeClicked == 0) {
                    if (event.target.nodeName == "P") {
                        event.target = $(event.target).children('span');
                    }

                    if ($(event.target).hasClass('serviceId') || $(event.target).hasClass('showFacilities')) {
                        return true;
                    } else {
                        //expand_menu_obj = $(document).find('ul#products-tree').find('li.serviceAddress');
                        expand_menu_obj = $(document).find('ul#products-tree').find('li.parent');

                        $('.contextMenu li').show();

                        var allActive = expand_menu_obj.find('.active');
                        var allParents = expand_menu_obj.find('.parent');
                        if (allActive.length == allParents.length) {
                            $('#expand_all').hide();
                        } else if (allActive.length == 0) {
                            $('#collapse_all').hide();
                        }

                        $('#expand_anywhere').css({ 'top': event.pageY, 'left': event.pageX }).show();
                        return false;
                    }
                } else {
                    return true;
                }
            }).mousedown(function (event) {
                closeExpandMenu();
            });

            $('#products-tree ul > li.parent > p').contextmenu(function (event) {
                selection = document.getSelection().toString();
                if (!selection) {
                    expand_menu_obj = $(event.target);

                    $('.contextMenu li').show();

                    if (expand_menu_obj[0].tagName == "P") {
                        expand_menu_obj = $(expand_menu_obj).children('span');
                    }

                    if (expand_menu_obj.hasClass('serviceId') || expand_menu_obj.hasClass('showFacilities')) {
                        /*$('#expand_item_label').text('This Service');

                        var ifServiceTypeActive = expand_menu_obj.closest('li').hasClass('active');
                        if (ifServiceTypeActive) {
                            $('#expand_this').hide();
                        } else {
                            $('#collapse_this').hide();
                        }*/
                        return true;
                    } else {
                        if (expand_menu_obj.closest('li').hasClass('serviceType')) {
                            $('#expand_item_label').text('This Service Type');
                        } else if (expand_menu_obj.closest('li').hasClass('serviceCategory')) {
                            $('#expand_item_label').text('This Service Group');
                        } else if (expand_menu_obj.closest('li').hasClass('serviceAddress')) {
                            $('#expand_item_label').text('This Address');
                        }

                        var allActive = expand_menu_obj.closest('li').find('.active');
                        var allParents = expand_menu_obj.closest('li').find('.parent');

                        if (allActive.length == allParents.length) {
                            $('#expand_this').hide();
                        } else if (allActive.length == 0) {
                            $('#collapse_this').hide();
                        }

                        if (expand_menu_obj.parent().closest('li').hasClass('active')) {
                            $('#collapse_this').show();
                        }
                    }

                    $('#expand_item').css({ 'top': event.pageY, 'left': event.pageX }).show();
                    return false;
                } else {
                    return true;
                }
            }).mousedown(function (event) {
                closeExpandMenu();
            });

            $('.contextMenu').click(function (event) {
                closeExpandMenu();

                var option = event.target.id;
                switch (option) {
                    case "expand_this":
                        var object = expand_menu_obj.closest('li');
                        expand_item(object);
                        break;
                    case "collapse_this":
                        var object = expand_menu_obj.closest('li');
                        collapse_item(object);
                        break;
                    case "expand_this_groups":
                        var object = expand_menu_obj.closest('li').find('li.parent').andSelf();
                        collapse_item(object);
                        expand_serviceGroups(object);
                        break;
                    case "expand_this_services":
                        var object = expand_menu_obj.closest('li').find('li.parent').andSelf();
                        collapse_item(object);
                        expand_services(object);
                        break;
                    case "expand_all":
                        expand_item(expand_menu_obj);
                        break;
                    case "collapse_all":
                        collapse_item(expand_menu_obj);
                        break;
                    case "expand_services":
                        collapse_item(expand_menu_obj);
                        expand_services(expand_menu_obj);
                        break;
                    case "expand_serviceGroups":
                        collapse_item(expand_menu_obj);
                        expand_serviceGroups(expand_menu_obj);
                        break;
                }
            });
        }

        function closeExpandMenu() {
            if ($('#expand_item').is(':visible')) {
                $('#expand_item').hide();
            } if ($('#expand_anywhere').is(':visible')) {
                $('#expand_anywhere').hide();
            }
        }

        function expand_item(object) {
            var parent = object;
            if (parent.hasClass('parent')) {
                for (var a = 0; a < parent.length; a++) {
                    if (parent[a].className.indexOf('active') < 0) {
                        $(parent[a]).children('p').click();
                    }
                }
                expand_item(parent.children('ul').children('li.parent'));
            }
        }

        function collapse_item(object) {
            var parent = object;
            if (parent.hasClass('parent')) {
                for (var a = 0; a < parent.length; a++) {
                    if (parent[a].className.indexOf('active') >= 0) {
                        $(parent[a]).children('p').click();
                    }
                }
                collapse_item(parent.children('ul').children('li.parent'));
            }
        }

        function expand_services(object) {
            var parent = object;
            if (parent.hasClass('parent')) {
                for (var a = 0; a < parent.length; a++) {
                    if (parent[a].className.indexOf('active') < 0) {
                        if (!$(parent[a]).children().hasClass('serviceComponents')) {
                            $(parent[a]).children('p').click();
                        }
                    }
                }
                //expand_services(parent.children('ul').children('li.parent'));
            }
        }

        function expand_serviceGroups(object) {
            var parent = object;
            if (parent.hasClass('parent')) {
                for (var a = 0; a < parent.length; a++) {
                    if (parent[a].className.indexOf('active') < 0) {                        
                        if (!($(parent[a]).hasClass('serviceCategory') || $(parent[a]).hasClass('serviceType') || $(parent[a]).parent().hasClass('serviceIdTree'))) {
                            $(parent[a]).children('p').click();
                        }
                    }
                }
                //expand_serviceGroups(parent.children('ul').children('li.parent'));
            }
        }
        /* end of tree */

        //function enumerateFACSdropdown() {            
        //    for (var i = 0; i < FACSDropdownArray.length; i++) {
        //        if (FACSDropdownArray[i].ServiceId.indexOf("/") < 0) {
        //            var id = FACSDropdownArray[i].ServiceId;                    

        //            if (FACSDropdownArray[i].EmfConfigId == "23") { //for DSL
        //                var facsOverview_crm = FacsDataArray["facsOverview_crm"];
        //                var facs_iplanet = FacsDataArray["facs_iplanet"];
        //                var ifWithTN = false;
        //                var tn, potsHsi;

        //                if (facsOverview_crm.length > 0) {
        //                    for (var j = 0; j < facsOverview_crm.length; j++) {
        //                        var crm_id = parseInt(facsOverview_crm[j].ServiceId.replace(/\s/g, '').replace(/\.$/, ''));
        //                        tn = facsOverview_crm[j].Tn;
        //                        if (crm_id == FACSDropdownArray[i].ServiceId){ //&& crmCtxTn.indexOf(tn) < 0) {
        //                            ifWithTN = true;
        //                            //tn = facsOverview_crm[j].Tn;
        //                            potsHsi = tn + ", " + id;
        //                            break;
        //                        }
        //                    }
        //                } if (!ifWithTN && facs_iplanet.length > 0) {
        //                    for (var j = 0; j < facs_iplanet.length; j++) {
        //                        var iplanet_id = facs_iplanet[j].circuitIdField.replace(/\s/g, '').replace(/\.$/, '');
        //                        if (iplanet_id == FACSDropdownArray[i].ServiceId) {
        //                            ifWithTN = true;
        //                            tn = facs_iplanet[j].tnField;
        //                            potsHsi = tn + ", " + id;
        //                            break;
        //                        }
        //                    }
        //                }

        //                if (ifWithTN) {
        //                    $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + potsHsi + "</option>");

        //                    var option = {
        //                        ServiceId: tn + "/" + id,
        //                        ServiceType: "pots/hsi",
        //                        EmfConfigId: "1/23",
        //                        ShortDesc: "POTS/HSI"
        //                    }

        //                    FACSDropdownArray.splice(i + 1, 0, option);
        //                    //FACSDropdownArray[index] = option;
        //                    option = null;
        //                    $("#service-dropdown").append("<option value='" + FACSDropdownArray[i + 1].ServiceId + "'>" + FACSDropdownArray[i + 1].ShortDesc + ": " + tn + ", " + id + "</option>");
        //                } else {
        //                    $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + id + "</option>");
        //                }
        //            } else {
        //                $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + id + "</option>");
        //            }
        //        }
        //    }
        //}

        function enumerateFACSdropdown() {
            for (var i = 0; i < FACSDropdownArray.length; i++) {
                if (FACSDropdownArray[i].ServiceId.indexOf("/") < 0) {
                    var id = FACSDropdownArray[i].ServiceId;

                    if (FACSDropdownArray[i].EmfConfigId == "23") { //for DSL
                        var facsOverview_crm = FacsDataArray["facsOverview_crm"];
                        var facs_iplanet = FacsDataArray["facs_iplanet"];
                        var ifWithTN = false;
                        var tn, potsHsi;

                        if (facsOverview_crm.length > 0) {
                            for (var j = 0; j < facsOverview_crm.length; j++) {
                                var crm_id = facsOverview_crm[j].ServiceId.replace(/\s/g, '').replace(/\.$/, '');
                                tn = facsOverview_crm[j].Tn;
                                if (crm_id == FACSDropdownArray[i].ServiceId) {
                                    ifWithTN = true;
                                    //tn = facsOverview_crm[j].Tn;
                                    potsHsi = tn + ", " + id;
                                    break;
                                }
                            }
                        } if (!ifWithTN && facs_iplanet.length > 0) {
                            for (var j = 0; j < facs_iplanet.length; j++) {
                                var iplanet_id = facs_iplanet[j].circuitIdField.replace(/\s/g, '').replace(/\.$/, '');
                                tn = facs_iplanet[j].tnField;
                                if (iplanet_id == FACSDropdownArray[i].ServiceId) {
                                    ifWithTN = true;
                                    //tn = facs_iplanet[j].tnField;
                                    potsHsi = tn + ", " + id;
                                    break;
                                }
                            }
                        }

                        if (ifWithTN) {
                            $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + potsHsi + "</option>");
                            if (crmCtxTn.indexOf(tn) < 0) {
                                var option = {
                                    ServiceId: tn + "/" + id,
                                    ServiceType: "pots/hsi",
                                    EmfConfigId: "1/23",
                                    ShortDesc: "POTS/HSI"
                                }

                                FACSDropdownArray.splice(i + 1, 0, option);
                                //FACSDropdownArray[index] = option;
                                option = null;
                                $("#service-dropdown").append("<option value='" + FACSDropdownArray[i + 1].ServiceId + "'>" + FACSDropdownArray[i + 1].ShortDesc + ": " + tn + ", " + id + "</option>");
                            }
                        } else {
                            $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + id + "</option>");
                        }
                    } else {
                        $("#service-dropdown").append("<option value='" + FACSDropdownArray[i].ServiceId + "'>" + FACSDropdownArray[i].ShortDesc + ': ' + id + "</option>");
                    }
                }
            }
        }




        /* Facilities */
        var facsIndex, facsId, configId;
        var potsHsi;
        $("#service-dropdown").change(function () {
            facsIndex = $("#service-dropdown option:selected").index();
            configId = FACSDropdownArray[facsIndex].EmfConfigId;
            facsId = FACSDropdownArray[facsIndex].ServiceId;

            switch (configId) {
                case "1/23": //POTS/HSI
                    potsHsi = facsId.split('/');
                    facsId = potsHsi[0]; //POTS
                case "1": //POTS
                    var facsDetailed_nb = FacsDataArray["facsDetailed_nb"];
                    if (!(facsDetailed_nb == undefined || facsDetailed_nb == null)) {
                        var found = false;
                        for (var x = 0; x < facsDetailed_nb.length; x++) {
                            if(facsId == facsDetailed_nb[x].Tel_Num){
                                found = true;
                                break;
                            }
                        }

                        if (found) {
                            checkFacs_iPlanet(configId, facsId);
                        } else {
                            getFacsDetailed_NB();
                        }                        
                    } else {
                        getFacsDetailed_NB();
                    }
                    break;

                case "23": //DSL
                    checkFacs_iPlanet(configId, facsId);
                    break;
            }
        });

        function getFacsDetailed_NB() {

            //josef test US202

            var url = "api/htaccount/GetFacilityDetail?tel_num=" + facsId;
            //var url = "api/htaccount/GetFacilityDetail?tel_num=" + facsId;
            // end test US202
            
            $.ajax({
                type: "GET",
                url: url,
                success: function (facsDetailed_nb) {                                        
                    FacsDataArray["facsDetailed_nb"] = facsDetailed_nb;
                    checkFacs_iPlanet(configId, facsId);
                },
                error: function () {
                    FacsDataArray["facsDetailed_nb"] = null;
                    checkFacs_iPlanet(configId, facsId);
                },
                dataType: "json",
                cache: false
            });
        }

        var sideBySide = false;
        function checkFacs_iPlanet(type, facsId) {
            var checkFacs_type = type;
            facs_iplanet = FacsDataArray["facs_iplanet"];
            switch (checkFacs_type) {                
                case "23":
                    selected_iplanet = null;
                    for (var a = 0; a < facs_iplanet.length; a++) {
                        var circuitIdField = facs_iplanet[a].circuitIdField;
                        circuitIdField = circuitIdField.replace(/\s/g, '').replace(/\.$/, '');
                        if (circuitIdField == facsId) {
                            selected_iplanet = facs_iplanet[a];
                            break;
                        } else {
                            selected_iplanet = null;
                        }
                    }
                    
                    if (selected_iplanet != null && selected_iplanet.accessTypeField == "GPON") {
                        FACSDropdownArray[facsIndex].ServiceType = "fiber-dsl";
                    } else {
                        FACSDropdownArray[facsIndex].ServiceType = "copper-dsl";
                    }
                    FacsDataArray["selected_iplanet"] = selected_iplanet;
                    break;

                case "1":
                    FACSDropdownArray[facsIndex].ServiceType = "copper-pots";
                    for (var a = 0; a < facs_iplanet.length; a++) {
                        if (facs_iplanet[a].circuitIdField == facsId) {
                            FacsDataArray["selected_iplanet"] = facs_iplanet[a];
                            FACSDropdownArray[facsIndex].ServiceType = "fiber-pots";
                            break;
                        } else {
                            FacsDataArray["selected_iplanet"] = null;
                            FACSDropdownArray[facsIndex].ServiceType = "copper-pots";
                        }
                    }
                    break;

                case "1/23":
                    var tn = potsHsi[0];
                    var iPlanet = [];
                    var array = [];
                    /* POTS (TN) */
                    if (facs_iplanet.length > 0) {
                        for (var a = 0; a < facs_iplanet.length; a++) {
                            if (facs_iplanet[a].circuitIdField == tn) {
                                array = {
                                    Type: "fiber-pots",
                                    Array: facs_iplanet[a]
                                }

                                break;
                            } else {
                                array = {
                                    Type: "copper-pots",
                                    Array: null
                                }
                            }
                        }
                    } else {
                        array = {
                            Type: "copper-pots",
                            Array: null
                        }
                    }

                    iPlanet.push(array);
                    array = [];

                    /* HSI (CKTID) */
                    var cktId = potsHsi[1];
                    var array = [], selected_iplanet = null;
                    for (var a = 0; a < facs_iplanet.length; a++) {
                        var circuitIdField = facs_iplanet[a].circuitIdField;
                        circuitIdField = circuitIdField.replace(/\s/g, '').replace(/\.$/, '');
                        if (circuitIdField == cktId) {
                            selected_iplanet = facs_iplanet[a];
                            break;
                        } else {
                            selected_iplanet = null;
                        }
                    }

                    if (selected_iplanet != null && selected_iplanet.accessTypeField == "GPON") {
                        array = {
                            Type: "fiber-dsl",
                            Array: selected_iplanet
                        }
                    } else {
                        array = {
                            Type: "copper-dsl",
                            Array: selected_iplanet
                        }
                    }

                    iPlanet.push(array);
                    array = [];

                    FacsDataArray["selected_iplanet"] = iPlanet;
                    sideBySide = true;
                    break;
            }

            var type = FACSDropdownArray[facsIndex].ServiceType;
            $('#facs-box .page, #facs-box-left, #facs-box-right').show();
            $('.sideBySideLabel').remove();
            $('#facs-box .page .contents-block, #facs-box .page .boxTitle').empty();
            if (sideBySide) {
                facsId = potsHsi[0];
                var object = $('#facs-box-left').children('.page');
                type = FacsDataArray["selected_iplanet"][0].Type;
                setFacsSections(type, object, facsId);
                $(object[2]).hide();

                facsId = potsHsi[1];
                object = $('#facs-box-right').children('.page');
                type = FacsDataArray["selected_iplanet"][1].Type;
                setFacsSections(type, object, facsId);
                sideBySide = false;
            } else {
                var object = $('#facs-box-left').children('.page');
                setFacsSections(type, object, facsId);
                if (type.indexOf('pots') >= 0) {
                    $(object[2]).hide();
                }
                $('#facs-box-right').hide();
            }
        }

        function setFacsDetailed(type, facsId) {
            var selected_iplanet = [];
            var ifIplanetUndefined = false;
            if (sideBySide) {
                for (var i = 0; i < FacsDataArray.selected_iplanet.length; i++) {
                    if (FacsDataArray.selected_iplanet[i].Type == type) {
                        selected_iplanet = FacsDataArray.selected_iplanet[i].Array;
                        break;
                    }
                }

                if (selected_iplanet == null || selected_iplanet.length == 0) {
                    ifIplanetUndefined = true;
                }
            } else if (FacsDataArray.selected_iplanet == undefined) {
                ifIplanetUndefined = true;
            } else {
                selected_iplanet = FacsDataArray.selected_iplanet;
            }

            switch (type) {
                case "fiber-pots":
                    var nbArray = [];

                    var networkKey = document.getElementById("networkKeyTn");
                    networkKey.innerHTML = facsId;

                    var accessType = document.getElementById("accessTypeTn");
                    if (ifIplanetUndefined) {
                        accessType.innerHTML = "";
                    } else {
                        accessType.innerHTML = selected_iplanet.accessTypeField;
                    }

                    nbArray = getNBDetailed("Address");
                    if (nbArray.length > 1) {
                        facsHTML = "";
                        for (var b = 0, obj = 1; b < nbArray.length; b++, obj++) {
                            facsHTML += '<p><span>' + obj + ': </span><span id="address' + b + '">' + nbArray[b] + '</span></p>';
                        }
                        $("#serviceAddress").html(facsHTML);
                    } else {
                        var serviceAddress = document.getElementById("serviceAddress");
                        serviceAddress.innerHTML = nbArray.join(", ");
                    }

                    var serviceStatus = document.getElementById("serviceStatusTn");
                    var array = selected_iplanet;
                    if (ifIplanetUndefined) {
                        nbArray = getNBDetailed("Status");
                        serviceStatus.innerHTML = nbArray.join(", ");
                    } else {
                        if (!(array.statusField == null || array.statusField == "")) {
                            serviceStatus.innerHTML = selected_iplanet.statusField;
                        } else {
                            nbArray = getNBDetailed("Status");
                            serviceStatus.innerHTML = nbArray.join(", ");
                        }
                    }

                    var serviceTypeField = document.getElementById("serviceTypeFieldTn");
                    var array = selected_iplanet;
                    if (ifIplanetUndefined) {
                        nbArray = getNBDetailed("Service_Type");
                        serviceTypeField.innerHTML = nbArray.join(", ");
                    } else {
                        if (!(array.serviceTypeField == null || array.serviceTypeField == "")) {
                            serviceTypeField.innerHTML = selected_iplanet.serviceTypeField;
                        } else {
                            nbArray = getNBDetailed("Service_Type");
                            serviceTypeField.innerHTML = nbArray.join(", ");
                        }
                    }

                    var nativeAco = document.getElementById("nativeAco");
                    nbArray = getNBDetailed("Native_ACO");
                    nativeAco.innerHTML = nbArray.join(", ");

                    var drtn = document.getElementById("drtn");
                    nbArray = getNBDetailed("SR_TN");
                    if (nbArray.join(", ") != "") {
                        drtn.innerHTML = nbArray.join(", ");
                    } else {
                        $('#drtnHide').hide();
                    }

                    var currentAco = document.getElementById("currentAco");
                    nbArray = getNBDetailed("Current_ACO");
                    currentAco.innerHTML = nbArray.join(", ");

                    var switchType = document.getElementById("switchType");
                    nbArray = getNBDetailed("Switch_Type");
                    switchType.innerHTML = nbArray.join(", ");

                    var servingClli = document.getElementById("servingClli");
                    nbArray = getNBDetailed("CLLI");
                    servingClli.innerHTML = nbArray.join(", ");

                    var linePortId = document.getElementById("linePortId");
                    nbArray = getNBDetailed("Port");
                    linePortId.innerHTML = nbArray.join(", ");

                    // Added MITS details. 11/06/2014
                    nbArray = getNBDetailed("MITS");
                    var mitsDetails = nbArray[0] || '';
                    if (mitsDetails) {
                        mitsDetails = mitsDetails.replace(/,/g, ", ");
                        mitsDetails = '<p><span>MITS : </span>' +
                                    '<span id="mitsDetails">' + mitsDetails + '</span></p>';
                    }

                    if (!ifIplanetUndefined) {
                        var elements_value = []
                        var array = selected_iplanet.networkElementsField;
                        for (var x = 0; x < array.length; x++) {
                            var value = array[x];
                            if (elements_value.indexOf(value) < 0) {
                                elements_value.push(value);
                            }
                        }

                        facsHTML = mitsDetails; // Modified 11/06/2014
                        for (var b = 0, obj = 1; b < elements_value.length; b++, obj++) {
                            facsHTML += '<p><span>Element ' + obj + ': </span><span id="element' + b + '">' + elements_value[b] + '</span></p>';
                        }
                        $("#elementsTn").html(facsHTML);
                    }

                    var lineshareRemarks = document.getElementById("lineshareRemarks");
                    nbArray = getNBDetailed("Remarks");
                    lineshareRemarks.innerHTML = nbArray.join(", ");
                    break;

                case "copper-dsl":
                case "fiber-dsl":
                    var networkKey = document.getElementById("networkKeyCktId");
                    networkKey.innerHTML = facsId;

                    if (!ifIplanetUndefined) {
                        var serviceTypeField = document.getElementById("serviceTypeFieldCktId");
                        serviceTypeField.innerHTML = selected_iplanet.serviceTypeField;

                        var speed = document.getElementById("speed");
                        speed.innerHTML = selected_iplanet.productNameField + " / " + selected_iplanet.maxUpField;

                        var accessType = document.getElementById("accessTypeCktId");
                        accessType.innerHTML = selected_iplanet.accessTypeField;

                        var status = document.getElementById("serviceStatusCktId");
                        status.innerHTML = selected_iplanet.statusField;

                        var vlanNo = document.getElementById("vlanNo");
                        vlanNo.innerHTML = selected_iplanet.vlanField;

                        var elements_value = [];
                        var elementFields_length = selected_iplanet.networkElementsField.length;
                        for (var x = 0; x < elementFields_length; x++) {
                            var value = selected_iplanet.networkElementsField[x];
                            if (elements_value.indexOf(value) < 0) {
                                elements_value.push(value);
                            }
                        }

                        facsHTML = "";
                        for (var b = 0, obj = 1; b < elements_value.length; b++, obj++) {
                            facsHTML += '<p><span>Element ' + obj + ': </span><span id="element' + b + '">' + elements_value[b] + '</span></p>';
                        }
                        $("#elementsCktId").html(facsHTML);

                        var ipType = document.getElementById("ipType");
                        ipType.innerHTML = selected_iplanet.ipTypeField;

                        var ipTypeField = selected_iplanet.ipTypeField;
                        if (ipTypeField.toLowerCase() == "dynamic") {
                            var ipAddressList = document.getElementById("ipAddressList");
                            ipAddressList.innerHTML = "DHCP";
                        } else {
                            var ipRangesField = selected_iplanet.ipRangesField;
                            for (var x = 0; x < ipRangesField.length; x++) {
                                var ipAddressesField_value = [];
                                for (var y = 0; y < ipRangesField[x].ipAddressesField.length; y++) {
                                    var value = ipRangesField[x].ipAddressesField[y];
                                    if (ipAddressesField_value.indexOf(value) < 0) {
                                        ipAddressesField_value.push(value);
                                    }
                                }

                                var ipAddresses = ipAddressesField_value.join(", ");
                                facsHTML = '<p><span>IP Address List: </span><span>' + ipAddresses + '</span></p>'
                                    + '<p><span>Subnet Mask: </span><span id="netmaskField">' + ipRangesField[x].netmaskField + '</span></p>'
                                    + '<p><span>Default Gateway: </span><span id="gatewayField">' + ipRangesField[x].gatewayField + '</span></p>';
                                $("#ipRangesField").html(facsHTML);
                            }
                        }

                        if (type == "copper-dsl") {
                            var meetPoint = document.getElementById("meetPoint");
                            meetPoint.innerHTML = selected_iplanet.meetPointField;
                        }

                        facsHTML = "";
                        if (ipTypeField.toLowerCase() == "static") {
                            facsHTML = '<p><span>Primary DNS Server: </span><span>72.235.80.12</span></p>'
                                + '<p><span>Alternate DNS Server: </span><span>72.235.80.4</span></p>';
                            var contentsBlock = $('#ipType').parents('.contents-block');
                            contentsBlock.append(facsHTML);
                        }
                    }
                    break;

                case "copper-pots":
                    var serviceTn = document.getElementById("serviceTn");
                    serviceTn.innerHTML = facsId;

                    if (FacsDataArray.facsDetailed_nb != null) {
                        var nbArray = [];
                        var serviceTypeField = document.getElementById("serviceTypeFieldTn");
                        nbArray = getNBDetailed("Service_Type");
                        serviceTypeField.innerHTML = nbArray.join(", ");

                        var serviceStatus = document.getElementById("serviceStatusTn");
                        if (FacsDataArray.facsDetailed_nb.length > 0 || FacsDataArray.facsOverview_nb == undefined || FacsDataArray.facsOverview_nb.Status == "" || FacsDataArray.facsOverview_nb == null) {
                            nbArray = getNBDetailed("Status");
                            serviceStatus.innerHTML = nbArray.join(", ");
                        } else {
                            var facsOverview = FacsDataArray.facsOverview_nb;
                            nbArray = [];
                            for (var x = 0; x < facsOverview.length; x++) {
                                if (nbArray.indexOf(facsOverview[x].Status) < 0) {
                                    nbArray.push(facsOverview[x].Status);
                                }
                            }
                            serviceStatus.innerHTML = nbArray.join(", ");
                        }

                        var nativeAco = document.getElementById("nativeAco");
                        nbArray = getNBDetailed("Native_ACO");
                        nativeAco.innerHTML = nbArray.join(", ");

                        var drtn = document.getElementById("drtn");
                        nbArray = getNBDetailed("SR_TN");
                        if (nbArray.join(", ") != "") {
                            drtn.innerHTML = nbArray.join(", ");
                        } else {
                            $('#drtnHide').hide();
                        }

                        var currentAco = document.getElementById("currentAco");
                        nbArray = getNBDetailed("Current_ACO");
                        currentAco.innerHTML = nbArray.join(", ");

                        var switchType = document.getElementById("switchType");
                        nbArray = getNBDetailed("Switch_Type");
                        switchType.innerHTML = nbArray.join(", ");

                        var servingClli = document.getElementById("servingClli");
                        nbArray = getNBDetailed("CLLI");
                        servingClli.innerHTML = nbArray.join(", ");

                        var linePortId = document.getElementById("linePortId");
                        nbArray = getNBDetailed("Port");
                        linePortId.innerHTML = nbArray.join(", ");

                        var lineshareRemarks = document.getElementById("lineshareRemarks");
                        nbArray = getNBDetailed("Remarks");
                        lineshareRemarks.innerHTML = nbArray.join(", ");

                        nbArray_address = getNBDetailed("Address");
                        nbArray_facs = getNBDetailed("Facilities");
                        nbArray_mits = getNBDetailed("MITS");
                        facsHTML = "";
                        if (nbArray_address.length == 1) {
                            var facDetails = nbArray_facs[0];
                            var mitsDetails = nbArray_mits[0];
                            if (typeof facDetails === undefined || facDetails == null) {
                                facDetails = "";
                            }

                            if (typeof mitsDetails === undefined || mitsDetails == null) {
                                mitsDetails = "";
                            } else {
                                mitsDetails = (mitsDetails + "").replace(/,/g, ", ");
                            }

                            facsHTML += '<p><span>Customer Address: </span><span id="address_0">' + nbArray_address[0] + '</span></p>'
                            + '<p><span>MITS: </span><span id="mitsDetails_0">' + mitsDetails + '</span></p>'
                            + '<p><span>FAC: </span><span id="facDetails_0">' + facDetails + '</span></p>';
                        } else {
                    
                            for (var b = 0, obj = 1; b < nbArray_address.length; b++, obj++) {
                                var facDetails = nbArray_facs[b];
                                var mitsDetails = (nbArray_mits[b] + "").replace(/,/g, ", ");

                                if (typeof facDetails === undefined || facDetails == null) {
                                    facDetails = "";
                                }

                                if (typeof mitsDetails === undefined || mitsDetails == null) {
                                    mitsDetails = "";
                                } else {
                                    mitsDetails = (mitsDetails + "").replace(/,/g, ", ");
                                }
                                
                                facsHTML += '<p class="custAdd" style="margin-top: 0.3em;"><span>Customer Address ' + obj + ': </span><span id="address_' + b + '">' + nbArray_address[b] + '</span></p>';
                                if (b == 0) {
                                    facsHTML += '<p><span>MITS : </span><span id="mitsDetails_' + b + '">' + mitsDetails + '</span></p>';
                                }                             
                                facsHTML += '<p><span>FAC ' + obj + ': </span><span id="facDetails_' + b + '">' + facDetails + '</span></p>';
                               
                             
                                
                             
                                var facDetails_value = nbArray_facs[b];
                                if ((facDetails_value != null) && (facDetails_value.length > 20) && !(/\s/.test(facDetails_value))) {
                                    $("#facDetails" + b).parent().css({
                                        'display': 'inline-block',
                                        'word-break': 'break-all'
                                    });
                                }
                            }

                            $('#lineshareRemarks').parent().css('margin-top', '0.3em');
                        }
                        $("#addresses_facs").html(facsHTML);
                    }
                    break;
            }
        }

        function getNBDetailed(field) {
            var facsDetailed_nb = FacsDataArray.facsDetailed_nb;
            var array = [];
            for (var x = 0; x < facsDetailed_nb.length; x++) {
                if ((field == "MITS") && (array.indexOf(facsDetailed_nb[x][field]) < 0)) {
                    array.push(facsDetailed_nb[x][field]);
                } else {
                    if ((facsDetailed_nb[x][field] != "") && (array.indexOf(facsDetailed_nb[x][field]) < 0)) {
                        if (field == "Address") {
                            var address = facsDetailed_nb[x][field];
                            var house = address.substr(0, address.indexOf(' '));
                            if ((house.length == 9) && ((/([-])\w+([+])/g).test(house))) {
                                house = house.replace(/([+])/g, "-");
                                var other = address.substr(address.indexOf(' ') + 1, address.length);
                                address = house + " " + other;
                            }
                            facsDetailed_nb[x][field] = address;
                        }
                        array.push(facsDetailed_nb[x][field]);
                    }
                }
            }
            return array;
        }

        var facsHTML;
        function setFacsSections(type, object, facsId) {
            switch (type) {
                case "copper-pots":
                    facsHTML = '<p><span>TN: </span><span id="serviceTn"></span></p>'
                        + '<p id="drtnHide"><span>DR TN: </span><span id="drtn"></span></p>'
                        + '<p><span>Service Type: </span><span id="serviceTypeFieldTn"></span></p>'
                        + '<p><span>Service Status: </span><span id="serviceStatusTn"></span></p>'                      
                        + '<p><span>Native ACO: </span><span id="nativeAco"></span></p>'
                        + '<p><span>Current ACO: </span><span id="currentAco"></span></p>'
                        + '<p><span>Switch: </span><span id="switchType"></span></p>'
                        + '<p><span>Serving CLLI: </span><span id="servingClli"></span></p>';
                    //$('#facs-section-1 .contents-block').html(facsHTML);                    
                    $(object[0]).find('.boxTitle').text('Service Details');
                    if (sideBySide) {
                        $(object[0]).find('.boxTitle').before('<p class="sideBySideLabel" style="font-weight: bold;">POTS:</p>');
                    }
                    $(object[0]).find('.contents-block').html(facsHTML);

                    facsHTML = '<p><span>Line or Port ID: </span><span id="linePortId"></span></p>'
                        + '<div id=addresses_facs></div>'
                        + '<p><span>LS Remarks: </span><span id="lineshareRemarks"></span></p>';

                    $(object[1]).find('.boxTitle').text('Facility Details');
                    $(object[1]).find('.contents-block').html(facsHTML);
                    break;

                case "copper-dsl":
                case "fiber-dsl":
                    facsHTML = '<p><span>Network Key: </span><span id="networkKeyCktId"></span></p>'
                        + '<p><span>Service Type: </span><span id="serviceTypeFieldCktId"></span></p>'
                        + '<p><span>Speed: </span><span id="speed"></span></p>'
                        + '<p><span>Access Type: </span><span id="accessTypeCktId"></span></p>'
                        + '<p><span>Service Status: </span><span id="serviceStatusCktId"></span></p>';
                    $(object[0]).find('.boxTitle').text('Service Details');
                    if (sideBySide) {
                        $(object[0]).find('.boxTitle').before('<p class="sideBySideLabel" style="font-weight: bold;">HSI:</p>');
                    }
                    $(object[0]).find('.contents-block').html(facsHTML);

                    facsHTML = '<p><span>VLAN#: </span><span id="vlanNo"></span></p>'
                        + '<div id="elementsCktId"><p><span>Element: </span></p></div>';
                    if (type == "copper-dsl") {
                        facsHTML += '<p><span>Meet Point: </span><span id="meetPoint"></span></p>'
                    }
                    $(object[1]).find('.boxTitle').text('Facility Details');
                    $(object[1]).find('.contents-block').html(facsHTML);

                    facsHTML = '<p><span>IP Type: </span><span id="ipType"></span></p>'
                        + '<div id=ipRangesField><p><span>IP Address List: </span><span id="ipAddressList"></span></p></div>';
                    $(object[2]).find('.boxTitle').text('IP Details');
                    $(object[2]).find('.contents-block').html(facsHTML);
                    break;

                case "fiber-pots":
                    facsHTML = '<p><span>Network Key: </span><span id="networkKeyTn"></span></p>'
                        + '<p id="drtnHide"><span>DR TN: </span><span id="drtn"></span></p>'
                        + '<p><span>Access Type: </span><span id="accessTypeTn"></span></p>'
                        + '<p><span>Customer Address: </span><span id="serviceAddress"></span></p>'
                        + '<p><span>Service Status: </span><span id="serviceStatusTn"></span></p>'
                        + '<p><span>Service Type: </span><span id="serviceTypeFieldTn"></span></p>'
                        + '<p><span>Native ACO: </span><span id="nativeAco"></span></p>'
                        + '<p><span>Current ACO: </span><span id="currentAco"></span></p>'
                        + '<p><span>Switch: </span><span id="switchType"></span></p>'
                        + '<p><span>Serving CLLI: </span><span id="servingClli"></span></p>';
                    $(object[0]).find('.boxTitle').text('Service Details');
                    if (sideBySide) {
                        $(object[0]).find('.boxTitle').before('<p class="sideBySideLabel" style="font-weight: bold;">POTS:</p>');
                    }
                    $(object[0]).find('.contents-block').html(facsHTML);

                    facsHTML = '<p><span>Line or Port ID: </span><span id="linePortId"></span></p>'
                        + '<div id="elementsTn"><p><span>Element: </span></div>'
                        + '<p><span>LS Remarks: </span><span id="lineshareRemarks"></span></p>';
                    $(object[1]).find('.boxTitle').text('Network Info');
                    $(object[1]).find('.contents-block').html(facsHTML);
                    break;
            }

            setFacsDetailed(type, facsId);
        }

        /* end of Facilities */

        /* Logout Function */
        $('#triangle-menu').click(function () {
            var e = document.getElementById('gearMenu');
            if (e.style.display === 'block')
                e.style.display = 'none';
            else
                e.style.display = 'block';
        });

        $(document).mouseup(function (e) {
            var container = $("#gearMenu");
            var container2 = $("#gearMenu ul");
            var container3 = $("#gearMenu ul li");
            var container4 = $('#triangle-menu');

            if (!container.is(e.target) && !container2.is(e.target) && !container3.is(e.target) && !container4.is(e.target))  // if the target of the click isn't the container...
            {
                container.hide();
            }
        });

        $('#lblLogoff').click(function () {
            createCookie("logoff", 1, 1);
        });

        $('#lblGoToCRM').click(function () {
            createCookie("dashCRM", 1, 1);
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

        /*function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name, "", -1);
        }*/
        /*end of Logout*/

        /*function truncate(string, len) {
            var word = decodeURI(string);
            if (word.length > len)
                return word.substring(0, len) + '...';
            else
                return word;
        };*/
    });
}