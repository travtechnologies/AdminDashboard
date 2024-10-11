<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

// Handle GET request to retrieve blogs
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = "SELECT id, blog_title, author_name, blog_content FROM blog"; // Ensure the table name matches your database
    $result = $conn->query($sql);

    $blogs = [];

    if ($result->num_rows > 0) {
        // Fetch all blogs
        while ($row = $result->fetch_assoc()) {
            $blogs[] = $row;
        }
    }

    // Return the fetched blogs as JSON
    echo json_encode(["success" => true, "blogs" => $blogs]); // Corrected from $blog to $blogs
    exit(); // Ensure you exit after handling the GET request
}


// Handle POST request to insert a new product
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate the received data
    $title = isset($data['title']) ? $data['title'] : null;
    $author = isset($data['author']) ? $data['author'] : null;
    $content = isset($data['content']) ? $data['content'] : null;

    
    // Prepare SQL query to insert data into blog table
    $stmt = $conn->prepare("INSERT INTO blog (blog_title, author_name, blog_content) VALUES (?, ?, ?)");

    // Debug: Check if the statement is prepared correctly
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "SQL prepare error: " . $conn->error]);
        exit();
    }

    // Bind parameters and execute
    $stmt->bind_param("sss", $title, $author, $content);

    // Execute the query and check for success
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Blog added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error adding blog: " . $stmt->error]);
    }

    $stmt->close();
}

// Handle a Delete request
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Get the raw body and decode the JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data["id"]) ? $data["id"] : null;

    // Log the received ID for debugging
    error_log("ID received: " . print_r($id, true));

    if ($id !== null && is_numeric($id)) { // Check if ID is valid
        $id = (int)$id; // Cast ID to an integer
        $stmt = $conn->prepare("DELETE FROM blog WHERE id = ?");

        // Bind parameter and execute
        $stmt->bind_param("i", $id);

        // Execute the query and check for success
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Blog deleted successfully"]);
        } else {
            error_log("SQL error: " . $stmt->error); // Log SQL error
            echo json_encode(["success" => false, "message" => "Error deleting blog: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid product ID"]);
    }
}




// Close connection
$conn->close();
