<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'receptionist'])) {
    sendError('Unauthorized', 401);
}

$fromdate = $_GET['fromdate'] ?? '';
$todate = $_GET['todate'] ?? '';

if (empty($fromdate) || empty($todate)) {
    sendError('From Date and To Date parameters are required');
}

$stmt = $con->prepare("SELECT id, fname, lname, email, contactno, posting_date, course, reg_number FROM users WHERE DATE(posting_date) BETWEEN ? AND ? ORDER BY id DESC");
$stmt->bind_param("ss", $fromdate, $todate);
$stmt->execute();
$res = $stmt->get_result();

$users = [];
while ($row = $res->fetch_assoc()) {
    $users[] = $row;
}

sendSuccess($users);
?>
