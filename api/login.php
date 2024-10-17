<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

$host = 'localhost'; 
$db = 'user'; 
$user = 'root';
$pass = ''; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

function verifyJWT($jwt, $secret_key) {
    $parts = explode('.', $jwt);
    
    if (count($parts) !== 3) {
        return ["success" => false, "message" => "Invalid token format."];
    }
    
    list($header, $payload, $signature) = $parts;
    $decodedPayload = json_decode(base64_decode(strtr($payload, '-_', '+_')), true);
    
    if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
        return ["success" => false, "message" => "Token expired."];
    }
    
    $expectedSignature = hash_hmac('sha256', "$header.$payload", $secret_key, true);
    if (!hash_equals(base64UrlEncode($expectedSignature), $signature)) {
        return ["success" => false, "message" => "Invalid token signature."];
    }
    
    return ["success" => true, "data" => $decodedPayload];
}

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_COOKIE['token'])) {
        $token = $_COOKIE['token'];
        $secret_key = "travTechnologies";
        $verificationResult = verifyJWT($token, $secret_key);
        
        if ($verificationResult['success']) {
            $userRole = $verificationResult['data']['role'];
            echo json_encode([
                "success" => true, 
                "message" => "GET request successful", 
                "role" => $userRole
            ]);
        } else {
            echo json_encode(["success" => false, "message" => $verificationResult['message']]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No token provided."]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $secret_key = "travTechnologies";
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || empty($data->email) || empty($data->password)) {
        echo json_encode(["success" => false, "message" => "Invalid input data."]);
        exit();
    }

    $email = $data->email;
    $password = $data->password;

    $sql = "SELECT roles.role_name FROM roles JOIN multiusers ON roles.id = multiusers.role_id WHERE multiusers.email = ? AND multiusers.password = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        exit();
    }
    
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $user_role = $user['role_name'];
    
        // Define expiration time based on role
        if ($user_role == 'admin') {
            $expirationTime = time() + 3600 * 24; // 1 day
        } elseif ($user_role == 'editor') {
            $expirationTime = time() + 3600 * 24 * 7; // 7 days
        } else {
            $expirationTime = time() + 3600 * 24 * 14; // 14 days for viewer
        }
    
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload = json_encode([
            'email' => $email,
            'role' => $user_role,
            'iat' => time(),
            'exp' => $expirationTime
        ]);
    
        $base64UrlHeader = base64UrlEncode($header);
        $base64UrlPayload = base64UrlEncode($payload);
        $signature = hash_hmac('sha256', "$base64UrlHeader.$base64UrlPayload", $secret_key, true);
        $base64UrlSignature = base64UrlEncode($signature);
        $jwt = "$base64UrlHeader.$base64UrlPayload.$base64UrlSignature";
    
        setcookie('token', $jwt, $expirationTime, "/", "", false, true);
        echo json_encode(["success" => true, "message" => "Login successful!", "userRole" => $user_role]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    }
}

if (isset($stmt)) {
    $stmt->close();
}
$conn->close();
?>
