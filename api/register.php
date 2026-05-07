<?php
// 1. Include Master Connection
require_once 'db_conn.php'; 

// 2. Force the server to always respond with JSON, even if it breaks
header('Content-Type: application/json');

try {
    // 3. Read input
    $input = file_get_contents("php://input");
    $data = json_decode($input);

    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON received by server."]);
        exit;
    }

    // 4. Validate fields
    if(isset($data->name) && isset($data->email) && isset($data->password)) {
        
        $name = trim($data->name);
        $email = trim($data->email);
        $password = $data->password;
        $role = isset($data->role) ? $data->role : 'customer';

        // 5. Check if email exists
        $check_sql = "SELECT * FROM users WHERE email = ?";
        $check_stmt = $conn->prepare($check_sql);
        
        // Safety Check: If the SQL query fails (e.g., wrong table name)
        if (!$check_stmt) {
             throw new Exception("Database check failed: " . $conn->error);
        }
        
        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $check_stmt->store_result();

        if ($check_stmt->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email is already registered."]);
            $check_stmt->close();
            exit;
        }
        $check_stmt->close();

        // 6. Insert new user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $insert_sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        
        // Safety Check: If the Insert SQL fails (e.g., missing column)
        if (!$insert_stmt) {
             throw new Exception("Database insert failed: " . $conn->error);
        }

        $insert_stmt->bind_param("ssss", $name, $email, $hashed_password, $role);

        if ($insert_stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Registration successful!"]);
        } else {
            throw new Exception("Failed to save user: " . $insert_stmt->error);
        }
        
        $insert_stmt->close();

    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
    }

} catch (Exception $e) {
    // 7. THE MAGIC TRICK: Catch the PHP crash and format it as JSON
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server Error: " . $e->getMessage()
    ]);
}
?>