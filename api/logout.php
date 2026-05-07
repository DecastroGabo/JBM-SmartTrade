<?php
// 1. Include Master Connection
require_once 'db_conn.php'; 

// 2. Destroy the Session
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>