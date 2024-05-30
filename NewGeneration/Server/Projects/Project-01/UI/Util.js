import "../util.js";

export function schema(blueprint, obj, name) {
  if(!Util.isType(obj, Object)) obj = {};
  if(!name) name = "obj";
  for(const key of Object.getOwnPropertyNames(blueprint)) {
    if(!("default" in blueprint[key]) && !(key in obj)) throw new TypeError(`${String(name)}.${key} is undefined. Expected a value`);
    if("default" in blueprint[key] && !(key in obj)) obj[key] = blueprint[key].default;
    if("type" in blueprint[key] && !Util.isType(obj[key], blueprint[key].type)) throw new TypeError(`${String(name)}.${key} is not of type ${(Util.isType(blueprint[key].type, Array) ? blueprint[key].type : [blueprint[key].type]).map(e => e.name.toLowerCase()).join(" or ")}. Received a ${obj[key] ? obj[key].constructor.name.toLowerCase() : typeof obj[key]} instead`);
  }
  return obj;
}