
function playAsGuest() {
  
  let randomId = Math.floor(Math.random() * 1000);

  guestName = 'guest-' + randomId;

  location.assign("http://localhost:3000/" + guestName);
}

function login() {
  location.assign("signin.html");
}

function signup() {

    location.assign("signup.html");

}
