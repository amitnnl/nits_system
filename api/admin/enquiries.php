<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'receptionist'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch enquiries
    $statusFilter = $_GET['status'] ?? '';
    
    $sql = "SELECT * FROM enquiries";
    if (!empty($statusFilter)) {
        $statusEsc = mysqli_real_escape_string($con, $statusFilter);
        $sql .= " WHERE status = '$statusEsc'";
    }
    $sql .= " ORDER BY created_at DESC";
    
    $res = mysqli_query($con, $sql);
    $enquiries = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $enquiries[] = $row;
    }
    sendSuccess($enquiries);
} else if ($method === 'PUT') {
    // Update status
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) sendError('Enquiry ID required');
    
    $input = getJsonInput();
    $status = $input['status'] ?? '';
    if (!in_array($status, ['New', 'Contacted', 'Converted', 'Closed'])) {
        sendError('Invalid status');
    }
    
    $stmt = $con->prepare("UPDATE enquiries SET status=? WHERE id=?");
    $stmt->bind_param("si", $status, $id);
    if ($stmt->execute()) {
        sendSuccess(null, 'Status updated successfully');
    } else {
        sendError('Database error', 500);
    }
} else if ($method === 'POST') {
    // Convert lead to enrolled student
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) sendError('Enquiry ID required');
    
    $stmt = $con->prepare("SELECT * FROM enquiries WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) sendError('Enquiry not found', 404);
    $enquiry = $res->fetch_assoc();
    
    if ($enquiry['status'] === 'Converted') {
        sendError('Enquiry is already converted', 400);
    }
    
    $reg_number = "NITS" . date('Y') . rand(1000, 9999);
    $password = password_hash('123456', PASSWORD_DEFAULT);
    
    $nameParts = explode(' ', $enquiry['name'], 2);
    $fname = $nameParts[0];
    $lname = isset($nameParts[1]) ? $nameParts[1] : '';
    $course = !empty($enquiry['course_interest']) ? $enquiry['course_interest'] : 'Basic Computer';
    $email = !empty($enquiry['email']) ? $enquiry['email'] : 'noemail@example.com';
    
    $insertStmt = $con->prepare("INSERT INTO users (fname, lname, email, contactno, reg_number, password, course) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $insertStmt->bind_param("sssssss", $fname, $lname, $email, $enquiry['phone'], $reg_number, $password, $course);
    
    if ($insertStmt->execute()) {
        $con->query("UPDATE enquiries SET status='Converted' WHERE id=$id");
        sendSuccess(['reg_number' => $reg_number], "Lead converted to student successfully! Reg No: $reg_number, Default Password: 123456");
    } else {
        sendError('Failed to convert student: ' . $con->error, 500);
    }
} else {
    sendError('Method not allowed', 405);
}
?>
