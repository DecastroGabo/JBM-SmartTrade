<?php
require_once 'db_conn.php';

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['name'],
            'role' => $_SESSION['role']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'No active session']);
}
?>