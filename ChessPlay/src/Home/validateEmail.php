<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
require_once './vendor/autoload.php';



function sendVerificationEmail($email,$hash){
   
    $hash = 'http://localhost/mattcoppoloweb/ChessPlay/src/Home/signin.html?verify='.$hash;

    $mail = new PHPMailer(true);
    $mail->isSMTP(true);
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "coppolomatthew@gmail.com";
    $mail->Password = "tegxtazyhhxzxxvj";
    $mail->SMTPSecure = 'tsl';
    $mail->Port = "587";
    $mail->setFrom('coppolomatthew@gmail.com', 'ChessPlay');
    $mail->isHTML(true);

    
    try{
        $mail->addAddress($email);
    }catch(Exception $e){
        return false;
    }
    
    $mail->Subject = "Verify Email";
    $mail->Body = "<h2> Please click the link to Verify your Email. </h2> <a href='$hash'>Verfiy Email</a>";
    
    try{
        $mail->send();
        return true;
    }catch(Exception $e){
        return false;
    }
}

function sendForgotPasswordEmail($email,$hash){
   
    $hash = 'http://localhost/mattcoppoloweb/ChessPlay/signup.html?passReset='.$hash;

    $mail = new PHPMailer(true);
    $mail->isSMTP(true);
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "coppolomatthew@gmail.com";
    $mail->Password = "tegxtazyhhxzxxvj";
    $mail->SMTPSecure = 'tsl';
    $mail->Port = "587";
    $mail->setFrom('coppolomatthew@gmail.com', 'ChessPlay');
    $mail->isHTML(true);
    
    $mail->addAddress($email);
    
    $mail->Subject = "Forgot Password";
    $mail->Body = "<h2> Please click the link to recover your password. </h2> <a href='$hash'>Change Password</a>";
    
    try{
        $mail->send();
        return true;
    }catch(Exception $e){
        return false;
    }
}
?>