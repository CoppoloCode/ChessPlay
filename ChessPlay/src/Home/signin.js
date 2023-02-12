
if(window.location.href.includes("verify=")){
    let verificationCode = window.location.href.split("verify=")[1];
    verifyEmail(verificationCode);
}

function signIn(){


    let email = $("#email").val();
    let password = $("#pass").val();

    $.ajax({
        url: "signin.php",
        type: "POST",
        data: {signIn: true, email, password},
        success: function(data){
            if(!data.includes("Incorrect password.")){
                window.location.assign('http://localhost:3000/' + data);
            }else{
                console.log(`failed to login.`);
            }
        },
        error: function(err){
            console.log(err.responseText);
        }
    })


}



function verifyEmail(verificationCode){
    
    $.ajax({
        url: "signin.php",
        type: "POST",
        data: {verifyEmail: true, verificationCode},
        success: function(data){
            console.log(data);
            if(data == "VERIFICATION COMPLETE"){
                console.log(`Success! Your account has been created.`);
                
            }else{
                console.log(`Email Verification has expired. Please create an account and verify within an hour.`);
            }
        },
        error: function(err){
            console.log(err.responseText);
        }
    })
    
}

function gotoHome(){

    window.location.assign("index.html");

}