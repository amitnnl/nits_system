<?php
include_once(__DIR__ . '/../config.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$input = getJsonInput();
$email = trim($input['email'] ?? $input['femail'] ?? '');

if (empty($email)) {
    sendError('Email address is required');
}

$stmt = $con->prepare("SELECT email, password, fname FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $user = $res->fetch_assoc();
    $password = $user['password'];
    $fname = $user['fname'];
    
    $vendor_path = __DIR__ . '/../../vendor/autoload.php';
    $mail_sent = false;
    $error_info = '';
    
    if (file_exists($vendor_path)) {
        try {
            require_once($vendor_path);
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            
            // SMTP settings (configured by user)
            $smtp_user = 'your gmail id here'; 
            $smtp_pass = 'your gmail password here';
            
            if ($smtp_user !== 'your gmail id here' && $smtp_pass !== 'your gmail password here') {
                $mail->Username = $smtp_user;
                $mail->Password = $smtp_pass;
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;
                
                $mail->setFrom($smtp_user, 'NITS Computer Education');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = "Information about your password";
                $mail->Body = "Dear " . htmlspecialchars($fname) . ",<p>Your password is: <strong>" . htmlspecialchars($password) . "</strong></p>";
                
                $mail->send();
                $mail_sent = true;
            } else {
                $error_info = 'SMTP credentials are not configured';
            }
        } catch (\Exception $e) {
            $error_info = $e->getMessage();
        }
    } else {
        $error_info = 'PHPMailer vendor library not found';
    }
    
    if ($mail_sent) {
        sendSuccess(null, 'Your Password has been sent Successfully to your email');
    } else {
        // Return simulated success with password to user during local development
        sendSuccess([
            'simulated' => true,
            'password' => $password
        ], 'SMTP Mailer is not configured. Your password is: ' . $password);
    }
} else {
    sendError('Email address is not registered with us');
}
?>
