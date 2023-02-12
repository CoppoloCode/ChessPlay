<?php
    require_once("configDB.php");

    if(isset($_POST["signIn"])){


        $email = $_POST["email"];
        $password = $_POST["password"];

        $stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        $emailCount = mysqli_num_rows($result);

        if($emailCount > 0){

           
            $row = $result->fetch_assoc();
            $passHash = $row["Password"];
            $userName = $row['Name'];

            if(password_verify($password, $passHash)){

                echo $userName;

            }else{
                echo "Incorrect password.";
            }


        }else{
            echo "No account found with that email.";
        }


    }else if(isset($_POST["verifyEmail"])){

        $verificationCode = $_POST["verifyEmail"];
        $expires = "date_sub(now(), interval 1 hour)";

        $stmt = $conn->prepare("SELECT * FROM pendingaccounts WHERE (Verification = ?) AND (Expires > ?)");
        $stmt->bind_param('ss', $verificationCode, $expires);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = mysqli_num_rows($result);

        $stmt = $conn->prepare("DELETE FROM pendingaccounts WHERE (Expires < ?)");
        $stmt->bind_param('s',  $expires);
        $stmt->execute();
        
    
        if($count > 0){

            $row = $result->fetch_assoc(); 

            $email = $row['Email'];

            $password = $row["Password"];

            $name = $row["Name"];

            $stmt = $conn->prepare("INSERT INTO users (Email, Password, Name) VALUES (?, ?, ?)");
            $stmt->bind_param('sss', $email,$password,$name);
            $stmt->execute();
            
            if($stmt){
                $stmt = $conn->prepare("DELETE FROM pendingaccounts WHERE Verification = ?");
                $stmt->bind_param('s', $verificationCode);
                $stmt->execute();
                $result = $stmt->get_result();
            }

            echo "VERIFICATION COMPLETE";

        }else{
            
            echo "proccess expired";
        }

    }else{
            echo "invalid input";
    }


?>