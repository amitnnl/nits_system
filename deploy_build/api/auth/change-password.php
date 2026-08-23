<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];
$input = getJsonInput();

$currentpassword = trim($input['currentpassword'] ?? '');
$newpassword = trim($input['newpassword'] ?? '');

if (empty($currentpassword) || empty($newpassword)) {
    sendError('Current password and new password are required');
}

// Verify current password
$stmt = $con->prepare("SELECT password FROM users WHERE id=? AND password=?");
$stmt->bind_param("is", $userid, $currentpassword);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    // Update password
    $stmt_update = $con->prepare("UPDATE users SET password=? WHERE id=?");
    $stmt_update->bind_param("si", $newpassword, $userid);
    
    if ($stmt_update->execute()) {
        sendSuccess(null, 'Password changed successfully');
    } else {
        sendError('Database error: ' . $con->error);
    }
} else {
    sendError('Current password does not match');
}
?>
