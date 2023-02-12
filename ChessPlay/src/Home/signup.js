
$(document).on("change", "#pass1, #pass2", function(){
    validatePassword();
})

$(document).on("change", "#userName", function(){
    validateUserName();
})

function validateUserName(){

    let userName = $("#userName").val();
    let lower = false;
    let upper = false;
    let number = false;
    
    for(i = 0; i < userName.length; i++){
        lower = false;
        upper = false;
        number = false;
        c = userName.charCodeAt(i);
        for(j = 97; j < 123; j++){
            if(c == j){
                lower = true;
                break;
            }
            
        }
        for(j = 65; j < 91; j++){
            if(c == j){
                upper = true;
                break;
            }
            
        }
        for(j = 48; j < 57; j++){
            if(c == j){
                number = true;
                break;
            }
            
        }
        if(!(lower || upper || number)){
            break;
        }
    }

    if(lower || upper || number){
        if(userName.includes("guest")){
            document.getElementById("userName").setCustomValidity("Please choose a different username.");
        }else{
            document.getElementById("userName").setCustomValidity("");
        }
    }else{
        
        document.getElementById("userName").setCustomValidity("User name must include alphanumeric characters or numbers only.");
    }

}

function validatePassword(){

    let pass1 = $("#pass1").val();
    let pass2 = $("#pass2").val();
    let userName = $("#userName").val();
    console.log(userName);
    if(!(pass1 === pass2)){
        document.getElementById("pass2").setCustomValidity("Passwords Don't Match");
    }else{
        document.getElementById("pass2").setCustomValidity("");
    }
    if(pass1.includes(userName)){
        document.getElementById("pass1").setCustomValidity("Password can not include user name.");
    }else{
        document.getElementById("pass1").setCustomValidity("");
    }

}

function submitForm(){

    let email = $("#email").val();
    let userName = $("#userName").val();
    let pass = $("#pass1").val();
    document.body.style.cursor='wait';

    $.ajax({
        url: "signup.php",
        type: "POST",
        data: {createAccount: true, email, userName, pass},
        success: function(data){
            document.body.style.cursor='default';
            if(data.includes("email already exists.")){
                alert("Email already exists.");
                
            }else if(data.includes("User Name already exists.")){
                alert("User Name already exists.");
            }else if(data.includes("Email failed to send.")){
                alert("Email failed to send. Please check spelling or enter valid email.");

            }else if(data.includes("Email sent.")){
                alert("An Email has been sent. Please verify by clicking the link in your Email.");
            }else if(data.includes("Please check your email.")){
                alert("An Email has already been sent. Please verify by clicking the link in your Email.");
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