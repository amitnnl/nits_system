<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'receptionist'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['uid'])) {
        // Fetch single user details
        $userid = (int)$_GET['uid'];
        $stmt = $con->prepare("SELECT * FROM users WHERE id=?");
        $stmt->bind_param("i", $userid);
        $stmt->execute();
        $res = $stmt->get_result();
        
        if ($res->num_rows > 0) {
            sendSuccess($res->fetch_assoc());
        } else {
            sendError('User not found', 404);
        }
    } else {
        // Fetch list of users with optional filtering
        $range = $_GET['range'] ?? '';
        $search = trim($_GET['search'] ?? '');
        
        $sql = "SELECT id, fname, lname, email, contactno, posting_date, course, reg_number FROM users WHERE 1=1";
        
        if ($range === 'yesterday') {
            $sql .= " AND DATE(posting_date) = CURRENT_DATE() - 1";
        } else if ($range === 'today') {
            $sql .= " AND DATE(posting_date) = CURRENT_DATE()";
        } else if ($range === 'last7') {
            $sql .= " AND DATE(posting_date) >= NOW() - INTERVAL 7 DAY";
        } else if ($range === 'last30') {
            $sql .= " AND DATE(posting_date) >= NOW() - INTERVAL 30 DAY";
        }
        
        if ($search !== '') {
            $search_escaped = mysqli_real_escape_string($con, $search);
            $sql .= " AND (fname LIKE '%$search_escaped%' OR lname LIKE '%$search_escaped%' OR email LIKE '%$search_escaped%' OR contactno LIKE '%$search_escaped%' OR reg_number LIKE '%$search_escaped%')";
        }
        
        $sql .= " ORDER BY id DESC";
        $res = mysqli_query($con, $sql);
        
        $users = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $users[] = $row;
        }
        
        sendSuccess($users);
    }
} else if ($method === 'POST') {
    // Update user profile
    $userid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    if ($userid <= 0) {
        sendError('User ID is required for updates');
    }
    
    $input = getJsonInput();
    
    $fname = trim($input['fname'] ?? '');
    $lname = trim($input['lname'] ?? '');
    $contact = trim($input['contactno'] ?? $input['contact'] ?? '');
    $father = trim($input['father'] ?? '');
    $course = trim($input['course'] ?? '');
    $dob = trim($input['dob'] ?? '');
    $address = trim($input['address'] ?? '');
    $gender = trim($input['gender'] ?? '');
    $aadhar = trim($input['aadhar'] ?? '');
    $reg_number = trim($input['reg_number'] ?? '');
    $posting_date = trim($input['posting_date'] ?? '');
    
    if (empty($fname) || empty($lname) || empty($reg_number)) {
        sendError('Required fields (first name, last name, registration number) are missing');
    }
    
    $stmt = $con->prepare("UPDATE users SET fname=?, lname=?, contactno=?, father=?, course=?, dob=?, gender=?, aadhar=?, address=?, posting_date=?, reg_number=? WHERE id=?");
    $stmt->bind_param("sssssssssssi", $fname, $lname, $contact, $father, $course, $dob, $gender, $aadhar, $address, $posting_date, $reg_number, $userid);
    
    if ($stmt->execute()) {
        sendSuccess(null, 'User profile updated successfully');
    } else {
        sendError('Database error: ' . $con->error);
    }
} else if ($method === 'DELETE') {
    $userid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    if ($userid <= 0) {
        sendError('User ID is required for deletion');
    }
    
    $stmt = $con->prepare("DELETE FROM users WHERE id=?");
    $stmt->bind_param("i", $userid);
    
    if ($stmt->execute()) {
        sendSuccess(null, 'User deleted successfully');
    } else {
        sendError('Database error: ' . $con->error);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
