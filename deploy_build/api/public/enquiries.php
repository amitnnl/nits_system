<?php
require_once '../config.php'; // This includes the core API config with CORS and helpers

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    
    if(!empty($data['name']) && !empty($data['phone'])) {
        
        $name = mysqli_real_escape_string($con, $data['name']);
        $email = !empty($data['email']) ? mysqli_real_escape_string($con, $data['email']) : '';
        $phone = mysqli_real_escape_string($con, $data['phone']);
        $message = !empty($data['message']) ? mysqli_real_escape_string($con, $data['message']) : '';
        
        $query = "INSERT INTO enquiries (name, email, phone, message) VALUES ('$name', '$email', '$phone', '$message')";
        
        if (mysqli_query($con, $query)) {
            sendSuccess(null, "Enquiry submitted successfully.");
        } else {
            sendError("Unable to submit enquiry.", 503);
        }
    } else {
        sendError("Incomplete data. Name and Phone are required.", 400);
    }
} else {
    sendError("Method not allowed.", 405);
}
?>
