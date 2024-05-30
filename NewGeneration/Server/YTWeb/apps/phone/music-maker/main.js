Util.run(function MusicMaker($) {
  if(localStorage.getItem("UserLogin") === "" || !localStorage.getItem("UserLogin")) window.history.back();
  const InProject = (project, fn) => {
    const data = project.music;
    const main = $("#in-project").css("display", "block");
    const buttons = {
      plus: $("#in-project > #plusbtn")
    };
    buttons.plus.children("#btn").on("click", function(e) {
      const self = $(this);
      self.ripple(500, {x: e.clientX, y: e.clientY});
      self.toggleClass("active");
      buttons.plus.children("#list").toggleClass("active");
    });
    buttons.plus.children("#list").children("div")
      .each((i, e) => $(e).append($(`<span id="label">${$(e).attr("id").replace(/-/g, " ").toUpperCase()}</span>`), $(`<span id="icon" class="${$(e).data("icon")}"></span>`)).data("icon", ""))
      .on("click", function() {(fn[$(this).attr("id")] || function() {}).call($(this), data, ...arguments)});
  };
  const NotInProject = () => {
    const main = $("#not-in-project").css("display", "block");
    main.children("#button").on("click", function() {if(!$(this).hasClass("drop")) $(this).addClass("drop").siblings().removeClass("drop")});
    main.children(":not(#button)").children(".submit").on("click", event => {
      main.children(":not(#button)").children(".submit").ripple(500, {x:event.clientX,y:event.clientY}, () => {
        const input = main.children(":not(#button)").children(".project-name");
        if(input.children("input").val() === "") return input.children("input").trigger("focus").parent().children("#error").text("Project Name is empty.").css("opacity", 1);
        if(!input.children("input").val().match(/^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/)) return input.children("input").trigger("focus").parent().children("#error").text("Spaces are not allowed.").css("opacity", 1);
        if(!input.children("input").val().match(/(.){6,}/)) return input.children("input").trigger("focus").parent().children("#error").text("6 is the minimum characters.").css("opacity", 1);
           
        $.ajax({
          url: "/api/apps/music-maker/project?action=create",
          method: "POST",
          data: {
            data: {
              project: {
                name: input.children("input").val(),
                author: JSON.parse(localStorage.getItem("UserLogin")).secret
              }
            }
          },
          complete: res => {localStorage.Project = res.responseText;window.location.search = ""},
          error: alert
        });
      });
    });
    main.children(":not(#button)").children(".project-name").children("input").on("input", function() {
      $(this).siblings("#error").css("opacity", 0);
    });
    $.ajax({
      url: "/api/apps/music-maker/project?" + $.param({action: "search", author: JSON.parse(localStorage.getItem("UserLogin")).secret}),
      method: "GET",
      complete: res => {
        let datas = res.responseJSON;
        let container = main.children(".search-section");
        if(datas.length < 1 || !Array.isArray(datas)) return;
        container.html("");
        for(let data of datas) {
          let div = $("<div class=\"project\"></div>");
          let name = $(`<span class="name">${data.project.name}</span>`);
          div.on("click", () => {localStorage.Project = JSON.stringify(data);window.location.search = ""});
          container.append(div.append(name));
        }
      }
    });
  };
  if(window.location.search === "?project=null" || (!localStorage.Project || localStorage.Project === "")) NotInProject();
  else InProject(JSON.parse(localStorage.Project), {
    "import-tones": function() {},
    "import-tracks": function() {},
    "save-project": function(data) {
    },
    "exit": function(data) {
      let exit = true;
      if(JSON.parse(localStorage.Project).music !== data) exit = comfirm("Are you sure you want to exit? You project is unsaved!");
      if(!exit) return;
      localStorage.removeItem("Project");
      window.location.reload();
    }
  });
}, [$ || jQuery]);