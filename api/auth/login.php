<?php
include_once(__DIR__ . '/../config.php');

$input = getJsonInput();

$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($email) || empty($password)) {
    sendError('Email and password are required');
}

$stmt = $con->prepare("SELECT id, fname, lname FROM users WHERE email=? AND password=?");
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $user = $res->fetch_assoc();
    
    // Set student session variables
    $_SESSION['id'] = $user['id'];
    $_SESSION['name'] = $user['fname'];
    $_SESSION['role'] = 'student';
    
    sendSuccess([
        'id' => $user['id'],
        'name' => $user['fname'] . ' ' . $user['lname'],
        'role' => 'student'
    ], 'Login successful');
} else {
    sendError('Invalid email or password');
}
?>
