<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];
$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

if ($method === 'GET') {
    // Get student's enrolled course name from users table
    $res = mysqli_query($con, "SELECT course FROM users WHERE id=$userid");
    if ($res->num_rows === 0) sendError('Student not found');
    $studentCourseName = $res->fetch_assoc()['course'];
    
    // Find course ID in courses table
    $courseNameEsc = mysqli_real_escape_string($con, $studentCourseName);
    $cRes = mysqli_query($con, "SELECT id FROM courses WHERE course_name LIKE '%$courseNameEsc%' LIMIT 1");
    
    $course_id = 0;
    if ($cRes->num_rows > 0) {
        $course_id = $cRes->fetch_assoc()['id'];
    }
    
    if ($type === 'materials') {
        if ($course_id === 0) sendSuccess([]); // No matching course found, return empty array
        
        $sql = "SELECT * FROM study_materials WHERE course_id = $course_id ORDER BY uploaded_at DESC";
        $mRes = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($mRes)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else if ($type === 'videos') {
        if ($course_id === 0) sendSuccess([]); 
        
        $sql = "SELECT * FROM video_lectures WHERE course_id = $course_id ORDER BY posted_at DESC";
        $vRes = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($vRes)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else {
        sendError('Invalid type parameter');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
