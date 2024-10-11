<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json"); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Capture POST data and validate it
$data = json_decode(file_get_contents("php://input"));
if (!$data || empty($data->email) || empty($data->password)) {
    echo json_encode(["success" => false, "message" => "Invalid input data."]);
    exit();
}

$email = $data->email;
$password = $data->password;

// Connect to the database
$host = 'localhost'; 
$db = 'user'; 
$user = 'root';
$pass = ''; 

$conn = new mysqli($host, $user, $pass, $db);

// Handle connection errors
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT * FROM login WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    exit();
}

$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => true, "message" => "Login successful!"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>
