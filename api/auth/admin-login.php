<?php
include_once(__DIR__ . '/../config.php');

$input = getJsonInput();

$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($username) || empty($password)) {
    sendError('Username and password are required');
}

$stmt = $con->prepare("SELECT id, username, password, role FROM admin WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $admin = $res->fetch_assoc();
    $db_pass = $admin['password'];
    
    // Verify password (support both legacy MD5 and modern bcrypt)
    if ($db_pass === md5($password) || password_verify($password, $db_pass)) {
        // Set admin session variables
        $_SESSION['login'] = $admin['username'];
        $_SESSION['adminid'] = $admin['id'];
        $_SESSION['role'] = $admin['role'];
        
        sendSuccess([
            'id' => $admin['id'],
            'username' => $admin['username'],
            'role' => $admin['role']
        ], 'Admin login successful');
    } else {
        sendError('Invalid admin username or password');
    }
} else {
    sendError('Invalid admin username or password');
}
?>
