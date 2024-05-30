const got = require("got");
const cherio = require("cherio");
const fs = require("fs");

const {isType} = require("./lib/util");

(async () => {
  let scrape = await got("\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x73\x69\x73\x77\x65\x62\x2e\x63\x6f\x6d\x2f\x72\x65\x66\x65\x72\x65\x6e\x63\x2f\x73\x6f\x75\x72\x63\x65\x2f\x65\x78\x61\x63\x74\x6d\x61\x73\x2e\x68\x74\x6d");
  const $ = cherio.load(scrape.body);
  const isotopes = [];
  $("body tbody > tr").each((i,e) => {
    const elem = $($(e).children("td")[0]).text();
    const symbol = $($(e).children("td")[1]).text();
    const mass = $($(e).children("td")[2]).text();
    const abundance = $($(e).children("td")[3]).text();
    isotopes.push({name: elem, symbol, mass, abundance});
  });
  isotopes.sort((a,b) => a.mass - b.mass);
  fs.writeFileSync(__dirname + "/lib/isotope.json", JSON.stringify(isotopes, null, 2));
  scrape = await got("\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x67\x69\x74\x68\x75\x62\x75\x73\x65\x72\x63\x6f\x6e\x74\x65\x6e\x74\x2e\x63\x6f\x6d\x2f\x42\x6f\x77\x73\x65\x72\x69\x6e\x61\x74\x6f\x72\x2f\x50\x65\x72\x69\x6f\x64\x69\x63\x2d\x54\x61\x62\x6c\x65\x2d\x4a\x53\x4f\x4e\x2f\x6d\x61\x73\x74\x65\x72\x2f\x50\x65\x72\x69\x6f\x64\x69\x63\x54\x61\x62\x6c\x65\x4a\x53\x4f\x4e\x2e\x6a\x73\x6f\x6e");
  scrape = JSON.parse(scrape.body).elements;
  scrape = scrape.filter(e => !e.category.match(/^unknown/)).map(e => {
    return {
      name: e.name,
      symbol: e.symbol,
      category: e.category.replace(" ", "-"),
      mass: e.atomic_mass,
      atomic_number: e.number,
      boil_point: e.boil,
      melt_point: e.melt
    };
  });
  fs.writeFileSync(__dirname + "/lib/elements.json", JSON.stringify(scrape, null, 2));
})();