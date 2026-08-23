<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'receptionist', 'instructor'])) {
    sendError('Unauthorized', 401);
}

// Total Users
$q_total = mysqli_query($con, "SELECT COUNT(id) as total FROM users");
$total = mysqli_fetch_assoc($q_total)['total'] ?? 0;

// Yesterday's registrations
$q_yesterday = mysqli_query($con, "SELECT COUNT(id) as total FROM users WHERE DATE(posting_date) = CURRENT_DATE() - 1");
$yesterday = mysqli_fetch_assoc($q_yesterday)['total'] ?? 0;

// Last 7 days
$q_seven = mysqli_query($con, "SELECT COUNT(id) as total FROM users WHERE DATE(posting_date) >= NOW() - INTERVAL 7 DAY");
$seven = mysqli_fetch_assoc($q_seven)['total'] ?? 0;

// Last 30 days
$q_thirty = mysqli_query($con, "SELECT COUNT(id) as total FROM users WHERE DATE(posting_date) >= NOW() - INTERVAL 30 DAY");
$thirty = mysqli_fetch_assoc($q_thirty)['total'] ?? 0;

// Today's registrations
$q_today = mysqli_query($con, "SELECT COUNT(id) as total FROM users WHERE DATE(posting_date) = CURRENT_DATE()");
$today = mysqli_fetch_assoc($q_today)['total'] ?? 0;

sendSuccess([
    'totalUsers' => (int)$total,
    'yesterdayUsers' => (int)$yesterday,
    'last7DaysUsers' => (int)$seven,
    'last30DaysUsers' => (int)$thirty,
    'todayUsers' => (int)$today
]);
?>
