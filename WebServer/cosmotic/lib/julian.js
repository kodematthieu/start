const UNIX = Date.now()/// / 1000;

module.exports.day = function(t) {
    var date = new Date(t)
    return ((date.getTime() / 86400000) + 2440587.5)
}