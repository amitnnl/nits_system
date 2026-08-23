<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || ($_SESSION['role'] !== 'admin')) {
    sendError('Unauthorized', 401);
}

$adminid = $_SESSION['adminid'];
$input = getJsonInput();

$currentpassword = trim($input['currentpassword'] ?? '');
$newpassword = trim($input['newpassword'] ?? '');

if (empty($currentpassword) || empty($newpassword)) {
    sendError('Current password and new password are required');
}

$oldpassword_md5 = md5($currentpassword);
$newpassword_md5 = md5($newpassword);

// Verify current password
$stmt = $con->prepare("SELECT password FROM admin WHERE id=? AND password=?");
$stmt->bind_param("is", $adminid, $oldpassword_md5);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    // Update password
    $stmt_update = $con->prepare("UPDATE admin SET password=? WHERE id=?");
    $stmt_update->bind_param("si", $newpassword_md5, $adminid);
    
    if ($stmt_update->execute()) {
        sendSuccess(null, 'Password changed successfully');
    } else {
        sendError('Database error: ' . $con->error);
    }
} else {
    sendError('Old password does not match');
}
?>
