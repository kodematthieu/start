const faunadb = require("faunadb");
const q = faunadb.query;

const symbol = {};
for(let e of ["client", "opts"]) symbol[e] = Symbol(e);

var DataStore = function DataStore(token) {
  if(!(this instanceof DataStore)) return new DataStore(...arguments);
  if(arguments.length !== 1) throw new Error("There should be 2 arguments. Found " + arguments.length);
  this.client = new faunadb.Client({ secret: token });
};

(function() {
  this.push = function(collection, data) {
    return new Promise((res, rej) => {
      this.client.query(q.Create(q.Collection(collection.toString()), {data})).then(res).catch(rej);
    });
  };
  this.search = function(index, data) {
    return new Promise((res, rej) => {
      this.client.query(q.Get(q.Match(q.Index(index.toString()), data))).then(res).catch(rej);
    });
  };
  this.get = function(collection, id) {
    return new Promise((res, rej) => {
      this.client.query(q.Get(q.Ref(q.Collection(collection.toString()), id))).then(res).catch(rej);
    });
  };
  this.remove = function(collection, id) {
    return new Promise((res, rej) => {
      this.client.query(q.Delete(q.Ref(q.Collection(collection.toString()), id))).then(res).catch(rej);
    });
  };
  this.update = function(collection, id, data) {
    return new Promise((res, rej) => {
      this.client.query(q.Update(q.Ref(q.Collection(collection.toString()), id), {data})).then(res).catch(rej);
    });
  };
}).call(DataStore.prototype);

module.exports = DataStore;