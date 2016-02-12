function initialize() {
    $(document).ready(function () {
        /*---- Placeholder ----*/
        function addPlaceholder() {
            if ($(this).val() === '') {
                if ($(this).attr("type") == "password") {
                    $(this).attr("type", "text");
                }
                $(this).val($(this).attr('placeholder')).addClass('placeholder');
                $(this).css('color', 'gray');
            }
        }

        function removePlaceholder() {
            if ($(this).val() === $(this).attr('placeholder')) {
                if ($(this).attr('placeholder') == "Password") {
                    $(this).attr("type", "password");
                }
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
      
        var cooks = readCookie('ASP.NET_SessionId');

        $('#ImageButton2').click(function () {
            var userName = document.getElementById('username').value;
            createCookie('loginCookie', userName, 1);
        })

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
    });
}