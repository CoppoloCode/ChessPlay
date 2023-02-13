const socket = io('https://chessplay.herokuapp.com');
const myPeer = new Peer(undefined,{
    host: 'https://chessplay.herokuapp.com',
    port: '443',
    secure: 'true',

    
})


let userName = "" + window.location.href.split('/')[3];
let inGame = false;
let gameRoomId;
let Opponents = new Map();

socket.on('open',() => {
    if(socket.id == null){
        location.assign('https://chessplay.herokuapp.com/'+ userName);
    }
    socket.emit('connected', LOBBY_ID, socket.id, userName);
    socket.emit('join-lobby', userName, socket.id);
    setupLobby();
})

socket.on('user-connected', user => {
    console.log("User connected: " + user);
})

socket.on('new-guest-name', newName => {
    userName = newName;
    history.pushState(null,'','/'+userName);
})

socket.on('send-users', userList => {
    setupLobbyList(userList);
})

socket.on('get-ongoingGames', (games,opponents) => {
    for(i = 0; i < games.length; i++){
        Opponents.set(games[i],opponents[i]);
    }
    setupGameList(games);
})

socket.on('user-disconnected', userId => {
    console.log('user: ' + userId +   ' disconnected');
})

socket.on('incomingChallenge', user => {
    if(!inGame){
        if(!document.getElementById(user)){
            document.getElementById("requests").innerHTML += '<div id="' + user +'"><p>' + user + ' has challenged you to a game. </p><button onclick="accept(this.parentNode.id)">Accept</button><button onclick="decline(this.parentNode.id)">Decline</button> </div>';
        }
    }
    
})

socket.on('challengeAccepted' , (gameId, opponent) =>{
    inGame = true;
    gameRoomId = parseInt(gameId);
    Opponents.set(gameId, opponent);  
    setupGameRoom();
    socket.emit('join-game', gameRoomId, userName);
    
})

socket.on('join-game-message', (gameId)=> {
    gameRoomId = parseInt(gameId);
})

socket.on('recieve-message', message =>{
    placeMessage(message, true);
})

socket.on('opponent-resign', () =>{
    alert("You won by resignation!");
    Opponents.delete(gameRoomId);
    backToLobby();
})

socket.on('end-game', () =>{
    alert("You lost.");
    Opponents.delete(gameRoomId);
    backToLobby();
})

function setupLobby(){
    document.getElementById('body').innerHTML = `<h1>Lobby</h1>
                                                <div id="room">
                                                    <select id="list"></select>
                                                </div>
                                                <div id="buttons">
                                                    <button onclick="getUsers()">Refresh</button>
                                                    <button onclick="challengeUser()">Challenge</button>
                                                </div>
                                                <div id="requests"></div>
                                                <div id="ongoingGames"><h2>Ongoing Games</h2><select id="games"></select><button onclick="joinGame()">Join Game</button></div>`
}

function setupLobbyList(userList){
    if(!inGame){
        document.getElementById('list').innerHTML = ``;
        for(i = 0; i < userList.length; i++){
            if(userList[i] !== userName){
                document.getElementById('list').innerHTML += `<option>` + userList[i] + `</option>`;
            }
        }
    }
}

function setupGameList(gameList){
    if(!inGame){
        document.getElementById('games').innerHTML = ``;
        for(i = 0; i < gameList.length; i++){
            
            document.getElementById('games').innerHTML += `<option>` + gameList[i] + `</option>`;
            
        }
    }
}

function getUsers() {

    socket.emit('get-users');

}

function getOpponents(){
    socket.emit('get-opponents', userName);
}

function challengeUser(){
    let opponent = $('#list').val();
    socket.emit('challenge', userName, opponent);

}

function accept(challenger){
    document.getElementById(challenger).outerHTML = "";
    socket.emit('acceptChallenge', challenger, userName);
}

function decline(challenger){
    document.getElementById(challenger).outerHTML = "";
}
function joinGame(){
    let gameId = $('#games').val();
    if(gameId != null){
        inGame = true;
        gameRoomId = parseInt(gameId);
        setupGameRoom();
        socket.emit('join-game', gameRoomId, userName);
    }
}

function setupGameRoom(){
    
    

    document.getElementById("body").innerHTML = `<div id='gameRoom'>
                                                    <div id='game'>
                                                        <div id='board'>
                                                        </div>
                                                        <div id='gameButtons'>
                                                            <button onclick='resign()'>Resign</button>
                                                            <button onclick='revertMove()'>Revert Move</button>
                                                            <button onclick='confirmMove()'>Confirm Move</button>
                                                            
                                                        </div>
                                                    </div>
                                                    <div id='chat'>
                                                        <h2>Game: `+ gameRoomId +`</h2>
                                                        <h2 id='turnTracker'></h2>
                                                        <div id='messages'></div>
                                                        <input type='text' id='messageToSend'></input>
                                                        <button id='sendMessage' onclick='sendMessage()'>send</button>
                                                        <button onclick='backToLobby()'>Lobby</button> 
                                                    </div>
                                                </div>`;

    input = document.getElementById('messageToSend');
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("sendMessage").click();
        }
    });


}

function backToLobby(){
    inGame = false;
    if(!confirmedMove){
        moved = false;
    }
    setupLobby();
    socket.emit('leave-game', gameRoomId);
    gameRoomId = null;
    socket.emit('join-lobby', userName, socket.id);
}

function sendMessage(){
    let message = document.getElementById('messageToSend').value;
    document.getElementById('messageToSend').value = "";
    socket.emit('send-message', message, gameRoomId);
    placeMessage(message , false);
}

function placeMessage(message, isOpponent){
    if(inGame){
        if(isOpponent == true){
            document.getElementById('messages').innerHTML += `<p id='opponentMessage'>`+ Opponents.get(gameRoomId).split('.')[1] + `: ` + message + `</p>`;
        }else{
            document.getElementById('messages').innerHTML += `<p id='selfMessage'>`+ userName + `: ` + message + `</p>`;
        }
    }
   
}

function resign(){

    let response = confirm("Are you sure you want to resign?");
    if(response){
        socket.emit('resign', gameRoomId, Opponents.get(gameRoomId).split('.')[1]);
        Opponents.delete(gameRoomId);
        backToLobby();
    }
    
}