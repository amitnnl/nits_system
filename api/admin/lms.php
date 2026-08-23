<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'instructor'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

if ($method === 'GET') {
    if ($type === 'courses') {
        $res = mysqli_query($con, "SELECT * FROM courses ORDER BY course_name ASC");
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else if ($type === 'materials') {
        $sql = "SELECT m.*, c.course_name FROM study_materials m JOIN courses c ON m.course_id = c.id ORDER BY m.uploaded_at DESC";
        $res = mysqli_query($con, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }
        sendSuccess($data);
    } else if ($type === 'videos') {
        $sql = "SELECT v.*, c.course_name FROM video_lectures v JOIN courses c ON v.course_id = c.id ORDER BY v.posted_at DESC";
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
    if ($type === 'courses') {
        $input = getJsonInput();
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        $name = trim($input['course_name'] ?? '');
        $desc = trim($input['description'] ?? '');
        $duration = (int)($input['duration_months'] ?? 6);
        $fee = (float)($input['base_fee'] ?? 0);
        
        if (empty($name)) sendError('Course name is required');
        
        if ($id > 0) {
            $stmt = $con->prepare("UPDATE courses SET course_name=?, description=?, duration_months=?, base_fee=? WHERE id=?");
            $stmt->bind_param("ssidi", $name, $desc, $duration, $fee, $id);
            if ($stmt->execute()) {
                sendSuccess(null, 'Course updated successfully');
            } else {
                sendError('Failed to update course: ' . $con->error);
            }
        } else {
            $stmt = $con->prepare("INSERT INTO courses (course_name, description, duration_months, base_fee) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssid", $name, $desc, $duration, $fee);
            if ($stmt->execute()) {
                sendSuccess(null, 'Course added successfully');
            } else {
                sendError('Failed to add course: ' . $con->error);
            }
        }
    } else if ($type === 'videos') {
        $input = getJsonInput();
        $course_id = (int)($input['course_id'] ?? 0);
        $title = trim($input['title'] ?? '');
        $desc = trim($input['description'] ?? '');
        $url = trim($input['video_url'] ?? '');
        
        if ($course_id <= 0 || empty($title) || empty($url)) {
            sendError('Course, title, and URL are required');
        }
        
        $stmt = $con->prepare("INSERT INTO video_lectures (course_id, title, description, video_url) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $course_id, $title, $desc, $url);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Video lecture posted successfully');
        } else {
            sendError('Failed to post video: ' . $con->error);
        }
    } else if ($type === 'materials') {
        // Handle multipart form data
        $course_id = (int)($_POST['course_id'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        
        if ($course_id <= 0 || empty($title)) {
            sendError('Course and title are required');
        }
        
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            sendError('File upload failed or missing');
        }
        
        $file = $_FILES['file'];
        $fileName = time() . '_' . basename($file['name']);
        
        // Ensure path exists relative to htdocs
        $uploadDir = __DIR__ . '/../../uploads/materials/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $dbPath = 'uploads/materials/' . $fileName; // Relative path for DB
            
            $stmt = $con->prepare("INSERT INTO study_materials (course_id, title, description, file_name, file_path) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("issss", $course_id, $title, $desc, $file['name'], $dbPath);
            
            if ($stmt->execute()) {
                sendSuccess(null, 'Study material uploaded successfully');
            } else {
                // Cleanup file if db insert fails
                unlink($targetPath);
                sendError('Database error: ' . $con->error);
            }
        } else {
            sendError('Failed to save uploaded file to disk');
        }
    } else {
        sendError('Invalid type parameter');
    }
} else if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) sendError('ID is required');
    
    if ($type === 'courses') {
        $con->query("DELETE FROM courses WHERE id=$id");
        sendSuccess(null, 'Course deleted');
    } else if ($type === 'videos') {
        $con->query("DELETE FROM video_lectures WHERE id=$id");
        sendSuccess(null, 'Video deleted');
    } else if ($type === 'materials') {
        // Fetch file path to delete from disk
        $res = mysqli_query($con, "SELECT file_path FROM study_materials WHERE id=$id");
        if ($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $path = __DIR__ . '/../../' . $row['file_path'];
            if (file_exists($path)) {
                unlink($path);
            }
            $con->query("DELETE FROM study_materials WHERE id=$id");
            sendSuccess(null, 'Material deleted');
        } else {
            sendError('Material not found');
        }
    } else {
        sendError('Invalid type parameter');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
