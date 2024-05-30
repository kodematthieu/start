function verify(a,b,c) {return !b(a)?c:a}
function objVerify(a,b) {
    for(let [c,d,e] of b) a[c] = !d(a[c])?e:a[c];
    b = b.map(e => e[0]);
    for(let c of Object.getOwnPropertyNames(a).filter(e => !b.includes(e))) delete a[c];
    return a;
}

export {
    verify,
    objVerify
};