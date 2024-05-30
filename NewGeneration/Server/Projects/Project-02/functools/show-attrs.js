export default function(cls, attrs, custom = {}) {
  for(let attr of attrs) Object.defineProperty(cls.prototype, attr, Object.assign(custom, {enumerable: true, configurable: true}));
  return cls;
}