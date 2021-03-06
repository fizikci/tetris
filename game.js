class Game {
    constructor(columns = 10, rows = 20){
        this.columns = columns;
        this.rows = rows;
        this.timer = -1;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.score = 0;
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

        this.randomizeNextBlock();
        this.spawn();
        this.interval = setInterval(this.update.bind(this), 200);
        document.querySelector('#btn-start').style.display = 'none';
    }

    randomizeNextBlock(){
        this.nextBlock = [colors[Math.floor(Math.random()*colors.length)],new Block()];
        let preview = '<table>'+this.nextBlock[1].getShape().map(r=>'<tr>'+r.map(c=>'<td'+(c?' style="background-color:'+this.nextBlock[0]+'"':'')+'></td>').join('')+'</tr>').join('')+'</table>';
        document.querySelector('#preview').innerHTML = preview;
    }
    spawn(){
        this.color = this.nextBlock[0];
        this.currentBlock = this.nextBlock[1];
        this.randomizeNextBlock();
    }

    getCurrentBlockCells(){
        let shape = this.currentBlock.getShape();
        let cells = [];
        for(let i = 0; i<shape.length; i++)
            for(let j = 0; j<shape.length; j++)
                if(shape[i][j] == 1)
                    cells.push(this.board[this.currentBlock.y+i][this.currentBlock.x+j]);
        return cells;
    }

    moveBlockDown(){
        let oldCells = this.getCurrentBlockCells();
        this.currentBlock.y++;
        let newCells = [];
        try{newCells = this.getCurrentBlockCells();} catch{return "landed"}
        oldCells.forEach(c=>c.style.backgroundColor = '');
        if(newCells.some(c=>c.style.backgroundColor)){
            oldCells.forEach(c=>c.style.backgroundColor = this.color);
            this.currentBlock.y--;
            return this.currentBlock.y<=0 ? "gameOver" : "landed";
        }
        newCells.forEach(c=>c.style.backgroundColor = this.color);
    }

    update(){
        this.timer++;
        if(this.timer % 1 == 0){
            let res = this.moveBlockDown();
            if(res == "gameOver"){
                this.gameOver();
            } else if(res == "landed") {
                this.clearFullRows(1);
                this.spawn();
                this.score += 10;
            }
        }
        document.querySelector('#score').innerHTML = this.score.toString();
        console.log(this.score)
    }

    gameOver(){
        clearInterval(this.interval);
        document.querySelector('#btn-start').style.display = 'block';
    }

    clearFullRows(scoreMultiplier){
        for(let i = this.board.length-1; i>0; i--)
            if(this.board[i].every(c=>c.style.backgroundColor))
                this.removeRow(i, scoreMultiplier);
    }
    
    removeRow(index, scoreMultiplier){
        this.score += scoreMultiplier * scoreMultiplier * 200;
        for(let i=index; i>0; i--)
            this.board[i].forEach((c,j)=>c.style.backgroundColor = this.board[i-1][j].style.backgroundColor);
        this.clearFullRows(++scoreMultiplier);
    }

    refreshCurrentBlock(op){
        let oldValues = [this.currentBlock.x, this.currentBlock.turn];
        let oldCells = this.getCurrentBlockCells();
        (op.bind(this))();
        let newCells = this.getCurrentBlockCells();
        oldCells.forEach(c=>c.style.backgroundColor = '');
        if(newCells.some(c=>c.style.backgroundColor)){
            this.currentBlock.x = oldValues[0];
            this.currentBlock.turn = oldValues[1];
            oldCells.forEach(c=>c.style.backgroundColor = this.color);
        } else {
            newCells.forEach(c=>c.style.backgroundColor = this.color);
        }
    }

    turn(){
        this.refreshCurrentBlock(function(){
            this.currentBlock.turn = ++this.currentBlock.turn % 4;
        });
    }

    moveLeft(){
        this.refreshCurrentBlock(function(){
            this.currentBlock.x = Math.max(--this.currentBlock.x, 0-this.currentBlock.getFullStart());
        });
    }
    moveRight(){
        this.refreshCurrentBlock(function(){
            this.currentBlock.x = Math.min(++this.currentBlock.x, this.columns - this.currentBlock.getFullWidth());
        });
    }
    land(){
        let res = '';
        while(res != 'landed')
            res = this.moveBlockDown();
        this.score += 10;
        this.clearFullRows(1);
        this.spawn();
    }
}

class Block {
    constructor(shape, turn){
        this.shape = 'IOLJTZS'.substr(Math.floor(Math.random()*6), 1);
        this.turn = Math.floor(Math.random()*3);
        this.y = 0;
        this.x = Math.ceil((game.columns - 4) / 2);
    }

    getShape(){
        let arr = JSON.parse(JSON.stringify(blocks[this.shape]));
        for(let i=0; i<=this.turn; i++) rotate(arr);
        return arr;
    }

    getFullWidth(){
        let s = this.getShape();
        let m = 0;
        for(let i=0; i<s.length; i++)
            for(let j=0; j<s[i].length; j++)
                if(s[i][j] && j>m) m = j;
        return m+1;
    }

    getFullStart(){
        let s = this.getShape();
        let m = 10;
        for(let i=0; i<s.length; i++)
            for(let j=0; j<s[i].length; j++)
                if(s[i][j] && j<m) m = j;
        return m;
    }
}

const colors = ['red','crimson','darkgray','brown','orange']

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

var game;

document.querySelector('#btn-start').addEventListener('click',function(){
    game = new Game();
    game.start();
});

document.onkeydown = function (e) {
    e = e || window.event;
    if(e.key == 'ArrowUp')
        game.turn();
    else if(e.key == 'ArrowDown')
        game.land();
    else if(e.key == 'ArrowLeft')
        game.moveLeft();
    else if(e.key == 'ArrowRight')
        game.moveRight();    
};

var touchStart = null;
document.ontouchstart = function (e) {
    e = e || window.event;
    touchStart = e.changedTouches[0];
}
document.ontouchend = function (e) {
    e = e || window.event;
    let start = touchStart, end = e.changedTouches[0];
    let dx = end.screenX - start.screenX, dy = end.screenY - start.screenY;
    let adx = Math.abs(dx), ady = Math.abs(dy);

    if(Math.abs(adx-ady)<10) return;

    if(ady > adx){
        if(dy<0) // up
            game.turn();
        else // down
            game.land();
    } else {
        if(dx<0) // left
            game.moveLeft();
        else // right
            game.moveRight();
    }
};
