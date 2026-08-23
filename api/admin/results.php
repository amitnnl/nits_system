<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'instructor'])) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = getJsonInput();
$userid = isset($input['uid']) ? (int)$input['uid'] : 0;
$type = $input['type'] ?? 'basic'; // basic, six, year
$marks = $input['marks'] ?? [];

if ($userid <= 0) {
    sendError('User ID is required');
}

$total = 0;
if ($type === 'year') {
    $sub_one   = (int)($marks['sub_one'] ?? 0);
    $sub_two   = (int)($marks['sub_two'] ?? 0);
    $sub_three = (int)($marks['sub_three'] ?? 0);
    $sub_four  = (int)($marks['sub_four'] ?? 0);
    $sub_five  = (int)($marks['sub_five'] ?? 0);
    $sub_six   = (int)($marks['sub_six'] ?? 0);
    $sub_seven = (int)($marks['sub_seven'] ?? 0);
    $sub_eight = (int)($marks['sub_eight'] ?? 0);
    $sub_nine  = (int)($marks['sub_nine'] ?? 0);
    $sub_ten   = (int)($marks['sub_ten'] ?? 0);
    
    $total = $sub_one + $sub_two + $sub_three + $sub_four + $sub_five + $sub_six + $sub_seven + $sub_eight + $sub_nine + $sub_ten;
    $max_marks = 1000;
    
    $stmt = $con->prepare("UPDATE users SET sub_one=?, sub_two=?, sub_three=?, sub_four=?, sub_five=?, sub_six=?, sub_seven=?, sub_eight=?, sub_nine=?, sub_ten=?, max_marks=?, total=? WHERE id=?");
    $stmt->bind_param("iiiiiiiiiiiii", $sub_one, $sub_two, $sub_three, $sub_four, $sub_five, $sub_six, $sub_seven, $sub_eight, $sub_nine, $sub_ten, $max_marks, $total, $userid);
} else if ($type === 'six') {
    $sub_one   = (int)($marks['sub_one'] ?? 0);
    $sub_two   = (int)($marks['sub_two'] ?? 0);
    $sub_three = (int)($marks['sub_three'] ?? 0);
    $sub_five  = (int)($marks['sub_five'] ?? 0);
    $sub_six   = (int)($marks['sub_six'] ?? 0);
    $sub_eight = (int)($marks['sub_eight'] ?? 0);
    $sub_nine  = (int)($marks['sub_nine'] ?? 0);
    
    $total = $sub_one + $sub_two + $sub_three + $sub_five + $sub_six + $sub_eight + $sub_nine;
    $max_marks = 700;
    
    $stmt = $con->prepare("UPDATE users SET sub_one=?, sub_two=?, sub_three=?, sub_five=?, sub_six=?, sub_eight=?, sub_nine=?, max_marks=?, total=? WHERE id=?");
    $stmt->bind_param("iiiiiiiiii", $sub_one, $sub_two, $sub_three, $sub_five, $sub_six, $sub_eight, $sub_nine, $max_marks, $total, $userid);
} else { // default: basic (3 months)
    $sub_one   = (int)($marks['sub_one'] ?? 0);
    $sub_two   = (int)($marks['sub_two'] ?? 0);
    $sub_three = (int)($marks['sub_three'] ?? 0);
    $sub_five  = (int)($marks['sub_five'] ?? 0);
    $sub_six   = (int)($marks['sub_six'] ?? 0);
    
    $total = $sub_one + $sub_two + $sub_three + $sub_five + $sub_six;
    $max_marks = 500;
    
    $stmt = $con->prepare("UPDATE users SET sub_one=?, sub_two=?, sub_three=?, sub_five=?, sub_six=?, max_marks=?, total=? WHERE id=?");
    $stmt->bind_param("iiiiiiii", $sub_one, $sub_two, $sub_three, $sub_five, $sub_six, $max_marks, $total, $userid);
}

if ($stmt->execute()) {
    sendSuccess(null, 'Marks updated successfully');
} else {
    sendError('Database error: ' . $con->error);
}
?>
