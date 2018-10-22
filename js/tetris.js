let boardCanvas = document.getElementById('tetris');
let squareContext = boardCanvas.getContext('2d');

const ROW = 20;
const COL = 10; //Collumns
const SQ = 20; //Square size

const VACANT = 'white';


//SQUARE drawing

function drawSquare(x, y, color){
    squareContext.fillStyle = color;
    squareContext.fillRect(x*SQ, y*SQ, SQ, SQ);

    squareContext.strokeStyle = 'black';
    squareContext.strokeRect(x*SQ, y*SQ, SQ, SQ);
}


//BOARD stuff

let board = [];

for(let r = 0; r < ROW; r++) {
    board[r] = [];

    for(let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
} 

function drawBoard() {
    for(let r = 0; r < ROW; r++) {
        for(let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();