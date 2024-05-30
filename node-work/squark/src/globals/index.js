require('./objects');
for(let c in require('./constants')) {
  Object.defineProperty(global, c, {
    value: require('./constants')[c],
    writable: true,
    configurable: true
  });
}
for(let f of require('./functions')) {
  Object.setPrototypeOf(f, null);
  Object.defineProperty(global, f.name, {
    value: f,
    writable: true,
    configurable: true
  });
}
for(let f of require('./console')) {
  Object.setPrototypeOf(f, null);
  Object.defineProperty(global, f.name, {
    value: f,
    writable: true,
    configurable: true
  });
}