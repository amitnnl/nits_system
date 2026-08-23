<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];
$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

// Helper to get student's course_id
function getStudentCourseId($con, $userid) {
    $res = mysqli_query($con, "SELECT course FROM users WHERE id=$userid");
    if ($res->num_rows === 0) return 0;
    $cName = mysqli_real_escape_string($con, $res->fetch_assoc()['course']);
    $cRes = mysqli_query($con, "SELECT id FROM courses WHERE course_name LIKE '%$cName%' LIMIT 1");
    if ($cRes->num_rows > 0) return $cRes->fetch_assoc()['id'];
    return 0;
}

if ($method === 'GET') {
    if ($type === 'available') {
        $course_id = getStudentCourseId($con, $userid);
        if ($course_id === 0) sendSuccess([]);
        
        // Fetch active exams for this course that the student has NOT taken yet
        $sql = "SELECT e.* FROM exams e 
                WHERE e.course_id = $course_id AND e.is_active = 1 
                AND NOT EXISTS (SELECT 1 FROM exam_results r WHERE r.exam_id = e.id AND r.student_id = $userid)
                ORDER BY e.created_at DESC";
        
        $res = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else if ($type === 'questions') {
        $exam_id = (int)($_GET['exam_id'] ?? 0);
        if ($exam_id <= 0) sendError('Exam ID is required');
        
        // Prevent fetching if already taken
        $check = mysqli_query($con, "SELECT id FROM exam_results WHERE exam_id = $exam_id AND student_id = $userid");
        if ($check->num_rows > 0) {
            sendError('You have already submitted this exam.');
        }
        
        // Fetch questions BUT EXCLUDE correct_option
        $sql = "SELECT id, exam_id, question_text, option_a, option_b, option_c, option_d, marks 
                FROM exam_questions WHERE exam_id = $exam_id ORDER BY id ASC";
        $res = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        
        // Fetch exam details for timer
        $eRes = mysqli_query($con, "SELECT title, duration_minutes FROM exams WHERE id = $exam_id");
        $exam_info = $eRes->fetch_assoc();
        
        sendSuccess(['exam' => $exam_info, 'questions' => $data]);
    } else if ($type === 'results') {
        $sql = "SELECT r.*, e.title, e.total_marks 
                FROM exam_results r 
                JOIN exams e ON r.exam_id = e.id 
                WHERE r.student_id = $userid 
                ORDER BY r.submitted_at DESC";
        $res = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else {
        sendError('Invalid type parameter');
    }
} else if ($method === 'POST') {
    if ($type === 'submit') {
        $input = getJsonInput();
        $exam_id = (int)($input['exam_id'] ?? 0);
        $answers = $input['answers'] ?? []; // key-value pair of question_id => chosen_option ('A', 'B', etc)
        
        if ($exam_id <= 0) sendError('Exam ID is required');
        
        // Verify not already taken
        $check = mysqli_query($con, "SELECT id FROM exam_results WHERE exam_id = $exam_id AND student_id = $userid");
        if ($check->num_rows > 0) {
            sendError('You have already submitted this exam.');
        }
        
        // Fetch answer key and exam total marks
        $eRes = mysqli_query($con, "SELECT total_marks FROM exams WHERE id = $exam_id");
        if ($eRes->num_rows === 0) sendError('Exam not found');
        $total_marks = (int)$eRes->fetch_assoc()['total_marks'];
        
        $qRes = mysqli_query($con, "SELECT id, correct_option, marks FROM exam_questions WHERE exam_id = $exam_id");
        
        $score = 0;
        while ($q = mysqli_fetch_assoc($qRes)) {
            $qid = $q['id'];
            if (isset($answers[$qid])) {
                if (strtoupper($answers[$qid]) === strtoupper($q['correct_option'])) {
                    $score += (int)$q['marks'];
                }
            }
        }
        
        // Calculate pass/fail based on 40% threshold
        $passing_score = ceil($total_marks * 0.40);
        $passed = ($score >= $passing_score) ? 1 : 0;
        
        $stmt = $con->prepare("INSERT INTO exam_results (exam_id, student_id, score, passed) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiii", $exam_id, $userid, $score, $passed);
        
        if ($stmt->execute()) {
            sendSuccess([
                'score' => $score,
                'total' => $total_marks,
                'passed' => $passed
            ], 'Exam submitted successfully');
        } else {
            sendError('Failed to save exam results: ' . $con->error);
        }
    } else {
        sendError('Invalid type parameter');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
