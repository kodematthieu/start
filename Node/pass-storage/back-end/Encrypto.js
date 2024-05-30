const CryptoJS = require("crypto-js");
 
class Locker {
    constructor(masterKey = 'global') {
        this.master = CryptoJS.enc.Base64.parse(masterKey);
    }
    encrypt(key, msg = '') {
        key = key.toString();
        msg = msg.toString();
        return CryptoJS.TripleDES.encrypt(msg, key, {iv: this.master}).toString();
    }
    decrypt(key, msg = '') {
        key = key.toString();
        msg = msg.toString();
        return CryptoJS.TripleDES.decrypt(msg, key, {iv: this.master}).toString(CryptoJS.enc.Utf8);
    }
}
module.exports = Locker;