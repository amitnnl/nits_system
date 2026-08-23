<?php
include_once(__DIR__ . '/../config.php');

if (isset($_SESSION['role'])) {
    if ($_SESSION['role'] === 'student' && isset($_SESSION['id'])) {
        sendSuccess([
            'authenticated' => true,
            'role' => 'student',
            'id' => $_SESSION['id'],
            'name' => $_SESSION['name'] ?? ''
        ]);
    } else if (in_array($_SESSION['role'], ['admin', 'receptionist', 'instructor']) && isset($_SESSION['adminid'])) {
        sendSuccess([
            'authenticated' => true,
            'role' => $_SESSION['role'],
            'id' => $_SESSION['adminid'],
            'username' => $_SESSION['login'] ?? ''
        ]);
    }
}

// Check old session compatibility
if (isset($_SESSION['id'])) {
    sendSuccess([
        'authenticated' => true,
        'role' => 'student',
        'id' => $_SESSION['id'],
        'name' => $_SESSION['name'] ?? ''
    ]);
} else if (isset($_SESSION['adminid'])) {
    sendSuccess([
        'authenticated' => true,
        'role' => $_SESSION['role'] ?? 'admin', // fallback
        'id' => $_SESSION['adminid'],
        'username' => $_SESSION['login'] ?? ''
    ]);
}

sendSuccess([
    'authenticated' => false
]);
?>
