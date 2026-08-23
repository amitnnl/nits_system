<?php
include_once(__DIR__ . '/../config.php');

if (empty($_SESSION['id']) || ($_SESSION['role'] !== 'student')) {
    sendError('Unauthorized', 401);
}

$userid = $_SESSION['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get summary statistics
    $statsSql = "SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN status = 'Excused' THEN 1 ELSE 0 END) as excused_days
        FROM attendance WHERE student_id = $userid";
        
    $resStats = mysqli_query($con, $statsSql);
    $stats = mysqli_fetch_assoc($resStats);
    
    // Get recent history
    $historySql = "SELECT date, status, remarks FROM attendance WHERE student_id = $userid ORDER BY date DESC LIMIT 30";
    $resHistory = mysqli_query($con, $historySql);
    $history = [];
    while ($row = mysqli_fetch_assoc($resHistory)) {
        $history[] = $row;
    }
    
    sendSuccess([
        'stats' => $stats,
        'history' => $history
    ]);
} else {
    sendError('Method not allowed', 405);
}
?>
