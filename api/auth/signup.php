<?php
include_once(__DIR__ . '/../config.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Invalid request method', 405);
}

// Read parameters from $_POST
$fname = trim($_POST['fname'] ?? '');
$lname = trim($_POST['lname'] ?? '');
$father = trim($_POST['father'] ?? '');
$gender = trim($_POST['gender'] ?? '');
$email = trim($_POST['email'] ?? '');
$dob = trim($_POST['dob'] ?? '');
$password = trim($_POST['password'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$course = trim($_POST['course'] ?? '');
$address = trim($_POST['address'] ?? '');
$reg_number = trim($_POST['reg_number'] ?? '');
$posting_date = trim($_POST['posting_date'] ?? '');
$aadhar = trim($_POST['aadhar'] ?? '');

if (empty($email) || empty($password) || empty($fname) || empty($lname) || empty($reg_number)) {
    sendError('Required fields are missing');
}

// Generate registration number
function generateRegistrationNumber() {
    $prefix = 'NITS_';
    $numberLength = 5;
    return $prefix . date('Y_') . str_pad(rand(0, pow(10, $numberLength) - 1), $numberLength, '0', STR_PAD_LEFT);
}

$reg_no = generateRegistrationNumber();

// Check if email already exists
$stmt = $con->prepare("SELECT id FROM users WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows > 0) {
    sendError('Email address already exists with another account. Please try with another email id');
}

// Handle Image Upload
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendError('Please upload a valid image file');
}

$targetDirectory = __DIR__ . '/../../uploads/';
if (!file_exists($targetDirectory)) {
    mkdir($targetDirectory, 0777, true);
}

$filename = time() . '_' . basename($_FILES['image']['name']);
$targetFile = $targetDirectory . $filename;
$dbPath = 'uploads/' . $filename;

$imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
$check = getimagesize($_FILES['image']['tmp_name']);

if ($check === false) {
    sendError('Uploaded file is not a valid image');
}

$allowedFormats = ['jpg', 'jpeg', 'png'];
if (!in_array($imageFileType, $allowedFormats)) {
    sendError('Only JPG, JPEG, and PNG images are allowed.');
}

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    sendError('Failed to save the uploaded image.');
}

// Insert into database
$stmt_insert = $con->prepare("INSERT INTO users(fname, lname, email, password, contactno, dob, image, father, gender, course, address, reg_no, posting_date, reg_number, aadhar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt_insert->bind_param("sssssssssssssss", $fname, $lname, $email, $password, $contact, $dob, $dbPath, $father, $gender, $course, $address, $reg_no, $posting_date, $reg_number, $aadhar);

if ($stmt_insert->execute()) {
    sendSuccess(null, 'Registered successfully');
} else {
    sendError('Database error: ' . $con->error);
}
?>
