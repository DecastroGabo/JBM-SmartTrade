<?php
require_once 'db_conn.php';

// Only allow Admins to change statuses
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->status)) {
    $id = (int)$data->id;
    $status = $conn->real_escape_string($data->status);
    $type = $data->type; // 'regular' or 'special'

    // Choose the correct table based on the order type
    $table = ($type === 'special') ? 'special_orders' : 'orders';
    
    $sql = "UPDATE $table SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Incomplete data']);
}
?>