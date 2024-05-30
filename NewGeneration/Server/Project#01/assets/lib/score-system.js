
class Score {
  constructor(game) {
    this.game = game
  }
  set score(value) {
    let name = `games.${this.game}`
    $.get("/api/database/account/search?" + $.param({token: localStorage.user ? JSON.parse(localStorage.user).token : "Public"}), (data1) => {
      if(data1.length !== 0) {
        $.post("/api/database/account/update?" + $.param({search: {token: JSON.parse(localStorage.user).token}, update: {[name]: value}}), (data2) => {
          localStorage.user = JSON.stringify(data2[0]);
        })
      }
      else sessionStorage.score = String(value)
    })
  }
  get scores() {
    let result
    $.get({
      url: "/api/database/account/search?" + $.param({token: localStorage.user ? JSON.parse(localStorage.user).token : "Public"}),
      async: false,
      success: (data) => {
        if(data.length !== 0) {
          let user = data[0]
          if(user.games && user.games[this.game]) result = parseInt(user.games[this.game])
          else result = 0
        }
        else result = parseInt(sessionStorage.score) || 0
      }
    })
    return result
  }
}