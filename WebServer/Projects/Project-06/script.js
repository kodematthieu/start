import chess from "./chess/index.js";

const {innerWidth: Width, innerHeight: Height} = window;
const game = chess.Board.from('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
document.body.appendChild(game.render({width: Width, height: Height}));