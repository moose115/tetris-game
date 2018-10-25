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

class Game {
    constructor() {

    }
}

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoNumber = 0;
        this.activeTetromino = this.tetromino[this.tetrominoNumber];

        this.x = 3;
        this.y = -2;

        this.isLocked = false;
        this.gameOver = false;

        this.timerID = setInterval(this.moveDown.bind(this), 1000)
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
                if(this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, VACANT);
                }
            }
        }
    }

    moveRight() {
        if(!this.isCollision(1, 0) && !this.isLocked) {
            this.undraw();
            this.x++;
            this.draw();
        }
    }

    moveLeft() {
        if(!this.isCollision(-1, 0) && !this.isLocked) {
            this.undraw();
            this.x--;
            this.draw();
        }
    }

    moveDown() {
        if(!this.isCollision(0, 1) && !this.isLocked) {
            this.undraw();
            console.log('move');
            this.y++;
            this.draw();
        } else {
            this.lock();
            console.log('locked!');
        }
    }
    
    rotate() {
        if(!this.isLocked && !this.isCollision(1, 0) && !this.isCollision(-1, 0)) {
            this.undraw();
            this.tetrominoNumber = (this.tetrominoNumber + 1) % this.tetromino.length; //choose pattern
            this.activeTetromino = this.tetromino[this.tetrominoNumber]; //apply pattern
            if(this.isCollision(-1, 0)) {
                this.x++;
            }
            if(this.isCollision(1, 0)) {
                this.x--;
            }
            if(this.isCollision(0, 0)) {
                this.y--;
            }

            this.draw();
        }
    }

    isCollision(deltaX, deltaY) {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(!this.activeTetromino[r][c]) {
                    continue;
                }
                let nextX = this.x + c + deltaX;
                let nextY = this.y + r + deltaY;

                if(nextX < 0 || nextX > COL || nextY >= ROW) { //is colliding with walls
                    return true;
                }

                if(nextY < 0) { //don't check if piece over the board
                    continue;
                }

                if(board[nextY][nextX] !== VACANT) { //check next square
                    return true;
                }
                
            }
        }
        return false;
    }

    wallKick(kick) {
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(this.x < 0 || this.x + c >= COL) {
                    this.x += kick;
                }
                if(this.y + r + 1 > ROW) {
                    this.y += kick;
                     console.log(this.y + r + 'kicked up!');
                }
            }
        }
    }

    lock() {
        clearInterval(this.timerID);
        for(let r = 0; r < this.activeTetromino.length; r++) {
            for(let c = 0; c < this.activeTetromino.length; c++) {
                if(!this.activeTetromino[r][c] || this.y + r >= ROW) { //ignore Vacant squares of piece and prevent drawing out of board
                    continue;
                }
                if(this.y < 0) { //if piece is above board then lock it and set game over
                    this.isLocked = true;
                    this.gameOver = true;
                    continue;
                }
                console.log(this.y + r + 'next square');
                board[this.y + r][this.x + c] = this.color;
                this.undraw();
                drawBoard();
                this.isLocked= true;
            }

            for(let r = 0; r < ROW; r++) { //clearing full row
                let isFull = true;
                for(let c = 0; c < COL; c++) {
                    isFull = isFull && (board[r][c] !== VACANT); //checking if row is full
                }
                if(isFull) {
                    for(let i = r; i > 1; i--) {
                        for(let j = 0; j < COL; j++) {
                            board[i][j] = board[i - 1][j]; //drop rows by one
                        }
                    }
                    for(let j = 0; j < COL; j++) { //top row doesn't have row above to inherit, so set to Vacant
                        board[0][j] = VACANT
                    }

                    drawBoard();
                    console.log('row removed');
                }
            }
        }
        if(!this.gameOver) {
            createPiece();
        } else {
            alert('game over');
        }
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

function drawBoard(obj) {
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
    let r = Math.floor(Math.random() * 566666 + 100000);
    return '#' + r;
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
        if(event.keyCode == 40 && !p.isLocked) {
            p.moveDown();
        }
        
    });

    return p;
}

