if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const faunadb = require('faunadb');
const CryptoJS = require('crypto-js');
const Util = require('../Util');

const router = module.exports = express.Router();
const client = new faunadb.Client({secret: process.env.FAUNA_KEY});
const q = faunadb.query;
const db = {};
const MAIN_KEY = process.env.STORE_KEY;

router.post('/auth/signup', tryCatch(async (req, res, next) => {
    const {username=null,password=null} = req.body;
    let data = await userValid(username, password, true);
    data = await db.post(client, 'Accounts', {data});
    res.status(200).send('Created Succesfully!');
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/auth/signin', tryCatch(async (req, res, next) => {
    const {username=null,password=null} = req.body;
    let data = await userValid(username, password);
    res.status(200).send(data);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/auth/update', tryCatch(async (req, res, next) => {
    let {username=null,password=null,update={}} = req.body;
    let data = await userValid(username, password);
    update = Util.deepMerge({}, data, update);
    update = {username:update.username,recovery:update.recovery};
    update.storeKey = data.storeKey.map(e => encrypt(e, MAIN_KEY));
    update.password = data.password;
    let allow = true;
    if(update.username !== username) allow = await db.find(client, 'Accounts', {data:{username}}).catch(e => e);
    if(allow instanceof Error) {
        if(allow.name === 'NotFound') allow = true;
        else throw new StatusError(500, allow.toString());
    }
    data = await db.update(client, 'Accounts', {data:{username}}, {data:update});
    await db.updateAll(client, 'Passwords', {data:{author:username}}, {data:{author:update.username}});
    res.status(200).send(data.data);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/auth/delete', tryCatch(async (req, res, next) => {
    const {username=null,password=null} = req.body;
    let data = await userValid(username, password);
    data = await db.find(client, 'Accounts', {data:{username}});
    await db.delete(client, 'Accounts', {data:{username}});
    res.status(200).send('Deleted Succesfully!');
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));

router.post('/store/post', tryCatch(async (req, res, next) => {
    let {username=null,password=null,data:item={}} = req.body;
    let data = await userValid(username, password);
    item = Util.deepMerge({type: 'custom', icon: '', attr: []}, item);
    item = {type:item.type,icon:item.icon,attr:item.attr,author:data.username};
    item.attr.forEach(e => {e.value = encrypt5(e.value, data.password, data.storeKey)});
    await db.post(client, 'Passwords', {data:item});
    res.status(200);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/store/find', tryCatch(async (req, res, next) => {
    let {username=null,password=null,search={},multiple=false} = req.body;
    let data = await userValid(username, password);
    let ret;
    search.author = data.username;
    if(!multiple) {
        ret = await db.find(client, 'Passwords', {data:search});
        ret.data.attr.forEach(e => {e.value = decrypt5(e.value)});
    }
    else {
        ret = await db.findAll(client, 'Passwords', {data:search});
        ret.forEach(dat => dat.data.attr.forEach(e => {e.value = decrypt5(e.value)}));
    }
    res.status(200).send(ret);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/store/update', tryCatch(async (req, res, next) => {
    let {username=null,password=null,id='',update={}} = req.body;
    let data = await userValid(username, password);
    search.author = data.username;
    item = Util.deepMerge({type: 'custom', icon: '', attr: []}, item);
    item = {type:item.type,icon:item.icon,attr:item.attr,author:data.username};
    item.attr.forEach(e => {e.value = encrypt5(e.value, data.password, data.storeKey)});
    item.id = id;
    await db.update(client, 'Passwords', {data:{author:username,id:id}}, {data:item}).catch(e => {if(e.name === 'NotFound') throw new StatusError(404, 'Item requested was not found!')});
    res.status(200);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));
router.post('/store/delete', tryCatch(async (req, res, next) => {
    let {username=null,password=null,ids=[]} = req.body;
    let data = await userValid(username, password);
    search.author = data.username;
    for(let e of ids) await db.find(client, 'Passwords', {data:{author:username,id:e}}).catch(e => {if(e.name === 'NotFound') throw new StatusError(404, 'Item requested was not found!')});
    for(let e of ids) await db.delete(client, 'Passwords', {data:{author:username,id:e}});
    res.status(200);
}, (err, req, res) => res.status(err instanceof StatusError ? err.code : 500).send(String(err))));

/* -------- Util Functions -------- */
function hash(str) {
    return CryptoJS.SHA256(str).toString(CryptoJS.enc.Base64);
}
function hash2(str) {
    return CryptoJS.SHA512(str).toString(CryptoJS.enc.Base64);
}
function gKey() {
    return require('crypto').randomBytes(32).toString('base64');
}
function tryCatch(fn, err) {
    return async function() {
        let result;
        try {result = await fn.call(this, ...arguments)}
        catch(e) {result = await err.call(this, e, ...arguments)}
        return result;
    };
}
function tryCatchSync(fn, err) {
    return function() {
        let result;
        try {result = fn.call(this, ...arguments)}
        catch(e) {result = err.call(this, e, ...arguments)}
        return result;
    };
}
function obj_flat(obj) {
    let result = {};
    for(let i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        if(typeof obj[i] == 'object' && obj[i] !== null) {
            let flatObject = obj_flat(obj[i]);
            for(let x in flatObject) {
                if(!flatObject.hasOwnProperty(x)) continue;
                result[i + '.' + x] = flatObject[x];
            }
        }
        else result[i] = obj[i];
    }
    return result;
}
function encrypt(value, key) {
    return CryptoJS.TripleDES.encrypt(value, key).toString();
}
function decrypt(value, key) {
    return CryptoJS.TripleDES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
}
function encrypt5(value, mkey, [key1,  key2, key3, key4, key5]) {
    mkey = CryptoJS.enc.Base64.parse(mkey);
    value = CryptoJS.TripleDES.encrypt(value, key5, {iv: mkey}).toString();
    value = CryptoJS.TripleDES.encrypt(value, key2, {iv: mkey}).toString();
    value = CryptoJS.TripleDES.encrypt(value, key1, {iv: mkey}).toString();
    value = CryptoJS.TripleDES.encrypt(value, key3, {iv: mkey}).toString();
    value = CryptoJS.TripleDES.encrypt(value, key4, {iv: mkey}).toString();
    return value;
}
function decrypt5(value, mkey, [key1,  key2, key3, key4, key5]) {
    mkey = CryptoJS.enc.Base64.parse(mkey);
    value = CryptoJS.TripleDES.decrypt(value, key4, {iv: mkey}).toString(CryptoJS.enc.Utf8);
    value = CryptoJS.TripleDES.decrypt(value, key3, {iv: mkey}).toString(CryptoJS.enc.Utf8);
    value = CryptoJS.TripleDES.decrypt(value, key1, {iv: mkey}).toString(CryptoJS.enc.Utf8);
    value = CryptoJS.TripleDES.decrypt(value, key2, {iv: mkey}).toString(CryptoJS.enc.Utf8);
    value = CryptoJS.TripleDES.decrypt(value, key5, {iv: mkey}).toString(CryptoJS.enc.Utf8);
    return value;
}
async function userValid(username, password, signup = false) {
    let search = null, valid = false;
    if(typeof username !== 'string') throw new StatusError(400, 'The username given was not a string!');
    if(typeof password !== 'string') throw new StatusError(400, 'The password given was not a string!');
    if(!(/^[a-zA-Z]\S{8,32}$/).test(username)) throw new StatusError(400, `The username given didn't match the following pattern: \`[a-zA-Z]\\S{8,32}\``);
    if(!(/^(.*){8,32}$/).test(username)) throw new StatusError(400, `The username given didn't match the following pattern: \`[a-zA-Z]\\S{8,32}\``);
    search = await db.find(client, 'Accounts', {data:{username}}).catch(e => e);
    if(!signup) {
        if(search instanceof Error) {
            if(search.name === 'NotFound') throw new StatusError(404, `The username \`${username}\` was not registered!`);
            throw new StatusError(500, search.toString());
        }
        if(search.data.password !== hash2(password)) throw new StatusError(401, `The password given was incorrect!`);
        search.data.storeKey = search.data.storeKey.map(e => decrypt(e, MAIN_KEY));
        return search.data;
    }
    else {
        if(!(search instanceof Error)) throw new StatusError(400, 'The username given was already taken');
        if(search instanceof Error && search.name !== 'NotFound') throw new StatusError(500, search.toString());
        return {
            username: username,
            password: hash2(password),
            recovery: [],
            storeKey: Array(5).fill().map(gKey).map(e => encrypt(e, MAIN_KEY)),
            moreinfo: {}
        };
    }
}

/* -------- Database Functions -------- */
db.findAll = (client, folder, search = {}) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select('data', q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    return client.query(filtered);
};
db.find = (client, folder, search) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select(['data', 0], q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    return client.query(filtered);
};
db.post = (client, folder, data) => client.query(q.Create(q.Collection(folder.toString()), data));
db.update = (client, folder, search, data) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select(['data', 0], q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    const found = q.Select('ref', filtered);
    return client.query(q.Update(found, data));
};
db.updateAll = (client, folder, search, data) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select(['data'], q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    const found = q.Map(q.Lambda('l', q.Select('ref', filtered)));
    return client.query(q.Update(found, data));
};
db.delete = (client, folder, search) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select(['data', 0], q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    const found = q.Select('ref', filtered);
    return client.query(q.Delete(found));
};
db.deleteAll = (client, search = {}) => {
    const fields = Object.getOwnPropertyNames(obj_flat(search)).map(e => e.split('.')).map(e => (/^\d+$/).test(e) ? Number(e) : e);
    const all = q.Map(q.Paginate(q.Documents(q.Collection(folder.toString()))), q.Lambda('x', q.Get(q.Var('x'))));
    const filtered = q.Select('data', q.Filter(all, q.Lambda('e', q.All(q.Map(fields, q.Lambda('f', q.Equals(q.Select(q.Var('f'), q.Var('e')), q.Select(q.Concat(q.Var('f'), '.'), obj_flat(search)))))))));
    const found = q.Map(q.Lambda('r', q.Delete(q.Select('ref', q.Var('r')))));
    return client.query(found);
};
db.folder = {};
db.folder.create = (client, opts) => client.query(q.CreateCollection(opts));
db.folder.delete = (client, folder) => client.query(q.Delete(q.Collection(folder.toString())));

class StatusError extends Error {
    constructor(...args) {
        super();
        this.code = Math.min(Math.max(300, args.find(Number)), 599) || 300;
        this.message = args.filter(e => typeof e === 'string').join(' ');
    }
    get [Symbol.toStringTag]() {return String(this.code)}
}
// db.update(client, 'Account', {data:{username:'matthieu'}}, {test: 'yes'}).then(e => console.log(e)).catch(e => console.log(e))
