/**
 * @function
 * @param {number} min 
 * @param {number} max 
 */
function random(min, max = 0) {
    let i = Math.min(min, max);
    let a = Math.max(min, max);
    return Math.random() * (a - i) + i;
}

module.exports = {random};