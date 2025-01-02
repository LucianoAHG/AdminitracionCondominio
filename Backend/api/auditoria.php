<?php
header("Content-Type: application/json");

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM Auditoria";
        $result = $conn->query($sql);
        $auditorias = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($auditorias);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $sql = "INSERT INTO Auditoria (IdUsuario, Accion, Fecha, Hora) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isss", $data['IdUsuario'], $data['Accion'], $data['Fecha'], $data['Hora']);
        $stmt->execute();
        echo json_encode(['message' => 'Registro de auditoría creado']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
$conn->close();
?>
