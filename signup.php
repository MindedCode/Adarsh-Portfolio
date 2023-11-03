<?php
if(isset($_POST['submit'])){
    $to = "pateladarsh.golu8181@gmail.com"; // Aapke email address ko yahan enter karein
    $from = $_POST['email'];
    $username = $_POST['username'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    $headers = "From:" . $from;
    $txt = "Aapko ek email mila hai from: ".$username."\n\nSubject: ".$subject."\n\nMessage: ".$message;

    if(mail($to,"New Email from Contact Form", $txt, $headers)){
        echo "Email sent successfully.";
    } else{
        echo "Failed to send email. Please try again later.";
    }
}
?>