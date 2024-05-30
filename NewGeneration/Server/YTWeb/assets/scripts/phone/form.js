Util.run(function Form($) {
  const form = type => {
    const exit = $(`#form > #exit`);
    const oauth = $(`#form > #${type} > #external-auth`);
    const inputs = $(`#form > #${type} > #form-input > input`);
    const submit = $(`#form > #${type} > #submit`);
    exit.on("click", () => {
      $("body > #form").removeClass("active");
      $("body > #form > article").css("display", "none");
    });
    oauth.on("click", function(event) {
      $(this).ripple(500, {x: event.clientX, y: event.clientY}, () => {
        let provider = $(this).attr("class");
        window.location = `/api/account/oauth/${type}/${provider}`;
      });
    });
    inputs.on("keypress", function(event) {
      if(event.keyCode !== 13) return;
      let input = $(this);
      if(!!input.parent().next("#form-input").children("input")[0]) return input.parent().next().children("input").trigger("focus");
      input.parent().next("#submit").trigger("click");
    }).on("input", function() {$(this).siblings(".error").text("")});
    submit.on("click", function(event) {
      $(this).ripple(500, {x: event.clientX, y: event.clientY}, () => {
        if($(this).parent().is("#signin")) {
          if(!signInValidate(inputs.parent(".email").children("input"), inputs.parent(".password").children("input"))) return;
        }
        else {
          if(!signUpValidate(
            inputs.parent(".first-name").children("input"),
            inputs.parent(".last-name").children("input"),
            inputs.parent(".email").children("input"),
            inputs.parent(".password").children("input"),
            inputs.parent(".password1").children("input"),
          )) return;
        }
      });
      
    });
    function signInValidate(email, pass) {
      let eVal = email.val();
      let pVal = pass.val();
      if(eVal === "") {
        email.siblings(".error").text("Email is empty!");
        return false;
      }
      if(pVal === "") {
        pass.siblings(".error").text("Password is empty!");
        return false;
      }
      return true;
    }
    function signUpValidate(fname, lname, email, pass1, pass2) {
      let fVal = fname.val();
      let lVal = lname.val();
      let eVal = email.val();
      let pVal = pass1.val();
      let cVal = pass2.val();
      if(fVal === "") {
        fname.siblings(".error").text("First Name is empty!");
        return false;
      }
      if(lVal === "") {
        lname.siblings(".error").text("Last Name is empty!");
        return false;
      }
      if(eVal === "") {
        email.siblings(".error").text("Email is empty!");
        return false;
      }
      if(!eVal.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)) {
        email.siblings(".error").text("Email is invalid!");
        return false;
      }
      if(pVal === "") {
        pass1.siblings(".error").text("Password is empty!");
        return false;
      }
      if(!pVal.match(/^(.){10,}$/)) {
        pass1.siblings(".error").text("Password should be at least 10 characters long!");
        return false;
      }
      if(cVal !== pVal) {
        pass2.siblings(".error").text("Password does not match!");
        return false;
      }
      return true;
    }
  };
  form("signin");
  form("signup");
}, [$ || jQuery]);