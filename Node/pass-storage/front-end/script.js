Util.run(function UI() {
   $('#form > .container > .content > div > .input > .error').hide(0);
    $('#content').css({width: screen.availWidth, height: screen.availHeight});
    $('#form > .container > .switch > input').on('change', event => {
        let target = $('#form > .container > .content > div');
        $('#form > .container > .content').css('overflow-x', 'hidden');
        if(event.target.id === 'login') target.animate({left: 0}, 250, () => $('#form > .container > .content').css('overflow-x', 'visible'));
        else target.animate({left: -295}, 250, () => $('#form > .container > .content').css('overflow-x', 'visible'));
    });
    $('#form > .container > .content > div > .input > input').on('focus', function() {
        $(this).removeClass('inactive');
    });
    $('#form > .container > .content > div > .input > .fas').hover(
        function() {
            $(this).next().show(250);
            let elem = $(this).prev()[0];
            let msg = elem.validationMessage;
            let icon = 'fas fa-times';
            let color = 'var(--red)';
            let main = $(this).next();
            let validity = elem.validity;
            if(validity.valid) {
                msg = 'No Errors Detected.';
                icon = 'fas fa-check';
                color = 'var(--green)';
            }
            if(validity.patternMismatch) msg += ' ' + elem.pattern;
            main.css('--c', color)
                .children('.fas')
                .attr('class', icon)
                .next().text(msg);
        },
        function() {$(this).next().hide(250)}
    );
    $('#form > .container > .content > div > .input > input').on('keypress', function(event) {
      if(event.which !== 13) return;
      event.preventDefault();
      let next = $(this).parent().next();
      if(next.hasClass('input')) next = next.children('input');
      else next = $('#form > .container > .submit');
      next.trigger('click').trigger('focus');
    });
    $('#form > .container > .content > div > .input.pass > .fas').on('click', function() {
        $(this).toggleClass('active');
        if($(this).hasClass('active')) $(this).addClass('fa-lock-open').removeClass('fa-lock').prev().attr('type', 'text');
        else $(this).addClass('fa-lock').removeClass('fa-lock-open').prev().attr('type', 'password');
    });
    $('#form > .container > .content > div > .input.confirm > .fa').on('click', function() {
        $(this).toggleClass('active');
        if($(this).hasClass('active')) $(this).addClass('fa-spell-check').removeClass('fa-check').prev().attr('type', 'text');
        else $(this).addClass('fa-check').removeClass('fa-spell-check').prev().attr('type', 'password');
    });
});

Util.run(function Form(ctx) {
    ctx.children('input').on('click', async () => {
        let type = ctx.find('.switch > [type="radio"]:checked').attr('id');
        let context = ctx.find(`.content > .${type}`);
        context.find('.input > input').removeClass('inactive');
        for(let elem of context.find('.input > input').toArray()) {
            if(elem.validationMessage === '') continue;
            $(elem).next().trigger('mouseover');
            $(elem).on('focus.temp', () => $(elem).off('focus.temp').next().trigger('mouseout'));
            return;
        }
        await validation(type, context);
    });
    async function validation(type, ctx) {
        let passed = false;
        switch(type) {
            case 'login':
                const username = ctx.find('.text-user')[0];
                const password = ctx.find('.text-pass')[0];
                const data = {username: username.value, password: password.value};
                const formData = new FormData();
                for(var key in data) formData.append(key, data[key]);
                const status = await Post('/database/auth/signin', data).catch(e => e);
                if(status.status.code >= 400 && status.status.code < 500) {
                    let err = (/\bpassword\b/).test(status.response.text) ? password : username;
                    err.setCustomValidity(status.response.text);
                    err = $(err);
                    err.next().trigger('mouseover');
                    err.on('focus.temp', () => err.off('focus.temp').next().trigger('mouseout'));
                    err.on('input.temp', () => err.off('focus.temp')[0].setCustomValidity(''));
                    return;
                }
                alert(status.response.main);
                break;
            case 'register':
                
                break;
            default: passed = true;
        }
    }
}, [$('#form > .container')]);

Util.run(function Account(user) {
    if(!!user) $('#form').css('display', 'none');
}, [sessionStorage.getItem('user') !== '' ? JSON.parse(sessionStorage.getItem('user')) : null]);

function Post(url, body) {
    let http = new XMLHttpRequest();
    let params = $.param(body);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    return new Promise((res, rej) => {
        http.onreadystatechange = () => {
            if(http.readyState == 4) {
                let data = {
                    response: {
                        text: http.responseText,
                        url: http.responseURL,
                        xml: http.responseXML,
                        type: http.responseType,
                        main: http.response
                    },
                    status: {
                        code: http.status,
                        text: http.statusText
                    }
                };
                http.status >= 200 && http.status < 300 ? res(data) : rej(data);
            }
        };
        http.send(params);
    });
}