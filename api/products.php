<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json"); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to the database
$host = 'localhost'; 
$db = 'user'; // Update with your database name
$user = 'root';
$pass = ''; 

$conn = new mysqli($host, $user, $pass, $db);

// Handle connection errors
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Handle GET request to retrieve products
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT id, title, description, price, url FROM products";
    $result = $conn->query($sql);

    $products = [];

    if ($result->num_rows > 0) {
        // Fetch all products
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }

    // Return the fetched products as JSON
    echo json_encode(["success" => true, "products" => $products]);
    exit(); // Ensure you exit after handling the GET request
}


// Handle POST request to insert a new product
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate the received data
    $title = isset($data['title']) ? $data['title'] : null;
    $description = isset($data['description']) ? $data['description'] : null;
    $price = isset($data['price']) ? $data['price'] : null;
    $url = isset($data['imageUrl']) ? $data['imageUrl'] : null;

    // Prepare SQL query to insert data into products table
    $stmt = $conn->prepare("INSERT INTO products (title, description, price, url) VALUES (?, ?, ?, ?)");

    // Debug: Check if the statement is prepared correctly
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare error: " . $conn->error]);
        exit();
    }

    // Bind parameters and execute
    $stmt->bind_param("ssds", $title, $description, $price, $url);

    // Execute the query and check for success
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Product added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error adding product: " . $stmt->error]);
    }

    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Get the raw body and decode the JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data["id"]) ? $data["id"] : null;

    // Log the received ID for debugging
    error_log("ID received: " . print_r($id, true));

    if ($id !== null && is_numeric($id)) { // Check if ID is not null and is a number
        $id = (int)$id; // Cast ID to an integer
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        
        // Bind parameters and execute
        $stmt->bind_param("i", $id);
        
        // Execute the query and check for success
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Product deleted successfully"]);
        } else {
            error_log("SQL error: " . $stmt->error); // Log SQL error
            echo json_encode(["success" => false, "message" => "Error deleting product: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid product ID"]);
    }
}






// Close connection
$conn->close();
