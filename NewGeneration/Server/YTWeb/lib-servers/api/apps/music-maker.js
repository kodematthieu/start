require("dotenv").config();
const path = require("path");
const deepMerge = require("merge-anything").merge;
const faunadb = require("faunadb");
const router = require("express").Router();
const q = faunadb.query;

__dirname = process.env.PWD;
const fauna_keys = require(path.join(__dirname, process.env.FAUNA_TOKEN));
const client = {
  master: new faunadb.Client({ secret: fauna_keys.master }),
  apps: new faunadb.Client({ secret: fauna_keys.child.Apps })
};

const TOKENS = ["8t1d09p1", "mfzyrfab","aho6zeaf", "shzz53xv","nyxpbm6k", "drk1nn5c","dr1lophg", "nap3j2cb","f7tmngr5", "xi509z24","xk8bqa9a", "b3a5cxzj","20gvw5rx", "8m00xbbg","fg1loker", "dj9sk05d"];
const ID = () => "xxxxxxxxxxxx-0123-yyyyyyyy-4567-xxxxxxxxxxxx".replace(/\d/g, _ => Math.round(Math.random()*9).toString()).replace(/x/g, _ => Math.floor(Math.random()*16).toString(16)).replace(/y+/g, _ => TOKENS[Math.round(Math.random()*TOKENS.length)]);

const projectify = (arr, mode = 0) => {
  console.log(arr);
  if(mode === 0) return {
    project: {
      id: arr[1],
      name: arr[2],
      author: arr[0],
      archived: arr[3]
    }
  };
};

router.route("/project")
  .post((req, res, next) => {
    if(req.query.action !== "create") return next();
    const id = ID();
    const data = deepMerge({
      project: {id, name: "Project-"+id.slice(0,8), author: null, archived: false},
      music: []
    }, req.body.data);
    if(
      !data.project.author ||
      typeof data.project.author !== "string" ||
      TOKENS.filter(e => e === data.project.author.split("-")[2]).length < 1
    ) return res.status(400).send("Author not defined!");
    client.apps.query(q.Create(q.Collection("Music-Maker"), {data}))
      .then(r => res.status(200).send(data))
      .catch(r => res.status(500).send(r));
  })
  .get((req, res, next) => {
    if(req.query.action !== "search") return next();
    if(!!req.query.author && !req.query.projectId) return client.apps.query(q.Paginate(q.Match(q.Index("Projects"), req.query.author)))
      .then(r => res.status(200).send(r.data.map(e => projectify(e))))
      .catch(err => res.status(500).send(err));
    if(
      !req.query.author ||
      TOKENS.filter(e => e === req.query.author.split("-")[2]).length < 1
    ) return res.status(400).send("Invalid Author!");
    if(!req.query.projectId) return res.status(400).send("Invalid Project ID!");
    client.apps.query(
      q.Map(
        q.Paginate(q.Match(q.Index("Project-Search"), [req.query.projectId, req.query.author])),
        q.Lambda("x", q.Get(q.Var("x")))
      )
    ).then(r => res.status(200).send(r.data[0].data))
    .catch(err => res.status(500).send(err));
  }).put((req, res, next) => {
    if(req.query.action !== "update") return next();
    if(!req.body.update || !req.body.search) return res.status(400);
    client.apps.query(
      q.Map(
        q.Paginate(q.Match(q.Index("Project-Search"), [req.body.search.projectId, req.body.search.author])),
        q.Lambda("ref", q.Update(q.Var("ref"), req.body.update))
      )
    )
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
  }).delete((req, res, next) => {
    if(req.query.action !== "delete") return next();
    if(
      !req.query.author ||
      TOKENS.filter(e => e === req.query.author.split("-")[2]).length < 1
    ) return res.status(400).send("Invalid Author!");
    if(!req.query.projectId) return res.status(400).send("Invalid Project ID!");
    client.apps.query(
      q.Map(
        q.Paginate(q.Match(q.Index("Project-Search"), [req.body.search.projectId, req.body.search.author])),
        q.Lambda("ref", q.Delete(q.Var("ref")))
      )
    )
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
  });

module.exports = router;