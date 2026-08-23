<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || $_SESSION['role'] !== 'admin') {
    sendError('Unauthorized. Only Super Admin can manage staff.', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT id, username, role FROM admin WHERE role IN ('receptionist', 'instructor', 'admin')";
    $res = mysqli_query($con, $sql);
    $data = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $data[] = $row;
    }
    sendSuccess($data);
} else if ($method === 'POST') {
    $input = getJsonInput();
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    $role = trim($input['role'] ?? '');

    if (empty($username) || empty($password) || empty($role)) {
        sendError('Username, password, and role are required');
    }
    
    if (!in_array($role, ['receptionist', 'instructor', 'admin'])) {
        sendError('Invalid role');
    }

    $pass_md5 = md5($password);
    
    // Check if username exists
    $check = $con->prepare("SELECT id FROM admin WHERE username=?");
    $check->bind_param("s", $username);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        sendError('Username already exists');
    }

    $stmt = $con->prepare("INSERT INTO admin (username, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $pass_md5, $role);
    
    if ($stmt->execute()) {
        sendSuccess(null, 'Staff account created successfully');
    } else {
        sendError('Failed to create account: ' . $con->error);
    }
} else if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) sendError('ID is required');
    
    // Prevent self-deletion
    if ($id == $_SESSION['adminid']) {
        sendError('You cannot delete your own account');
    }

    $stmt = $con->prepare("DELETE FROM admin WHERE id=?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        sendSuccess(null, 'Staff account deleted');
    } else {
        sendError('Failed to delete account');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
