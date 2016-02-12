<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="HtOne_v1.Login" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta name="viewport" content="width=device-width" />
    <title>HT ONE Portal - Login</title>

    <%--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> Rachel, 09/26 [Get Local Copy of Files] --%>
    <script src="Scripts/jQuery/1.11.1/jquery.min.js" type="text/javascript"></script>

    <script src="Scripts/login.js" type="text/javascript"></script>
    <link href="Styles/login.css" rel="stylesheet" type="text/css" />
  
</head>
<body onload="initialize()">

    <div><span><img src="Images/htone_Logo_top_left.png"  /></span><span class="floatRight"> <img src="Images/htchain_Logo_top_right.png" id="Img3" /></span></div>
    <div id="loginContainer">
        <div class="row">
          <span> <img src="Images/htone_Logo_top_left.png" id="htLogo" /></span><span class="floatRight"> <img src="Images/htchain_Logo_top_right.png" id="Img1" /></span>
        </div>
      

        <%--<form id="form1" runat="server">
        <asp:TextBox id="input1" runat="server"></asp:TextBox>
        <asp:Button id="submitButton" runat="server" Text="Submit" OnClick="SubmitForm" />
        </form>--%>

        <form id="Form1" role="form" class="ontop" runat="server">
            <div class="space-min"> </div>
                       
            <div class="container col-md-12">
                    <div id="textBoxDiv">
                        <asp:TextBox ID="username" CssClass="loginTxtBox" runat="server" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Username'" placeholder="Username"></asp:TextBox>
                        <asp:TextBox ID="passwd"  CssClass="loginTxtBox" type="password" runat="server" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Password'" placeholder="Password"></asp:TextBox>
                </div>

                <div class="loginBtn">
                    <asp:ImageButton class="arrow" src="Images/arrow.png" OnClick="SubmitForm" ID="ImageButton2" runat="server" />
                </div>

	            <div id="errorContainer">
                    <span id="errorMessage"><asp:Label ID="Label1" runat="server" Text="" ForeColor="Red"></asp:Label></span>
                </div>
                          
            </div>
        </form>
    </div>
</body>
</html>