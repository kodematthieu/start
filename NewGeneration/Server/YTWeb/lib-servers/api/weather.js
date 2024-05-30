require("dotenv").config();
const fetch = require("node-fetch")
const querystring = require("querystring");
const router = require("express").Router();

const links = {
  default: "http://api.openweathermap.org/data/2.5/weather?",
  informative: "http://api.openweathermap.org/data/2.5/onecall?",
};
const defaultData = {
  lat: 0,
  lon: 0,
  cnt: 7,
  lang: "en",
  units: "metric",
  appid: process.env.WEATHER_TOKEN
};

const icons = {"200":"cloud-lightning-","201":"cloud-lightning-","202":"cloud-lightning-","210":"cloud-lightning-","211":"cloud-lightning-","212":"cloud-lightning-","221":"cloud-lightning-","230":"cloud-lightning-","231":"cloud-lightning-","232":"cloud-lightning-","300":"cloud-drizzle-","301":"cloud-drizzle-","302":"cloud-drizzle-","310":"cloud-drizzle-","311":"cloud-drizzle-","312":"cloud-drizzle-","313":"cloud-drizzle-","314":"cloud-drizzle-","321":"cloud-drizzle-","500":"cloud-rain-","501":"cloud-rain-","502":"cloud-rain-","503":"cloud-rain-","504":"cloud-rain-","511":"cloud-hail-","520":"cloud-rain-alt-","521":"cloud-rain-alt-","522":"cloud-rain-alt-","531":"cloud-rain-alt-","600":"cloud-snow-","601":"cloud-snow-alt-","602":"cloud-snow-alt-","611":"cloud-hail-alt-","612":"cloud-hail-alt-","615":"cloud-hail-alt-","616":"cloud-hail-alt-","620":"cloud-snow-","621":"cloud-snow-","622":"cloud-snow-alt-","701":"cloud-fog-","711":"cloud-fog-alt-","721":"cloud-fog-","731":"tornado","741":"cloud-fog-","751":"cloud-fog-alt-","761":"cloud-fog-alt-","762":"cloud-fog-alt-","771":"cloud-fog-alt-","781":"tornado","800":"","801":"cloud-","802":"cloud-","803":"cloud-","804":"cloud-"};

router.get("/:link_type", async (req, res) => {
  let data = Object.assign(defaultData, req.query);
  fetch(links[req.params.link_type] + querystring.stringify(data))
    .then(res => res.json())
    .then(result => {
      let time = result.weather[0].icon.match(/[a-z]/g)[0] === "d" ? "sun" : "moon";
      result.weather.map(e => e.icon = "/assets/img/weather/" + icons[e.id] + (icons[e.id] === "tornado" ? "" : time) + ".svg");
      console.log(result);
      res.send(result);
    })
    .catch(err => console.log(err));
});


module.exports = router;