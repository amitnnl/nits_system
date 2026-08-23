<?php
include_once(__DIR__ . '/../config.php');

// Allow authorized student or admin
if (empty($_SESSION['id']) && empty($_SESSION['adminid'])) {
    sendError('Unauthorized', 401);
}

$userid = $_GET['uid'] ?? $_SESSION['id'] ?? null;
if (!$userid) {
    sendError('User ID is required');
}

$type = $_GET['type'] ?? 'basic'; // basic, six, year

$stmt = $con->prepare("SELECT fname, lname, father, reg_number, dob, course, sub_one, sub_two, sub_three, sub_four, sub_five, sub_six, sub_seven, sub_eight, sub_nine, sub_ten FROM users WHERE id=?");
$stmt->bind_param("i", $userid);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    sendError('User not found', 404);
}

$user = $res->fetch_assoc();

// Populate subjects based on results type
$subjects = [];
if ($type === 'six') {
    $subjects = [
        ['name' => 'Computer Fundamentals', 'marks' => (int)($user['sub_one'] ?? 0)],
        ['name' => 'Microsoft Word', 'marks' => (int)($user['sub_two'] ?? 0)],
        ['name' => 'Microsoft Excel', 'marks' => (int)($user['sub_three'] ?? 0)],
        ['name' => 'Microsoft PowerPoint', 'marks' => (int)($user['sub_five'] ?? 0)],
        ['name' => 'Internet Technology', 'marks' => (int)($user['sub_six'] ?? 0)],
        ['name' => 'Financial Accounting', 'marks' => (int)($user['sub_eight'] ?? 0)],
        ['name' => 'Tally with ERP', 'marks' => (int)($user['sub_nine'] ?? 0)],
    ];
} else if ($type === 'year') {
    $subjects = [
        ['name' => 'Computer Fundamentals', 'marks' => (int)($user['sub_one'] ?? 0)],
        ['name' => 'Microsoft Word', 'marks' => (int)($user['sub_two'] ?? 0)],
        ['name' => 'Microsoft Excel', 'marks' => (int)($user['sub_three'] ?? 0)],
        ['name' => 'Microsoft PowerPoint', 'marks' => (int)($user['sub_four'] ?? 0)],
        ['name' => 'Internet Technology', 'marks' => (int)($user['sub_five'] ?? 0)],
        ['name' => 'Financial Accounting', 'marks' => (int)($user['sub_six'] ?? 0)],
        ['name' => 'Tally with ERP', 'marks' => (int)($user['sub_seven'] ?? 0)],
        ['name' => 'HTML with CSS', 'marks' => (int)($user['sub_eight'] ?? 0)],
        ['name' => 'Object Oriented Programming (C, C++)', 'marks' => (int)($user['sub_nine'] ?? 0)],
        ['name' => 'Database SQL, MySQL', 'marks' => (int)($user['sub_ten'] ?? 0)],
    ];
} else { // default: basic (3 months)
    $subjects = [
        ['name' => 'Computer Fundamentals', 'marks' => (int)($user['sub_one'] ?? 0)],
        ['name' => 'Microsoft Word', 'marks' => (int)($user['sub_two'] ?? 0)],
        ['name' => 'Microsoft Excel', 'marks' => (int)($user['sub_three'] ?? 0)],
        ['name' => 'Microsoft PowerPoint', 'marks' => (int)($user['sub_five'] ?? 0)],
        ['name' => 'Internet Technology', 'marks' => (int)($user['sub_six'] ?? 0)],
    ];
}

// Calculate total, percentage, grade
$total = 0;
foreach ($subjects as &$sub) {
    $total += $sub['marks'];
    $sub['grade'] = calculateSubjectGrade($sub['marks']);
}

$max_marks = count($subjects) * 100;
$percentage = $max_marks > 0 ? ($total / $max_marks) * 100 : 0;
$overall_grade = calculateOverallGrade($percentage);

function calculateSubjectGrade($marks) {
    if ($marks >= 90) return 'A+';
    if ($marks >= 80) return 'A';
    if ($marks >= 70) return 'B';
    if ($marks >= 60) return 'C';
    if ($marks >= 50) return 'D';
    if ($marks >= 40) return 'E';
    return 'Fail';
}

function calculateOverallGrade($pct) {
    if ($pct >= 90) return 'A+';
    if ($pct >= 80) return 'A';
    if ($pct >= 70) return 'B';
    if ($pct >= 60) return 'C';
    if ($pct >= 50) return 'D';
    if ($pct >= 40) return 'E';
    return 'Fail';
}

sendSuccess([
    'fname' => $user['fname'],
    'lname' => $user['lname'],
    'father' => $user['father'],
    'reg_number' => $user['reg_number'],
    'dob' => $user['dob'],
    'course' => $user['course'],
    'subjects' => $subjects,
    'total' => $total,
    'max_marks' => $max_marks,
    'percentage' => round($percentage, 2),
    'grade' => $overall_grade
]);
?>
