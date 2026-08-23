<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'instructor'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

if ($method === 'GET') {
    if ($type === 'exams') {
        $sql = "SELECT e.*, c.course_name, 
                (SELECT COUNT(*) FROM exam_questions q WHERE q.exam_id = e.id) as question_count 
                FROM exams e 
                JOIN courses c ON e.course_id = c.id 
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
        
        $sql = "SELECT * FROM exam_questions WHERE exam_id = $exam_id ORDER BY id ASC";
        $res = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else if ($type === 'results') {
        $exam_id = (int)($_GET['exam_id'] ?? 0);
        if ($exam_id <= 0) sendError('Exam ID is required');
        
        $sql = "SELECT r.*, u.fname, u.lname, u.reg_number 
                FROM exam_results r 
                JOIN users u ON r.student_id = u.id 
                WHERE r.exam_id = $exam_id 
                ORDER BY r.score DESC, r.submitted_at DESC";
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
    $input = getJsonInput();
    
    if ($type === 'exams') {
        $course_id = (int)($input['course_id'] ?? 0);
        $title = trim($input['title'] ?? '');
        $desc = trim($input['description'] ?? '');
        $duration = (int)($input['duration_minutes'] ?? 30);
        $total_marks = (int)($input['total_marks'] ?? 100);
        
        if ($course_id <= 0 || empty($title) || $duration <= 0) {
            sendError('Course, title, and duration are required');
        }
        
        $stmt = $con->prepare("INSERT INTO exams (course_id, title, description, duration_minutes, total_marks) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issii", $course_id, $title, $desc, $duration, $total_marks);
        
        if ($stmt->execute()) {
            sendSuccess(['id' => $con->insert_id], 'Exam created successfully');
        } else {
            sendError('Failed to create exam: ' . $con->error);
        }
    } else if ($type === 'questions') {
        $exam_id = (int)($input['exam_id'] ?? 0);
        $q_text = trim($input['question_text'] ?? '');
        $opt_a = trim($input['option_a'] ?? '');
        $opt_b = trim($input['option_b'] ?? '');
        $opt_c = trim($input['option_c'] ?? '');
        $opt_d = trim($input['option_d'] ?? '');
        $correct = trim(strtoupper($input['correct_option'] ?? ''));
        $marks = (int)($input['marks'] ?? 1);
        
        if ($exam_id <= 0 || empty($q_text) || empty($opt_a) || empty($opt_b) || empty($correct)) {
            sendError('Exam ID, question text, options A and B, and correct option are required');
        }
        if (!in_array($correct, ['A', 'B', 'C', 'D'])) {
            sendError('Correct option must be A, B, C, or D');
        }
        
        $stmt = $con->prepare("INSERT INTO exam_questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssssi", $exam_id, $q_text, $opt_a, $opt_b, $opt_c, $opt_d, $correct, $marks);
        
        if ($stmt->execute()) {
            // Auto update total_marks in exams table
            $con->query("UPDATE exams SET total_marks = total_marks + $marks WHERE id = $exam_id");
            sendSuccess(null, 'Question added successfully');
        } else {
            sendError('Failed to add question: ' . $con->error);
        }
    } else {
        sendError('Invalid type parameter');
    }
} else if ($method === 'PUT') {
    if ($type === 'exams') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) sendError('Exam ID is required');
        
        $input = getJsonInput();
        $is_active = (int)($input['is_active'] ?? 0);
        
        $stmt = $con->prepare("UPDATE exams SET is_active = ? WHERE id = ?");
        $stmt->bind_param("ii", $is_active, $id);
        if ($stmt->execute()) {
            sendSuccess(null, 'Exam status updated');
        } else {
            sendError('Failed to update status');
        }
    } else {
        sendError('Invalid type parameter');
    }
} else if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) sendError('ID is required');
    
    if ($type === 'exams') {
        $con->query("DELETE FROM exams WHERE id=$id");
        sendSuccess(null, 'Exam deleted');
    } else if ($type === 'questions') {
        // Fetch marks to deduct from total
        $qRes = mysqli_query($con, "SELECT exam_id, marks FROM exam_questions WHERE id=$id");
        if ($qRes->num_rows > 0) {
            $q = $qRes->fetch_assoc();
            $e_id = $q['exam_id'];
            $marks = (int)$q['marks'];
            $con->query("DELETE FROM exam_questions WHERE id=$id");
            $con->query("UPDATE exams SET total_marks = total_marks - $marks WHERE id = $e_id");
            sendSuccess(null, 'Question deleted');
        } else {
            sendError('Question not found');
        }
    } else {
        sendError('Invalid type parameter');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
