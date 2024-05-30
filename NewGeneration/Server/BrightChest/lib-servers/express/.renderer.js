const fs = require("fs");
const path = require("path");
module.exports = (main, section, device, next) => {
  section = path.dirname(path.join(process.env.PWD, "pages", main+"-includes", section, device+".html"));
  main = path.dirname(path.join(process.env.PWD, "pages", "main", main, device+".html"));
  let dirname = path.dirname(section);
  let prescripts = find(dirname, /\.prescript\.js$/i).map(e => `/assets/script/${main+"-includes"}/${section}/${e}`);
  let scripts = find(dirname, /\.script\.js$/i).map(e => `/assets/script/${main+"-includes"}/${section}/${e}`);
  let prestyles = find(dirname, /\.prestyle\.js$/i).map(e => `/assets/style/${main+"-includes"}/${section}/${e}`);
  let styles = find(dirname, /\.style\.js$/i).map(e => `/assets/style/${main+"-includes"}/${section}/${e}`);
  main += `/${device}.html`;
  section += `/${device}.html`;
  if(!fs.existsSync(main)) return next();
  if(!fs.existsSync(section)) return next();
  return {
    main: main,
    data: {
      namespace: process.env.npm_package_name.replace("-", " ").replace(/\b[a-z]/gi, e => e.toUpperCase()),
      title: [
        path.dirname(main).match(/[a-z\-]+$/i)[0].replace(/\-/g, " ").replace(/\b[a-z]/, e => e.toUpperCase()),
        path.dirname(section).match(/[a-z\-]+$/i)[0].replace(/\-/g, " ").replace(/\b[a-z]/, e => e.toUpperCase())
      ],
      content: section,
      prescripts: prescripts,
      prestyles: prestyles,
      scripts: scripts,
      styles: styles,
    }
  };
};
function find(where, regex) {
  let result = [];
  for(let file of fs.readdirSync(where)) if(regex.test(file)) result.push(file.replace(/\.[a-z]+$/i,""));
  return result;
}