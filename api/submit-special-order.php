<?php
require_once 'db_conn.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

if (isset($data->description) && isset($data->quantity)) {
    $user_id = $_SESSION['user_id'];
    $desc = $conn->real_escape_string($data->description);
    $qty = (int)$data->quantity;

    $sql = "INSERT INTO special_orders (user_id, product_description, quantity) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $user_id, $desc, $qty);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Request submitted!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing information']);
}
?>