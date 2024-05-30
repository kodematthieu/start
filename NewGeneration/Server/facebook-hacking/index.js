const fs = require("fs");
const ajax = require("request");
async function login(email, pass) {
  await new Promise((res, req) => ajax.get("https://m.facebook.com/", (err, response, body) => err ? rej(err) : res(response)));
  function cookie(arr) {
    if(!(arr instanceof Array)) return arr;
    const blacklist = ["expires", "Max-Age", "path", "domain", "secure", "httponly"];
    const cookies = {};
    for(let cookie of arr) {
      let key, value = {};
      for(let k of cookie.split(/;\s+/)) {
        let v = k.split("=", 2)[1];
        k = k.split("=", 2)[0];
        if(!blacklist.includes(k)) {key = k;k = "value"}
        value[k] = typeof v !== "undefined" ? v : true;
      }
      cookies[key] = value;
    }
    return cookies;
  }
  const req = await new Promise((res, rej) => ajax.post({
    url: "https://m.facebook.com/login.php",
    followAllRedirects: false,
    followRedirect: false,
    headers: {"content-type": "application/json", "user-agent": "Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"},
    data: JSON.stringify({email, pass})
  }, (err, response, body) => {
    if(err) return rej(err);
    response.cookies = cookie(response.headers["set-cookie"]);
    res(response);
  }));
  console.log(req.cookies);
  fs.writeFileSync(__dirname+"/fb.html", req.body);
}
login("mickreys249@gmail.com", "karelmatthieu15");