$(document).ready(function () {

    $("#logoff").click(function () {
        $("#LogoffButton").click();
        createCookie('loginCookie', 0, 1);
        //setTimeout(function () {
        if (windows[0] != false) {
            windows[0].close();
        }
        if (windows[1] != false) {
            windows[1].close();
        }
        if (windows[2] != false) {
            windows[2].close();
        }
        //}, 1000);
    });


    $("#btnCRM").click(function () {
        var params;

        params = 'width=' + screen.width;
        params += ',height=' + screen.height;
        params += ',top=0,left=0';
        params += ',resizable=yes';
        params += ',fullscreen=yes';

        if (crmWindow == null || crmWindow.closed) {
            crmWindow = window.open('http://insideht.hawaiiantel.com:3500/psp/crmprd/?cmd=login', '_blank', params, "winCRM");
        }
        crmWindow.focus();
    });

    //IDLE TIMEOUT------------------
    //3600 - 1 hour
    //2700 - 45minutes
    var IDLE_TIMEOUT = 3600; //seconds
    var PRIOR = 2700; //seconds

    var _idleSecondsCounter = 0;
    var _remainingSecondsCounter = 0;
    var active = false;

    var remaining; //variable to handle setInterval of remaining time
    var myWindow; //variable for new window
    var myWindow2; //variable for new window 2

    var crmWindow; //variable for crm window

    var timerCookie;
    var timer; // this variable will be used to get the cookie of time.
    var loginCookie = null;

    var maxAlert, maxWindow;


    $('html').bind('mousemove keypress onclick', function () {
        createCookie("time", 0, 1);

        loginCookie = parseInt(readCookie('loginCookie'));
        if (loginCookie === 0) {
            setTimeout(function () {
                $("#logoff").click();
                createCookie('loginCookie', NaN, 1);
            }, 1000);
        }

    });

    $(window).on("mousemove click", function (e) {
        if (myWindow != undefined || myWindow != null) {
            if (!myWindow.closed) {
                window_timeLeft = undefined;
                _idleSecondsCounter = 0;
                _remainingSecondsCounter = 0;
                clearInterval(prior);
                clearInterval(remaining);
                createCookie("time", 0, 1);
                prior = window.setInterval(CheckPriorTime, 1000);
                myWindow.close();
            }
        }

        _idleSecondsCounter = readCookie("time");

    })

    var prior = window.setInterval(CheckPriorTime, 1000); //variable to handle setInterval of prior time

    //TIMER on the background
    function CheckPriorTime() {
        //var timerCounter = document.getElementById("time");
        //if (timerCounter)
        var time = secondsToHms(PRIOR - _idleSecondsCounter);
        //timerCounter.innerHTML = time + "";
        var dashboardLogoff = parseInt(readCookie("logoff"));
        var dashboardCRM = parseInt(readCookie("dashCRM"));
        timer = readCookie("time");
        maxAlert = parseInt(readCookie("maxAlert"));

        _idleSecondsCounter++;

        if (timer != null) {
            timerCookie = timer;
            _idleSecondsCounter = timerCookie;
            eraseCookie("time");
        }
        else if (_idleSecondsCounter >= (PRIOR)) {
            clearInterval(prior);
            openWarningWindow(secondsToHms(IDLE_TIMEOUT - PRIOR));
            remaining = window.setInterval(CheckRemainingTime, 1000);
        }

        if (dashboardLogoff === 1) {
            createCookie("logoff", 0, 1);
            createCookie("time", 0, 1);
            clearInterval(prior);
            $("#logoff").click();
        }

        if (dashboardCRM === 1) {
            createCookie("dashCRM", 0, 1);
            setTimeout(function () {
                $("#btnCRM").click();
            }, 500);
        }

        //if (maxAlert === 1) {
        //    openMaxAlertWindow();
        //}
    }

    var time_div;
    //TIMER on the notification
    function CheckRemainingTime() {

        var timeLeft = secondsToHms((IDLE_TIMEOUT - PRIOR) - _remainingSecondsCounter);

        if (window_timeLeft === undefined || window_timeLeft === null) {
            window_timeLeft = myWindow.document.getElementById("window_timeLeft");
        }

        window_timeLeft.innerHTML = timeLeft + "";
        _remainingSecondsCounter++;
        timer = readCookie("time");

        if (timer != null) {
            if (myWindow != undefined || myWindow != null) {
                if (!myWindow.closed) {
                    window_timeLeft = undefined;
                    _idleSecondsCounter = 0;
                    _remainingSecondsCounter = 0;
                    clearInterval(prior);
                    clearInterval(remaining);
                    prior = window.setInterval(CheckPriorTime, 1000);
                    myWindow.close();
                }
            }
        }

        if (window_timeLeft.innerHTML === "0:00") {
            myWindow.close();
            clearInterval(remaining);
            openLoggedoutWindow();
            setTimeout(function () {
                $("#logoff").click();
            }, 1000);
        }
    }

    //Seconds to HHMMSS Conversion
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
    }

    var window_timeLeft;
    function openWarningWindow(timeLeft) {
        var left = (screen.width / 2) - (360 / 2);
        var top = (screen.height / 2) - (270 / 2);
        var okBtn;

        myWindow = window.open('Popup.aspx', '_blank', 'toolbar=no, location=no, scrollbars=1, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=360px, height=270px, top=' + top + ', left=' + left, 'HT');
        setTimeout(function () {
            myWindow.focus();
            window_timeLeft = myWindow.document.getElementById("window_timeLeft");
            window_timeLeft.innerHTML = timeLeft;            

            okBtn = myWindow.document.getElementById("btnOk");
            okBtn.addEventListener("click", function () {
                window_timeLeft = undefined;
                _idleSecondsCounter = 0;
                _remainingSecondsCounter = 0;
                clearInterval(prior);
                clearInterval(remaining);
                createCookie("time", 0, 1);
                prior = window.setInterval(CheckPriorTime, 1000);
                myWindow.close();
            });            
        }, 1000);

        /*setTimeout(function () {
            window_timeLeft = myWindow.document.getElementById("window_timeLeft");
            window_timeLeft.innerHTML = timeLeft;
        }, 1000);*/

        /*setTimeout(function () {
            okBtn = myWindow.document.getElementById("btnOk");
            okBtn.addEventListener("click", function () {
                window_timeLeft = undefined;
                _idleSecondsCounter = 0;
                _remainingSecondsCounter = 0;
                clearInterval(prior);
                clearInterval(remaining);
                prior = window.setInterval(CheckPriorTime, 1000);
                myWindow.close();
            });
        }, 2000);*/
    }

    function openLoggedoutWindow() {
        var left = (screen.width / 2) - (360 / 2);
        var top = (screen.height / 2) - (270 / 2);

        myWindow2 = window.open('Popup.html', '_blank', 'toolbar=no, location=no, scrollbars=1, directories=no, status=no, menubar=no, resizable=no, copyhistory=no, width=360px, height=270px, top=' + top + ', left=' + left, 'HT');
        myWindow2.focus();
    }

    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
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
        createCookie(name, null, -1);
    }

});