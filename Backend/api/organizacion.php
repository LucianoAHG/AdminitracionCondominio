<?php
header("Content-Type: application/json");

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Consulta para obtener los miembros con los roles especificados
        $sql = "SELECT 
                    o.Id AS IdOrganizacion, 
                    u.Nombre AS NombreUsuario, 
                    u.Correo AS Contacto, 
                    u.Telefono AS Telefono, 
                    r.Nombre AS Rol
                FROM Organizacion o
                INNER JOIN Usuarios u ON o.IdUsuario = u.Id
                INNER JOIN Roles r ON o.IdRol = r.Id
                WHERE r.Nombre IN ('Presidente', 'Secretario', 'Tesorero', 'Socio')";
        $result = $conn->query($sql);

        $organizaciones = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode([
            'status' => 'success',
            'data' => $organizaciones
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $sql = "INSERT INTO Organizacion (IdUsuario, IdRol) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $data['IdUsuario'], $data['IdRol']);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Organización creada']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        break;
}
$conn->close();
?>
