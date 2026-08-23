<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM fees WHERE student_id = $userid ORDER BY created_at DESC";
    $res = mysqli_query($con, $sql);
    $fees = [];
    while ($row = mysqli_fetch_assoc($res)) {
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
    sendError('Method not allowed', 405);
}
?>
