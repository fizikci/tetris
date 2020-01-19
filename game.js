class Game {
    constructor(columns = 10, rows = 20){
        this.columns = columns;
        this.rows = rows;
        this.timer = -1;
        var container = document.querySelector('#game-container');
        let txt = '';
        for(let i=0; i<this.rows; i++)
            for(let j=0; j<this.columns; j++)
                txt += `<div class="cell"></div>`;
        container.innerHTML = txt;
    }

    start(){
        this.board = [];
        let cells = document.querySelectorAll('.cell');
        for(let i=0; i<this.rows; i++){
            let row = [];
            for(let j=0; j<this.columns; j++)
                row.push(cells[i*this.columns+j])
            this.board.push(row);
        }

        this.spawn();
        this.interval = setInterval(this.update.bind(this), 200);
    }

    spawn(){
        this.currentBlock = new Block();
    }

    update(){
        this.timer++;
        
    }
}

class Block {
    constructor(shape, turn){
        this.shape = 'IOLJTZS'.substr(Math.floor(Math.random()*6), 1);
        this.turn = Math.floor(Math.random()*3);
        this.position = 0;
    }

    getShape(){
        let arr = JSON.parse(JSON.stringify(blocks[this.shape]));
        for(let i=0; i<=this.turn; i++) rotate(arr);
        return arr;
    }
}

const blocks = {
    "I": [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]],
    "O": [
                [1,1],
                [1,1]],
    "L": [
                [0,1,0],
                [0,1,0],
                [0,1,1]],
    "J": [
                [0,1,0],
                [0,1,0],
                [1,1,0]],
    "T": [
                [0,1,0],
                [1,1,1],
                [0,0,0]],
    "Z": [
                [1,1,0],
                [0,1,1],
                [0,0,0]],
    "S": [
                [0,1,1],
                [1,1,0],
                [0,0,0]]
}

function rotate(matrix){
    const n = matrix.length;
    const x = Math.floor(n/ 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
       for (let j = i; j < y - i; j++) {
          k = matrix[i][j];
          matrix[i][j] = matrix[y - j][i];
          matrix[y - j][i] = matrix[y - i][y - j];
          matrix[y - i][y - j] = matrix[j][y - i]
          matrix[j][y - i] = k
       }
    }
}


var game = new Game();

