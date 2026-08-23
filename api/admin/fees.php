<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['adminid']) || !in_array($_SESSION['role'], ['admin', 'receptionist'])) {
    sendError('Unauthorized', 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // If student_id is provided, get their specific fee ledgers and payments
    if (isset($_GET['student_id'])) {
        $student_id = (int)$_GET['student_id'];
        
        $sql = "SELECT * FROM fees WHERE student_id = $student_id ORDER BY created_at DESC";
        $res = mysqli_query($con, $sql);
        $fees = [];
        while ($row = mysqli_fetch_assoc($res)) {
            // Get payments for this fee
            $fee_id = $row['id'];
            $pay_sql = "SELECT * FROM fee_payments WHERE fee_id = $fee_id ORDER BY payment_date DESC";
            $pay_res = mysqli_query($con, $pay_sql);
            $payments = [];
            $total_paid = 0;
            while ($p = mysqli_fetch_assoc($pay_res)) {
                $payments[] = $p;
                $total_paid += (float)$p['amount_paid'];
            }
            $row['payments'] = $payments;
            $row['total_paid'] = $total_paid;
            $row['balance'] = (float)$row['total_fee'] - $total_paid;
            $fees[] = $row;
        }
        sendSuccess($fees);
    } else {
        // Overview of all students with unpaid/partial fees
        $sql = "SELECT f.*, u.fname, u.lname, u.reg_number 
                FROM fees f 
                JOIN users u ON f.student_id = u.id 
                ORDER BY f.created_at DESC";
        $res = mysqli_query($con, $sql);
        $fees = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $fee_id = $row['id'];
            $pay_res = mysqli_query($con, "SELECT SUM(amount_paid) as total_paid FROM fee_payments WHERE fee_id = $fee_id");
            $paid = $pay_res->fetch_assoc()['total_paid'] ?? 0;
            $row['total_paid'] = (float)$paid;
            $row['balance'] = (float)$row['total_fee'] - (float)$paid;
            $fees[] = $row;
        }
        sendSuccess($fees);
    }
} else if ($method === 'POST') {
    $action = $_GET['action'] ?? '';
    $input = getJsonInput();
    
    if ($action === 'assign_fee') {
        $student_id = (int)($input['student_id'] ?? 0);
        $course_name = $input['course_name'] ?? '';
        $total_fee = (float)($input['total_fee'] ?? 0);
        $due_date = $input['due_date'] ?? null;
        
        if ($student_id <= 0 || empty($course_name) || $total_fee <= 0) {
            sendError('Student, Course, and Total Fee are required.');
        }
        
        $stmt = $con->prepare("INSERT INTO fees (student_id, course_name, total_fee, due_date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isds", $student_id, $course_name, $total_fee, $due_date);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Fee assigned successfully.');
        } else {
            sendError('Failed to assign fee.');
        }
        
    } else if ($action === 'record_payment') {
        $fee_id = (int)($input['fee_id'] ?? 0);
        $amount = (float)($input['amount_paid'] ?? 0);
        $method = $input['payment_method'] ?? 'Cash';
        $transaction_id = $input['transaction_id'] ?? '';
        $payment_date = date('Y-m-d');
        
        if ($fee_id <= 0 || $amount <= 0) {
            sendError('Fee ID and valid amount are required.');
        }
        
        // Record payment
        $stmt = $con->prepare("INSERT INTO fee_payments (fee_id, amount_paid, payment_date, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("idsss", $fee_id, $amount, $payment_date, $method, $transaction_id);
        
        if ($stmt->execute()) {
            // Update fee status
            $fee_res = mysqli_query($con, "SELECT total_fee FROM fees WHERE id=$fee_id");
            $total_fee = (float)$fee_res->fetch_assoc()['total_fee'];
            
            $pay_res = mysqli_query($con, "SELECT SUM(amount_paid) as total_paid FROM fee_payments WHERE fee_id=$fee_id");
            $total_paid = (float)$pay_res->fetch_assoc()['total_paid'];
            
            $new_status = ($total_paid >= $total_fee) ? 'Paid' : 'Partial';
            $con->query("UPDATE fees SET status='$new_status' WHERE id=$fee_id");
            
            sendSuccess(null, 'Payment recorded successfully.');
        } else {
            sendError('Failed to record payment.');
        }
    } else {
        sendError('Invalid action parameter.');
    }
} else {
    sendError('Method not allowed', 405);
}
?>
