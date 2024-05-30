const {Client, query: q} = require("faunadb");
const Util = require("./util");
class DataStore {
  constructor(key) {
    if(!Util.isType(key, String)) return key;
    Object.defineProperty(this, "_client", {enumerable: true, value: new Client({secret: key})});
    this._schema = new Map();
  }
  exec(expr, opts) {return this._client.query(expr, opts)}
  push(collection, data) {
    let verified = false;
    if(Util.isType(this._schema.get(collection), Schema)) verified = this._schema.get(collection).verify(data, true);
    else verified = true;
    data.createdAt = Date.now();
    data.modifiedAt = null;
    if(verified) return this.exec(q.Create(q.Collection(collection.toString()), {data}));
  }
  pull(index, data) {return this.exec(q.Get(q.Match(q.Index(index.toString()), {data})))}
  fromId(collection, id) {return this.exec(q.Get(q.Ref(q.Collection(collection.toString()), id)))}
  all(collection) {return this.exec(q.Map(q.Paginate(q.Documents(q.Collection(collection.toString()))), q.Lambda(x => q.Get(x)))).then(res => res.data.map(e => e.data))}
  remove(collection, id) {return this.exec(q.Delete(q.Ref(q.Collection(collection.toString()), id)))}
  update(collection, id, data) {
    let verified = false;
    if(Util.isType(this._schema.get(collection), Schema)) verified = this._schema.get(collection).verify(data.data);
    else verified = true;
    data.modifiedAt = Date.now();
    if(verified) return this.exec(q.Update(q.Ref(q.Collection(collection.toString()), id), {data}));
  }
  schema(collection, val) {
    if(!Util.isType(val, Schema)) val = new Schema(val);
    if(Util.isType(val, Schema)) this._schema.set(collection, val);
    return this;
  }
  static query = q;
}
class Schema {
  constructor(data = {}) {
    if(!Util.isType(data, [Schema, Object])) return data;
    if(Util.isType(data, Schema)) data = data._data;
    for(let v of Object.values(data)) if(!v.name && !Util.isType(v, [String, RegExp])) return v;
    this._data = data;
  }
  verify(obj, strong) {
    for(let k in this._data) {
      if(!(k in obj) && strong) return false;
      if(typeof this._data[k] === "function" && !Util.isType(obj[k], this._data[k])) return false;
      if(typeof this._data[k] === "string" && !Util.run("return " + this._data[k].replace(/\bvalue\b/g, "arguments[0]"), obj[k])) return false;
      if(Util.isType(this._data[k], RegExp) && !this._data[k].test(obj[k])) return false;
    }
    return true;
  }
  replace(val) {
    if(!Util.isType(data, [Schema, Object])) return data;
    if(Util.isType(data, Schema)) data = data._data;
    this._data = val;
    return this;
  }
  toJSON() {return this._data}
}
module.exports = {DataStore, Schema};