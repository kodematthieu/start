import Texture from "./Texture.js";
import Board from './Board.js';

let TextureSet = null;
const _id = new WeakMap();
const _name = new WeakMap();
const _type = new WeakMap();
const _isLight = new WeakMap();
const _texture = new WeakMap();

const tr1 = {p: -1, P: 1, n: -2, N: 2, b: -3, B: 3, r: -4, R: 4, q: -5, Q: 5, k: -6, K: 6};
const tr2 = {
    '-1': ['Pawn', false], '1': ['Pawn', true],
    '-2': ['Knight', false], '2': ['Knight', true],
    '-3': ['Bishop', false], '3': ['Bishop', true],
    '-4': ['Rook', false], '4': ['Rook', true],
    '-5': ['Queen', false], '5': ['Queen', true],
    '-6': ['King', false], '6': ['King', true],
};


class Piece {
    static get Texture() {return TextureSet == null ? new Texture() : TextureSet}
    static set Texture(v) {if(v instanceof Texture) TextureSet = v}
    static Pawn(isLight) {
        let code = 'p';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static Knight(isLight) {
        let code = 'n';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static Bishop(isLight) {
        let code = 'b';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static Rook(isLight) {
        let code = 'r';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static Queen(isLight) {
        let code = 'q';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static King(isLight) {
        let code = 'k';
        return new this(!!isLight?code.toUpperCase():code);
    }
    static isEnemy(self, other) {
        return self.isLight == other.isLight;
    }
    get [Symbol.toStringTag]() {return this.name + this.constructor.name}
    get id() {return _id.get(this)}
    get name() {return _name.get(this)}
    get type() {return _type.get(this)}
    get isLight() {return _isLight.get(this)}
    get texture() {return _texture.has(this) ? _texture.get(this) : null}
    constructor(idOrCode) {
        if(typeof idOrCode === 'string') {
            if(!(idOrCode in tr1)) throw new ReferenceError(`The code \`${idOrCode}\` does not exist.`);
            idOrCode = tr1[idOrCode];
        }
        if(!(typeof idOrCode === 'number' || (/^-?\d$/).test(idOrCode))) throw new TypeError(`Invalid parameter for argument \`idOrCode\`. Expected of type number or string.`);
        idOrCode = String(idOrCode);
        if(!(idOrCode in tr2)) throw new ReferenceError(`The id \`${idOrCode}\` does not exist.`);
        _id.set(this, idOrCode);
        idOrCode = tr2[idOrCode];
        _name.set(this, (!idOrCode[1] ? 'Black' : 'White') + idOrCode[0]);
        _type.set(this, idOrCode[0]);
        _isLight.set(this, idOrCode[1]);
        let texture = this.constructor.Texture[this.name];
        if(typeof texture === 'string') {
            let img = new Image();
            img.src = texture;
            if(img.complete) _texture.set(this, img);
            else img.onload = _ => _texture.set(this, img);
        }
        else if(texture instanceof HTMLImageElement) {
            if(texture.complete) _texture.set(this, texture);
            else texture.onload = _ => _texture.set(this, texture);
        }
    }
    promote(idOrCode) {
        if(this.type !== 'Pawn') throw new TypeError(`Can't promote a ${this.type} to other pieces.`);
        if(typeof idOrCode === 'string') {
            if(!(idOrCode in tr1)) throw new ReferenceError(`The code \`${idOrCode}\` does not exist.`);
            idOrCode = tr1[idOrCode];
        }
        if(!(typeof idOrCode === 'number' || (/^-?\d$/).test(idOrCode))) throw new TypeError(`Invalid parameter for argument \`idOrCode\`. Expected of type number or string.`);
        idOrCode = String(idOrCode);
        if(!(idOrCode in tr2)) throw new ReferenceError(`The id \`${idOrCode}\` does not exist.`);
        if(['-6', '6', '-1', '1'].includes(idOrCode)) throw new TypeError('Can\'t promote to a King or Pawn.');
        _id.set(this, idOrCode);
        idOrCode = tr2[idOrCode];
        _name.set(this, (!idOrCode[1] ? 'Black' : 'White') + idOrCode[0]);
        _type.set(this, idOrCode[0]);
        _isLight.set(this, idOrCode[1]);
    }
    getValidMoves(board) {
        if(!(board instanceof Board)) throw new TypeError('Board required as an argument!');
        
    }
}
export default Piece;