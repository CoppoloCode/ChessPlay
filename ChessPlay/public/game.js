let gameId;
let gameState;
let opponent;
let color;
let whosTurn;
let squaresUnderAttack = [];

let squareNames = [['a8','b8','c8','d8','e8','f8','g8','h8'],
                        ['a7','b7','c7','d7','e7','f7','g7','h7'],
                        ['a6','b6','c6','d6','e6','f6','g6','h6'],
                        ['a5','b5','c5','d5','e5','f5','g5','h5'],
                        ['a4','b4','c4','d4','e4','f4','g4','h4'],
                        ['a3','b3','c3','d3','e3','f3','g3','h3'],
                        ['a2','b2','c2','d2','e2','f2','g2','h2'],
                        ['a1','b1','c1','d1','e1','f1','g1','h1']];


let boardToUse = [];

let beforeMove = [];


let pawnsMoved = new Map();
let images = new Map();
let moved = false;
let pieceMoved;
let confirmedMove = false;
let yourTurn = false;
let inCheck = false;
let extraQueens = 0;
let extraRooks = 2;
let extraBishops = 2;
let extraKnights = 2;

images.set('wp1','whitePawn.png');
images.set('wp2','whitePawn.png');
images.set('wp3','whitePawn.png');
images.set('wp4','whitePawn.png');
images.set('wp5','whitePawn.png');
images.set('wp6','whitePawn.png');
images.set('wp7','whitePawn.png');
images.set('wp8','whitePawn.png');
images.set('wr1','whiteRook.png');
images.set('wk1','whiteKnight.png');
images.set('wb1','whiteBishop.png');
images.set('wr2','whiteRook.png');
images.set('wk2','whiteKnight.png');
images.set('wb2','whiteBishop.png');
images.set('wqu','whiteQueen.png');
images.set('wki','whiteKing.png');

images.set('bp1','blackPawn.png');
images.set('bp2','blackPawn.png');
images.set('bp3','blackPawn.png');
images.set('bp4','blackPawn.png');
images.set('bp5','blackPawn.png');
images.set('bp6','blackPawn.png');
images.set('bp7','blackPawn.png');
images.set('bp8','blackPawn.png');
images.set('br1','blackRook.png');
images.set('bk1','blackKnight.png');
images.set('bb1','blackBishop.png');
images.set('br2','blackRook.png');
images.set('bk2','blackKnight.png');
images.set('bb2','blackBishop.png');
images.set('bqu','blackQueen.png');
images.set('bki','blackKing.png');

for(i = 1; i < 8; i++){

    images.set('wq'+i, 'whiteQueen.png');
    images.set('bq'+i, 'blackQueen.png');
    images.set('wr'+(i+2), 'whiteRook.png');
    images.set('br'+(i+2), 'blackRook.png');
    images.set('wb'+(i+2), 'whiteBishop.png');
    images.set('bb'+(i+2), 'blackBishop.png');
    images.set('wk'+(i+2), 'whiteKnight.png');
    images.set('bk'+(i+2), 'blackKnight.png');
}


socket.on('game-data', (game, gameData) =>{

    gameId = game;
    if(gameData[0].includes(userName)){
        color = gameData[0][0];
        opponent = gameData[1].split('.')[1];
    }else{
        color = gameData[1][0];
        opponent = gameData[0].split('.')[1];
    }
    if(color == '0'){
        color = 'white';
    }else{
        color = 'black';
    }
    whosTurn = gameData[4];

    if(whosTurn == userName){
        yourTurn = true;
    }else{
        yourTurn = false;
    }
    if(yourTurn){
        moved = false;
        confirmedMove = false;
    }

    gameState = gameData[2];
    gameData[3] = gameData[3].split('.');

    for(i = 0; i < gameData[3].length; i++){
        gameData[3][i] = gameData[3][i].split(',');
        gameData[3][i][1] =  parseInt(gameData[3][i][1]);
    }

    for(i = 0; i < gameData[3].length; i++){
        pawnsMoved.set(gameData[3][i][0],gameData[3][i][1]);
    }
    
    setupBoard(gameData[2]);
    setTurnStatus();

});

socket.on('opponent-moved', (board, pawnsData , turn) =>{
    whosTurn = turn;
    yourTurn = true;
    confirmedMove = false;
    moved = false;
    updatePawnsMoved(pawnsData);
    setupBoard(board);
    setTurnStatus();
})

function updatePawnsMoved(pawnsData){
    
    pawnsData = pawnsData.split('.');
    let pd = [];
    for(i = 0; i < 16; i++){
        pd.push(pawnsData[i].split(','));
    }
    
    for(i = 0; i < 16; i++){
        pawnsMoved.set(pd[i][0], parseInt(pd[i][1]));
    }
    
}

function setupBoard(board){

   
    board = board.split(','); 
    

    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            boardToUse[i] = board[i].split('.');
        }
    }
    
    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == "''"){
                boardToUse[i][j] = '';
            }   
        }
    }

    if(color == 'white'){

        setSquares();
        displayBoard();
        
        
    }else{

        flipBoard();
        setSquares();
        displayBoard();
    }
    
    
}


function setSquares(){
    document.getElementById("board").innerHTML = ''
    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            document.getElementById("board").innerHTML += `<div class='square' id='`+squareNames[i][j]+`' ondrop="drop(event)" ondragover="allowDrop(event)"></div>`;
        }
    }
}

function clearBoard(){

    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            document.getElementById(squareNames[i][j]).innerHTML = ``;
        }
    }


}

function displayBoard(){

    for(i = 0; i < 8; i++){
        for(j = 0; j < 8; j++){
            let img;
            if(images.has(boardToUse[i][j])){
                img = "assets/images/" + images.get(boardToUse[i][j]);
                if(boardToUse[i][j].includes('w') && color == 'white'){
                    document.getElementById(squareNames[i][j]).innerHTML = `<img id="`+boardToUse[i][j]+`"src="`+img+`" draggable="true" ondragstart="drag(event)" width='90px' height='90px'>`;
                }else if(!boardToUse[i][j].includes('w') && color == 'white'){
                    document.getElementById(squareNames[i][j]).innerHTML = `<img id="`+boardToUse[i][j]+`"src="`+img+`" draggable="false" width='90px' height='90px'>`;
                }else if(boardToUse[i][j].includes('w') && color == 'black'){
                    document.getElementById(squareNames[i][j]).innerHTML = `<img id="`+boardToUse[i][j]+`"src="`+img+`" draggable="false" width='90px' height='90px'>`;
                }else if(!boardToUse[i][j].includes('w') && color == 'black'){
                    document.getElementById(squareNames[i][j]).innerHTML = `<img id="`+boardToUse[i][j]+`"src="`+img+`" draggable="true" ondragstart="drag(event)" width='90px' height='90px'>`;
                }
                
            }
        }
    }


}

function setTurnStatus(){
    if(yourTurn){
        document.getElementById('turnTracker').innerText = `Your Move`;
    }else{
        document.getElementById('turnTracker').innerText = `Opponent's Move`;
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let canMove = false;
    
    if(!moved){
        if(data.includes('p')){
            if(ev.target.id.length == 3){
                canMove = canPawnMove(data,ev.target.parentNode.id);
            }else{
                canMove = canPawnMove(data,ev.target.id);
            }
            
        }else if(data.includes('r')){
            if(ev.target.id.length == 3){
                canMove = canRookMove(data,ev.target.parentNode.id);
            }else{
                canMove = canRookMove(data,ev.target.id);
            }
        }else if(data.includes('bb') || data.includes('wb')){
            if(ev.target.id.length == 3){
                canMove = canBishopMove(data,ev.target.parentNode.id);
            }else{
                canMove = canBishopMove(data,ev.target.id);
            }
        }else if(data.includes('q')){
            if(ev.target.id.length == 3){
                canMove = canQueenMove(data,ev.target.parentNode.id);
            }else{
                canMove = canQueenMove(data,ev.target.id);
            }
        }else if(data.includes('k') && !data.includes('i')){
            if(ev.target.id.length == 3){
                canMove = canKnightMove(data,ev.target.parentNode.id);
            }else{
                canMove = canKnightMove(data,ev.target.id);
            }
        }else if(data.includes('ki')){
            if(ev.target.id.length == 3){
                canMove = canKingMove(data,ev.target.parentNode.id);
            }else{
                canMove = canKingMove(data,ev.target.id);
            }
        }
        if(canMove && yourTurn){
            if(ev.target.id.length == 3){
                ev.target.parentNode.replaceChild(document.getElementById(data),ev.target);
            }else{
                ev.target.appendChild(document.getElementById(data));
            }
            if(data.includes('p')){
                canPawnUpgrade(data);
            }
            
            yourTurn = false;
            moved = true;
            pieceMoved = data;
        }
    }
    
    
}

function confirmMove(){
    
    if(moved && !confirmedMove){
        confirmedMove = true;
        yourTurn = false;
        setTurnStatus();
        if(color == 'black'){
            flipBoard();
        }
        if(pieceMoved.includes('p')){
            pawnsMoved.set(pieceMoved, pawnsMoved.get(pieceMoved)+1);
        }
        let board = convertBoard();
        let pawnsData = convertPawnsData();
        if(isKingAlive()){
            endGame();
        }else{
            socket.emit('user-moved', gameId, board, pawnsData, opponent);
        }
    }else if(!moved){
        alert('make a move!');
    }else{
        alert('wait your turn!');
    }
    
}

function flipBoard(){
    boardToUse.reverse();
    squareNames.reverse();
    for(i = 0; i < 8; i++){
        boardToUse[i].reverse();
        squareNames[i].reverse();
    } 
}

function convertBoard(){
    let board = ``;

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == ''){
                board += "''" + '.';
            }else{
                board += boardToUse[i][j] + '.';
            }
        }
        board = board.slice(0, board.length-1);
        if(i != 7){
            board += ',';
        }
       
    }
    return board;
}

function convertPawnsData(){

    let data = [...pawnsMoved.entries()];
    let pawnsData = ``;

    for(i = 0; i < data.length; i++){
        
        pawnsData += data[i][0] + ',' + data[i][1] + '.';
        
    }
    pawnsData = pawnsData.slice(0, pawnsData.length-1);

    return pawnsData;
}

function revertMove(){

    if(!confirmedMove && moved){
        yourTurn = true;
        moved = false;
        
        for(i = 0; i < 8; i++){
            boardToUse[i] = [...beforeMove[i]];
        }
        clearBoard();
        displayBoard();
    }
}

function canPawnMove(pawn,square){

    let color = pawn[0];
    let legalMoves = [];
    let from;

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == pawn){
                from = [i,j];
                if(i != 0){
                    if(boardToUse[i-1][j] != undefined && boardToUse[i-1][j] == ''){
                        legalMoves.push([i-1,j]);
                        if(i>1){
                            if(boardToUse[i-2][j] != undefined && boardToUse[i-2][j] == '' &&  pawnsMoved.get(pawn) == 0){
                                legalMoves.push([i-2,j]);
                            }
                        }
                    }
                    if(boardToUse[i-1][j-1] != undefined && boardToUse[i-1][j-1] != '' && boardToUse[i-1][j-1][0] != color ){
                        legalMoves.push([i-1,j-1]);
                    }
                    if(boardToUse[i-1][j+1] != undefined && boardToUse[i-1][j+1] != '' && boardToUse[i-1][j+1][0] != color){
                        legalMoves.push([i-1,j+1]);
                    }
                }
                
            }

        }
    }
   
    return isLegalMove(legalMoves, pawn, square, from);
    
}

function canPawnUpgrade(pawn){
    for(i = 0; i < boardToUse.length; i++){
        if(boardToUse[0][i] == pawn){
            pawnUpgrade(pawn);
        }
    }
}

function pawnUpgrade(pawn){
    
    let upgradePawnElement = `<div id="upgradePawn"> <h2> Pawn Upgrade </h2> <select id="selectUpgrade"><option>Queen</option><option>Rook</option><option>Bishop</option><option>Knight</option></select><button onclick="setUpgrade('`+pawn+`')">Upgrade</button></div>`
    document.getElementById('gameButtons').outerHTML = ``;
    document.getElementById('body').innerHTML += upgradePawnElement;

}

function setUpgrade(pawn){

    let selected = $('#selectUpgrade').val();

    if(selected == 'Queen'){
        extraQueens++;
        selected = pawn[0] + 'q' + extraQueens;
        
    }else if(selected == 'Rook'){
        extraRooks++;
        selected = pawn[0] + 'r' + extraRooks;
        
    }else if(selected == 'Bishop'){
        extraBishops++;
        selected = pawn[0] + 'b' + extraBishops;
       
    }else if(selected == 'Knight'){
        extraKnights++;
        selected = pawn[0] + 'k' + extraKnights;
        
    }

    
    let img = "assets/images/" + images.get(selected);

    document.getElementById(pawn).outerHTML = `<img id="`+selected+`"src="`+img+`" draggable="true" ondragstart="drag(event)" width='90px' height='90px'>`;
    document.getElementById('upgradePawn').outerHTML = '';
    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == pawn){
                boardToUse[i][j] = selected;
            }

        }
    }

    document.getElementById('game').innerHTML += `<div id='gameButtons'>
                                        <button onclick='resign()'>Resign</button>
                                        <button onclick='revertMove()'>Revert Move</button>
                                        <button onclick='confirmMove()'>Confrim Move</button>
                                        
                                    </div>`

}


function canRookMove(rook,square){

    

    let legalMoves = [];
    let color = rook[0];
    let from;

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == rook){
                from = [i,j];
                for(k = i-1; k >= 0; k--){
                    if(boardToUse[k][j] == ''){
                        legalMoves.push([k,j])
                    }else if( boardToUse[k][j][0] != color){
                        legalMoves.push([k,j])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = i+1; k < 8; k++){
                    if(boardToUse[k][j] == ''){
                        legalMoves.push([k,j])
                    }else if( boardToUse[k][j][0] != color){
                        legalMoves.push([k,j])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = j+1; k < 8; k++){
                    if(boardToUse[i][k] == ''){
                        legalMoves.push([i,k])
                    }else if( boardToUse[i][k][0] != color){
                        legalMoves.push([i,k])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = j-1; k >= 0; k--){
                    if(boardToUse[i][k] == ''){
                        legalMoves.push([i,k])
                    }else if( boardToUse[i][k][0] != color){
                        legalMoves.push([i,k])
                        break;
                    }else{
                        break;
                    }
                }

            }
        }
    }
    
    
    return isLegalMove(legalMoves, rook, square, from);
    

}

function canBishopMove(bishop, square){


    let legalMoves = [];
    let from;
    let color = bishop[0];

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == bishop){
                from = [i,j];
                let l = j-1;
                for(k = i-1; k >= 0; k--){
                    if(l < 0){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if(boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l--;
                }
                l = j+1;
                for(k = i-1; k >= 0; k--){
                    if(l > 7){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if(boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l++;
                }
                l = j-1;
                for(k = i+1; k < 8; k++){
                    if(l < 0){
                        break;
                    }
                   
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if( boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l--;
                }
                l = j+1;
                for(k = i+1; k < 8; k++){
                    if(l > 7){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if( boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l++;
                }

            }
        }
    }
    
    return isLegalMove(legalMoves, bishop, square, from);
    
}

function canQueenMove(queen, square){

    let legalMoves = [];
    let color = queen[0];
    let from;

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == queen){
                from = [i,j];
                for(k = i-1; k >= 0; k--){
                    if(boardToUse[k][j] == ''){
                        legalMoves.push([k,j])
                    }else if( boardToUse[k][j][0] != color){
                        legalMoves.push([k,j])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = i+1; k < 8; k++){
                    if(boardToUse[k][j] == ''){
                        legalMoves.push([k,j])
                    }else if( boardToUse[k][j][0] != color){
                        legalMoves.push([k,j])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = j+1; k < 8; k++){
                    if(boardToUse[i][k] == ''){
                        legalMoves.push([i,k])
                    }else if( boardToUse[i][k][0] != color){
                        legalMoves.push([i,k])
                        break;
                    }else{
                        break;
                    }
                }
                for(k = j-1; k >= 0; k--){
                    if(boardToUse[i][k] == ''){
                        legalMoves.push([i,k])
                    }else if( boardToUse[i][k][0] != color){
                        legalMoves.push([i,k])
                        break;
                    }else{
                        break;
                    }
                }
                let l = j-1;
                for(k = i-1; k >= 0; k--){
                    if(l < 0){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if(boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l--;
                }
                l = j+1;
                for(k = i-1; k >= 0; k--){
                    if(l > 7){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if(boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l++;
                }
                l = j-1;
                for(k = i+1; k < 8; k++){
                    if(l < 0){
                        break;
                    }
                   
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if( boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l--;
                }
                l = j+1;
                for(k = i+1; k < 8; k++){
                    if(l > 7){
                        break;
                    }
                    if(boardToUse[k][l] == ''){
                        legalMoves.push([k,l])
                    }else if( boardToUse[k][l][0] != color){
                        legalMoves.push([k,l])
                        break;
                    }else{
                        break;
                    }
                    l++;
                }

            }
        }
    }
    
   
    return isLegalMove(legalMoves, queen, square, from);
    

}

function canKnightMove(knight, square){

    let legalMoves = [];
    let color = knight[0];
    let from;

    
    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == knight){
                from = [i,j];
                let k;
                let l;
                let p;
                let n;
                let b;
                let c;
                let t;
                let y;

                k = i-2;
                l = i-1;
                p = i+2;
                n = j+2;
                b = i+1;
                c = j+1;
                t = j-1;
                y = j-2;

                if(k >= 0 && t >= 0){
                    if(boardToUse[i-2][j-1] != undefined && (boardToUse[i-2][j-1] == '' || boardToUse[i-2][j-1][0] != color)){
                        legalMoves.push([i-2,j-1]);
                    }
                }
                if(l >= 0 && y >= 0){
                    if(boardToUse[i-1][j-2] != undefined && (boardToUse[i-1][j-2] == '' || boardToUse[i-1][j-2][0] != color)){
                        legalMoves.push([i-1,j-2]);
                    }
                }
                if(b < 8 && y >= 0){
                    if(boardToUse[i+1][j-2] != undefined && (boardToUse[i+1][j-2] == '' || boardToUse[i+1][j-2][0] != color)){
                        legalMoves.push([i+1,j-2]);
                    }
                }
                if(p < 8 && t >= 0){
                    if(boardToUse[i+2][j-1] != undefined && (boardToUse[i+2][j-1] == '' || boardToUse[i+2][j-1][0] != color)){
                        legalMoves.push([i+2,j-1]);
                    }
                }
                if(p < 8 && c < 8){
                    if(boardToUse[i+2][j+1] != undefined && (boardToUse[i+2][j+1] == '' || boardToUse[i+2][j+1][0] != color)){
                        legalMoves.push([i+2,j+1]);
                    }
                }
                if(b < 8 && n < 8){
                    if(boardToUse[i+1][j+2] != undefined && (boardToUse[i+1][j+2] == '' || boardToUse[i+1][j+2][0] != color)){
                        legalMoves.push([i+1,j+2]);
                    }
                }
                if(l >= 0 && n < 8){
                    if(boardToUse[i-1][j+2] != undefined && (boardToUse[i-1][j+2] == '' || boardToUse[i-1][j+2][0] != color)){
                        legalMoves.push([i-1,j+2]);
                    }
                }
                if(k >= 0 && c < 8){
                    if(boardToUse[i-2][j+1] != undefined && (boardToUse[i-2][j+1] == '' || boardToUse[i-2][j+1][0] != color)){
                        legalMoves.push([i-2,j+1]);
                    }
                }
            }
        }
    }
    
    return isLegalMove(legalMoves, knight, square, from);
    
}

function canKingMove(king, square){

    let legalMoves = [];
    let color = king[0];
    let from;

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == king){
                from = [i,j];
                if(i+1 < 8 && j >= 0 && j < 8){
                    if(boardToUse[i+1][j] == '' || boardToUse[i+1][j][0] != color){
                        legalMoves.push([i+1,j]);
                    }
                    if(boardToUse[i+1][j-1] == '' || boardToUse[i+1][j-1][0] != color){
                        legalMoves.push([i+1,j-1]);
                    }
                    if(boardToUse[i+1][j+1] == '' || boardToUse[i+1][j+1][0] != color){
                        legalMoves.push([i+1,j+1]);
                    }
                }
                if(i-1 >= 0 && j >= 0 && j < 8){
                    if(boardToUse[i-1][j] == '' || boardToUse[i-1][j] != color){
                        legalMoves.push([i-1,j]);
                    }
                    if(boardToUse[i-1][j-1] == '' || boardToUse[i-1][j-1][0] != color){
                        legalMoves.push([i-1,j-1]);
                    }
                    if(boardToUse[i-1][j+1] == '' || boardToUse[i-1][j+1][0] != color){
                        legalMoves.push([i-1,j+1]);
                    }
                }
                if(j < 8 && j >= 0){
                    if(boardToUse[i][j-1] == '' || boardToUse[i][j-1][0] != color){
                        legalMoves.push([i,j-1]);
                    }
                    if(boardToUse[i][j+1] == '' || boardToUse[i][j+1][0] != color){
                        legalMoves.push([i,j+1]);
                    }
                }
            
            

            }

        }
    }

    
    return isLegalMove(legalMoves, king, square, from);
    


}

function isLegalMove(legalMoves, piece, square, from){

    for(i = 0; i < squareNames.length; i++){
        for(j = 0; j < squareNames.length; j++){
            if(squareNames[i][j] == square){
                target = [i,j];
            }
        }
    }

    for(i = 0; i < legalMoves.length; i++){
        if(target[0] == legalMoves[i][0] && target[1] == legalMoves[i][1]){
            for(i = 0; i < 8; i++){
                beforeMove[i] = [...boardToUse[i]];
            }
            boardToUse[target[0]][target[1]] = piece;
            boardToUse[from[0]][from[1]] = '';
            return true;
        }
    }
    return false;
}

function isKingAlive(){

    if(color == 'white'){
        opp = 'b';
    }else{
        opp = 'w';
    }

    for(i = 0; i < boardToUse.length; i++){
        for(j = 0; j < boardToUse.length; j++){
            if(boardToUse[i][j] == opp+'ki'){
                return false;
            }
        }
    }

    return true;

}

function endGame(){
    alert('You win!');
    socket.emit('end-game', gameId, opponent);
    Opponents.delete(gameRoomId);
    backToLobby();
    
}