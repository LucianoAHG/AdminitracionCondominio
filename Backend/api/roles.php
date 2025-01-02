<?php
header("Content-Type: application/json");

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM Roles";
        $result = $conn->query($sql);
        $roles = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($roles);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $sql = "INSERT INTO Roles (Nombre) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $data['Nombre']);
        $stmt->execute();
        echo json_encode(['message' => 'Rol creado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
$conn->close();
?>
