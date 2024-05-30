const Test = new Proxy(class Test {}, {
    // construct(target, args, self) {
    //     console.log(arguments);
    //     return Reflect.construct(target, args, self);
    // },
    apply(target, self, args) {
        if(typeof self !== 'object') self = new target(...args);
        return Reflect.construct(target, args, null);
    }
});
new Test()
Test()