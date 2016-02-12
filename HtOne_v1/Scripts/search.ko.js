



var vm;

var ticker = function (type, status, descr) {
    var self = this;
    self.type = type;
    self.status = status;
    self.descr = descr;
}

ko.observable.fn.beginEdit = function (transaction, selection) {

    var self = this;
    var commitSubscription,
        rollbackSubscription;
    self.enumSelection = ko.observableArray(selection);
    self.enumEditValue = _.where(self.enumSelection(), { Id: self() });


    // get the current value and store it for editing
    if (self.enumSelection.length == 0) {
        if (self.slice) {
            self.editValue = ko.observableArray(self.slice());
        }
        else {
            self.editValue = ko.observable(self());
        }
    }
    else {

        var enumValue = self.enumEditValue;
        // var even = ;
        var id = enumValue[0].Id;

        self.editValue = ko.observable(enumValue[0].Id);


    }

    self.dispose = function () {
        // kill this subscriptions
        commitSubscription.dispose();
        rollbackSubscription.dispose();
    };

    self.commit = function () {
        // update the actual value with the edit value

        if (self.enumSelection.length == 0) {
            self(self.editValue());
        }
        else {

            var enumValue = self.enumEditValue;
            // var even = ;
            var id = enumValue[0].Id;

            self(ko.observable(enumValue[0].Id));


        }

        //self(self.editValue());

        // dispose the subscriptions
        self.dispose();
    };

    self.rollback = function () {
        // rollback the edit value
        self.editValue(self());

        // dispose the subscriptions
        self.dispose();
    };

    //  subscribe to the transation commit and reject calls
    commitSubscription = transaction.subscribe(self.commit,
                                                self,
                                                "commit");

    rollbackSubscription = transaction.subscribe(self.rollback,
                                                    self,
                                                    "rollback");

    return self;
}


/*----------------------------------------------------------------------*/
/* Item Model
/*----------------------------------------------------------------------*/

var itemTypeEnum = [{ Id: 0, Name: "Information" }, { Id: 1, Name: "Outage" }];
var statusEnum = [{ Id: 0, Name: "Open" }, { Id: 1, Name: "Closed" }];


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
    self.Status = ko.observable(status);
    self.LastModBy = ko.observable(_lastModBy);
    self.LastModDate = ko.observable(_lastModDate);
    self.hasError = ko.observable(false);
    self.validationMessage = ko.observable();
    
};

TickerInfo.prototype.beginEdit = function (transaction) {
    this.CreateDate.beginEdit(transaction, []);
    this.AddedBy.beginEdit(transaction, []);
    this.ItemType.beginEdit(transaction, itemTypeEnum);
    this.Description.beginEdit(transaction, []);
    this.Status.beginEdit(transaction, statusEnum);
    this.LastModBy.beginEdit(transaction, []);
    this.LastModDate.beginEdit(transaction, []);
}



var SearchViewModel = function () {

    var self = this;


    // Ticker refresh time observable/s
    self.TickerElapse = ko.observable(300000); // Default to 5 minutes (300000 milliseconds) if no data in config file
    self.ManageTickerIsShown = ko.observable(false);

    // Call api to get refresh time in web.config
    $.ajax({
        url: 'api/ticker/GetTickerRefreshTime',
        success: function (data) {
            self.TickerElapse(data || self.TickerElapse());
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.responseJSON.MessageDetail || errorThrown);
        }
    });


    
    self.isAdmin = ko.observable(true);
    self.adminUsername = ko.observable();
    self.allSelected = ko.observable(false);
    self.tickerInfoLoaded = ko.observable(false);
    self.selectAll = function () {
        var all = self.allSelected();
        ko.utils.arrayForEach(self.TickerInfos(), function (tickerInfo) {
            tickerInfo.isSelected(!all);
        });
        return true;
    }

    self.TickerInfos2 = ko.observableArray();

    var count = 0;
    //  data
    //self.forDeleteAll = ko.observable(true);
    //self.itemsChecked = ko.observableArray();
    self.editingItem = ko.observable();
    self.TickerInfos = ko.observableArray();
    self.newAddedItems = ko.observableArray([]);

    //  create the transaction for commit and reject
    self.editTransaction = new ko.subscribable();

    self.filterText = ko.observable();

    self.HasOpenInfo = ko.computed(function () {
        var ret = false;
        ret = self.TickerInfos().some(function(element, index, array){
            if (element.Status() == 0) {
                return true;
            }
            return false;
        });
        return ret;
    });

    self.isItemEditing = function (tickerInfo) {
        
        return tickerInfo == self.editingItem();
    };
    
    self.emptyFilterText = function () {
        self.filterText(null);
    }

    self.deleteChecked = function () {
        var len = self.itemsChecked().length;
    }


    self.deleteSelected = function () {
        var all = self.allSelected();

        var hasSelectedItemforDeletion = _.filter(self.TickerInfos(), function (item) { return item.isSelected() == true; })

        if (hasSelectedItemforDeletion.length > 0) {
            var answer = confirm('Are you sure you want to remove the items selected?');
            if (answer) {
                self.TickerInfos.remove(function (item) {
                    var _item = item;


                    if (item.isSelected() == true) {
                        $.ajax({
                            url: 'api/Ticker/DeleteTicker?id=' + item.TickerInfoId(),
                            dataType: 'json',
                            global: false
                        });
                    }
                    return item.isSelected() == true;

                })
                toastr.success("Items Removed");

                // Restart marquee to exclude item/s.
                $mq.marquee('destroy');
                $('.marquee').html($('.hidden_tickers').html());
                $mq = $('.marquee').marquee({
                    pauseOnHover: true,
                    //duplicated: true,
                    duration: 15000
                });
            }
        }



    }


    self.addTickerInfo = function () {

        //var tickerInfo = new TickerInfo(0, this.formatDate(new Date()), self.adminUsername(), 0,"", 0, "", null);
        var tickerInfo = new TickerInfo(0, new Date(), self.adminUsername(), 0, "", 0, "", null);
        self.TickerInfos.push(tickerInfo);
        self.newAddedItems.push(tickerInfo);
        self.editTickerInfo(tickerInfo);

    };

    self.sort = function () {

        self.TickerInfos.sort(function (l, r) {
            return l.CreateDate == r.CreateDate ? 0 : (l.CreateDate > r.CreateDate ? -1 : 1);
        });
    }

    self.cancelEdit = function (tickerInfo) {
        tickerInfo.hasError(false);
        tickerInfo.validationMessage('');
        //  reject the edit transaction
        var id = tickerInfo.TickerInfoId();
        //self.editTransaction.notifySubscribers(null, "rollback");

        if (self.newAddedItems.indexOf(tickerInfo) > -1) {
            var answer = true; //confirm('Do you want to remove this item ?');
            if (answer) {
                self.TickerInfos.remove(tickerInfo);
            }
            self.newAddedItems.remove(tickerInfo);

        }
        //  hides the edit fields
        self.editingItem(null);
    };


    self.editTickerInfo = function (tickerInfo) {
        //self.sort()
        var id = tickerInfo.TickerInfoId();
        if (self.editingItem() == null) {
            // start the transaction
            tickerInfo.beginEdit(self.editTransaction);
            // shows the edit fields
            self.editingItem(tickerInfo);
        }
    };


    self.removeTickerInfo = function (tickerInfo) {
        var id = tickerInfo.TickerInfoId();
        if (self.editingItem() == null) {
            var answer = confirm('Are you sure you want to remove this item?');
            if (answer) {
                $.ajax({
                    url: 'api/Ticker/DeleteTicker?id=' + id,
                    dataType: 'json',
                    global: false
                });

                self.TickerInfos.remove(tickerInfo)
                toastr.success("Item Removed");

                // Restart marquee to exclude new item/s.
                $mq.marquee('destroy');
                $('.marquee').html($('.hidden_tickers').html());
                $mq = $('.marquee').marquee({
                    pauseOnHover: true,
                    //duplicated: true,
                    duration: 15000
                });
            }
        }
    };

    self.applyTickerInfo = function (tickerInfo) {
        var id = tickerInfo.TickerInfoId();

        tickerInfo.hasError(false);
        tickerInfo.validationMessage('');

        //var desc = tickerInfo.Description();
        //var editValue = tickerInfo.Description.editValue();
       
        var desc = tickerInfo.Description.editValue();


        if (tickerInfo.Description.editValue() == "") {
            tickerInfo.hasError(true);
            tickerInfo.validationMessage('Description is required');
            return false;
        }
        //else if (desc.length > 256) {
        //    tickerInfo.hasError(true);
        //    tickerInfo.validationMessage('Description has ' + desc.length + ' characters. Only 256 characters are allowed. ');
        //    return false;
        //}
        
        //var descLen = desc.length;

       // self.descriptionValid(false);
        //  commit the edit transaction
        self.editTransaction.notifySubscribers(null, "commit");

        //var itemType = tickerInfo.ItemType();
        //var status = tickerInfo.Status();

        if (self.newAddedItems.indexOf(tickerInfo) > -1) {
            //alert("item added")

            var message = {
                MSG_ID: 0,
                MSG_DESCR: tickerInfo.Description(),
                MSG_TYPE: tickerInfo.ItemType(),
                MSG_STATUS: tickerInfo.Status(),
                ADDED_ON: self.formatDate(new Date()), //tickerInfo.CreateDate(),
                ADDED_BY: null,
                MODIFIED_ON: null,
                MODIFIED_BY: null,
                DELTETED_ON: null,//JSON.stringify(new Date()),  //model.formatDate(new Date()), //(new Date()).toString(),//'1/1/1900 12:00:00 AM',
                DELETED_BY: null
            };


            $.ajax({
                url: 'api/Ticker/AddTicker',
                global: false,
                type: 'POST',
                data: message,
                success: function (returnedData) {
                    var newId = returnedData;
                    tickerInfo.TickerInfoId(newId);
                    toastr.success("Item Added");
                    self.newAddedItems.remove(tickerInfo);
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(JSON.parse(xhr.responseText).responseText)
                }
            });

          
        }
        else {

            var message = {
                MSG_ID: tickerInfo.TickerInfoId(),
                MSG_DESCR: tickerInfo.Description(),
                MSG_TYPE: tickerInfo.ItemType(),
                MSG_STATUS: tickerInfo.Status(),
                ADDED_ON: self.formatDate(tickerInfo.CreateDate()),
                ADDED_BY: tickerInfo.AddedBy(),
                MODIFIED_ON: null,
                MODIFIED_BY: null,
                DELTETED_ON: null,//JSON.stringify(new Date()),  //model.formatDate(new Date()), //(new Date()).toString(),//'1/1/1900 12:00:00 AM',
                DELETED_BY: null
            };


            $.ajax({
                url: 'api/rest/Ticker/' + tickerInfo.TickerInfoId(),
                global: false,
                type: 'PUT',
                data: message,
                success: function (dateModified) {
                    toastr.success("Item Updated");
                    tickerInfo.LastModBy(self.adminUsername());
                    tickerInfo.LastModDate(dateModified);
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(JSON.parse(xhr.responseText).responseText)
                }
            });


          
        }

        // Restart marquee to include new item/s.
        $mq.marquee('destroy');
        $('.marquee').html($('.hidden_tickers').html());
        $mq = $('.marquee').marquee({
            pauseOnHover: true,
            //duplicated: true,
            duration: 15000
        });

       
        //  hides the edit fields
        self.editingItem(null);

    };

    //self.errors = ko.validation.group(self);

    self.formatDate = function (_date) {


        if (_date == '' || _date == null) {
           return "";
        }

        return moment(_date).format('YYYY-MM-DD HH:mm');


    }


    self.isUserAdmin = function () {
        //self.isAdmin(true);
        Q.when(

            $.ajax({
                url: 'api/Ldap/IsAdmin'
            })

        ).then(function (res) {

            var _res = res;
            self.isAdmin(res);

        });
    }

    self.getAdminUsername = function () {

        Q.when(

            $.ajax({
                url: 'api/Ldap/GetAdminUsername'
            })

        ).then(function (res) {

            var _res = res;
            self.adminUsername(res);

        });
    }


    self.openManageTicker = function () {
        self.ManageTickerIsShown(true); // Used in ticker auto refresh
        //vm.TickerInfos([]);
        //vm.tickerInfoLoaded(false);

        //$.ajax({
        //    url: 'api/Ticker/GetAllTickers',
        //    global: false,
        //    success: function (data) {
        //        vm.tickerInfoLoaded(true);
        //        $.each(data, function (i, tickInfo) {
        //            var tickInfoMapped = new TickerInfo(tickInfo.MSG_ID, tickInfo.ADDED_ON, tickInfo.ADDED_BY, tickInfo.MSG_TYPE, tickInfo.MSG_DESCR, tickInfo.MSG_STATUS, tickInfo.MODIFIED_BY, vm.formatDate(tickInfo.MODIFIED_ON));
        //            //var tickInfoMapped = new TickerInfo(tickInfo.TickerInfoId, tickInfo.CreateDate, tickInfo.AddedBy, tickInfo.ItemType, tickInfo.Description, tickInfo.Status, tickInfo.LastModBy, model.formatDate(tickInfo.LastModDate));
        //            vm.TickerInfos.push(tickInfoMapped);
        //        });


        //    },
        //    error: function (xhr, textStatus, errorThrown) {
        //        alert(JSON.parse(xhr.responseText).responseText)
        //    }
        //});

        $("#managTicker-dialog").on("dialogclose", function (event, ui) {
            self.ManageTickerIsShown(false);
        });
        $("#managTicker-dialog").dialog("open");

    }

    self.statuses = statusEnum; //[{ Id: 0, Name: "Open" }, { Id: 1, Name: "Closed" }];
    self.itemTypes = itemTypeEnum; //[{ Id: 0, Name: "Information" }, {Id:1, Name: "Outage"}];

    self.getEnumName = function (list, val) {
        var item = _.where(list, { Id: val })
        return item[0].Name;

    }



}
