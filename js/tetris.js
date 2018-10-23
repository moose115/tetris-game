let boardCanvas = document.getElementById('tetris');
let squareContext = boardCanvas.getContext('2d');

const ROW = 20;
const COL = 10; //Collumns
const SQ = 20; //Square size

const VACANT = 'white';

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoNumber = 0;
        this.activeTetromino = this.tetromino[this.tetrominoNumber];

        this.x = 3;
        this.y = -2;

        this.timerID = setInterval(this.moveDown.bind(this), 1000);
    }

    draw() {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, this.color);
                }
            }
        }
    }

    undraw() {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                drawSquare(this.x + c, this.y + r, VACANT);
            }
        }
    }

    moveRight() {
        this.undraw();
        this.x++;
        this.draw();
    }

    moveLeft() {
        this.undraw();
        this.x--;
        this.draw();
    }

    moveDown() {
        this.undraw();
        this.y++;
        this.draw();
    }
    
    rotate() {
        this.undraw();
        this.tetrominoNumber = (this.tetrominoNumber + 1) % 4;
        this.activeTetromino = this.tetromino[this.tetrominoNumber];
        this.draw();
    }
}

//SQUARE drawing

function drawSquare(x, y, color){
    squareContext.fillStyle = color;
    squareContext.fillRect(x*SQ, y*SQ, SQ, SQ);

    squareContext.strokeStyle = 'black';
    squareContext.strokeRect(x*SQ, y*SQ, SQ, SQ);
}


//BOARD stuff

let board = [];

for(let r = 0; r < ROW; r++) { //init board as empty
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


//Get random piece

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return PIECES[r][0];
}

function randomColor() {
    let r = Math.floor(Math.random() * PIECES.length);
    return PIECES[r][1];
}

//initiate a new piece

function createPiece() {
    let p = new Piece(randomPiece(), randomColor());
    window.addEventListener('keypress', (event) => { //arrow controls(move, rotate)
        if(event.keyCode == 37) {
            p.moveLeft();
        }
        if(event.keyCode == 38) {
            p.rotate();
        }
        if(event.keyCode == 39) {
            p.moveRight();
        }
        if(event.keyCode == 40) {
            p.moveDown();
        }
        
    });

    return p;
}

