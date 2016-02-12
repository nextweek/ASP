<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Popup.aspx.cs" Inherits="HtOne_v1.Popup" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <%--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> Rachel, 09/26 [Get Local Copy of Files] --%>
    <script src="Scripts/jQuery/1.11.1/jquery.min.js" type="text/javascript"></script>
    <title>HT One</title>
        <style>
        body {
            overflow-x: hidden;
            overflow-y: auto;
        }

        #message-container {
            font-family: "Segoe UI", Arial, Tahoma;
            font-size: 0.75em;
            margin-top: 5%;
            margin-left: 2%;
        }

        #HTimage {
            margin-top: 4%;
            margin-left: 2%;
        }

        #btnOk {
            background: #00A9E0;
            color: white;
            font-size: 1em;
            position: absolute;
            border: none;
            margin: auto;
            left: 0;
            right: 0;
            margin-top: 8%;
            width: 80px;
            height: 20px;
        }
    </style>
</head>
<body>
    <div id="notification">
        <img id="HTimage" src="Images/HawaiianTelcom_logo_black.png" />
        <div id="message-container">
            <div>
                <p id="message">Your HT ONE session is about to timeout. Please go back to the HT ONE App immediately to continue your current session.
                <br />
                <br />
                Remaining Time : <span id="window_timeLeft" style="font-weight: bold"></span></p>
            </div>
            <input type="button" value="OK" id="btnOk" />
        </div>
    </div>
</body>
</html>
