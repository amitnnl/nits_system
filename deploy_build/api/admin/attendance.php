<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'instructor'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all students and their attendance for a specific date
    $date = $_GET['date'] ?? date('Y-m-d');
    $dateEsc = mysqli_real_escape_string($con, $date);
    
    // We want a list of ALL students, joined with their attendance record for the date (if any)
    $sql = "SELECT u.id as student_id, u.fname, u.lname, u.reg_number, u.course, 
            a.id as attendance_id, a.status, a.remarks 
            FROM users u 
            LEFT JOIN attendance a ON u.id = a.student_id AND a.date = '$dateEsc'
            ORDER BY u.fname ASC";
            
    $res = mysqli_query($con, $sql);
    $records = [];
    while ($row = mysqli_fetch_assoc($res)) {
        // If no attendance record exists for this date, default to 'Present' (or empty, but UI usually defaults to Present)
        if (empty($row['status'])) {
            $row['status'] = 'Present'; // Default for the UI
        }
        $records[] = $row;
    }
    
    sendSuccess(['date' => $date, 'records' => $records]);
    
} else if ($method === 'POST') {
    // Save batch attendance
    $input = getJsonInput();
    $date = $input['date'] ?? date('Y-m-d');
    $records = $input['records'] ?? [];
    
    if (empty($records)) {
        sendError('No attendance data provided.');
    }
    
    $con->begin_transaction();
    
    try {
        $stmt = $con->prepare("INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status=VALUES(status), remarks=VALUES(remarks)");
        
        foreach ($records as $rec) {
            $sid = (int)$rec['student_id'];
            $status = $rec['status'] ?? 'Present';
            $remarks = $rec['remarks'] ?? '';
            $stmt->bind_param("isss", $sid, $date, $status, $remarks);
            $stmt->execute();
        }
        
        $con->commit();
        sendSuccess(null, 'Attendance saved successfully.');
    } catch (Exception $e) {
        $con->rollback();
        sendError('Failed to save attendance: ' . $e->getMessage(), 500);
    }
    
} else {
    sendError('Method not allowed', 405);
}
?>
