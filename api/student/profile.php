<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $con->prepare("SELECT id, fname, lname, email, contactno, dob, image, father, gender, course, address, reg_no, posting_date, reg_number, aadhar FROM users WHERE id=?");
    $stmt->bind_param("i", $userid);
    $stmt->execute();
    $res = $stmt->get_result();
    
    if ($res->num_rows > 0) {
        sendSuccess($res->fetch_assoc());
    } else {
        sendError('User not found', 404);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    
    $fname = trim($input['fname'] ?? '');
    $lname = trim($input['lname'] ?? '');
    $contact = trim($input['contactno'] ?? $input['contact'] ?? '');
    
    if (empty($fname) || empty($lname) || empty($contact)) {
        sendError('Required fields are missing');
    }
    
    $stmt = $con->prepare("UPDATE users SET fname=?, lname=?, contactno=? WHERE id=?");
    $stmt->bind_param("sssi", $fname, $lname, $contact, $userid);
    
    if ($stmt->execute()) {
        $_SESSION['name'] = $fname;
        sendSuccess(null, 'Profile updated successfully');
    } else {
        sendError('Database error: ' . $con->error);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
