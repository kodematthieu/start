import * as util from "./util.js";
import Piece from './Piece.js'; 

class Board {
    static from(setup) {
        if(typeof setup === 'string') return this.fromFEN(...arguments);
        if(setup instanceof Array) return this.fromArray(...arguments);
    }
    static fromFEN(setup, theme) {
        let [formation, movestr, castlestr, enpassant, halfmove, fullmove] = setup.toString().split(' ');
        formation = formation.replace(/\d/g, e => ''.padStart(Number(e), ' ')).split('').filter(e => e !== '/');
        let board = this.fromArray(formation, theme);
        castlestr = castlestr.split('');
        board.castle.white[0] = castlestr.includes('K');
        board.castle.white[1] = castlestr.includes('Q');
        board.castle.black[0] = castlestr.includes('k');
        board.castle.black[1] = castlestr.includes('q');
        board.isWhiteToMove = movestr === 'w';
        return board;
    }
    static fromArray(setup, theme) {
        if(setup.length != 64) throw new TypeError(`Expected an array with a length of 64. Received an array with a length of ${setup.length}`);
        setup = setup.map(e => e != null && e !== ' ' ? new Piece(e) : null);
        let board = new this(theme);
        for(let i = 0; i < setup.length; i++) board[i].piece = setup[i];
        return board;
    }
    constructor(theme) {
        if(typeof theme !== 'object') theme = {};
        this.theme = util.objVerify({...theme}, [
            ['light', e => typeof e === 'string', '#f0f0f0'],
            ['dark', e => typeof e === 'string', '#3d3d3d'],
            ['color1', e => typeof e === 'string', '#ffd83c80'],
            ['color2', e => typeof e === 'string', '#ff3c3cbf'],
        ]);
        this.isWhiteToMove = true;
        this.castle = {
            white: [true, true],
            black: [true, true]
        };
        for(let i = 0; i < 64; i++) {
            this[i] = {
                pos: {x: i % 8, y: Math.floor(i / 8)},
                isLight: (i%8 + Math.floor(i / 8)) % 2 == 0,
                piece: null,
                color: 0
            };
        }
    }
    render(opts, ctx) {
        if(typeof opts !== 'object') opts = {};
        util.objVerify(opts, [
            ['width', e => typeof e === 'number', 100],
            ['height', e => typeof e === 'number', 100],
        ]);
        ctx = util.verify(ctx, e => e instanceof HTMLCanvasElement || e instanceof CanvasRenderingContext2D, document.createElement('canvas'));
        if(ctx instanceof HTMLCanvasElement) ctx = ctx.getContext('2d');
        opts = {size: Math.min(opts.width, opts.height)};
        opts.boxSize = opts.size/8;
        ctx.canvas.width = ctx.canvas.height = opts.size;
        let animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0,0,opts.size,opts.size);
            for(let i = 0; i < 64; i++) {
                let box = this[i];
                let {pos} = box;
                ctx.beginPath();
                if(box.isLight) ctx.fillStyle = this.theme.light;
                else ctx.fillStyle = this.theme.dark;
                ctx.rect(opts.boxSize*pos.x, opts.boxSize*pos.y, opts.boxSize*pos.x+opts.boxSize, opts.boxSize*pos.y+opts.boxSize);
                ctx.fill();
                ctx.closePath();
                if(box.color == 0) {
                    ctx.beginPath();
                    if(box.color == 1) ctx.fillStyle = this.theme.color1;
                    if(box.color == 2) ctx.fillStyle = this.theme.color2;
                    ctx.rect(opts.boxSize*pos.x, opts.boxSize*pos.y, opts.boxSize*pos.x+opts.boxSize, opts.boxSize*pos.y+opts.boxSize);
                    ctx.fill();
                    ctx.closePath();
                }
                if(box.piece instanceof Piece && box.piece.texture != null) ctx.drawImage(box.piece.texture, opts.boxSize*pos.x, opts.boxSize*pos.y, opts.boxSize, opts.boxSize);
            }
        };
        animate();
        return ctx.canvas;
    }
}
export default Board;