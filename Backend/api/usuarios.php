<?php
header("Content-Type: application/json");

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'fetch') {
            $sql = "SELECT Usuarios.Id, Usuarios.Nombre, Usuarios.Correo, Usuarios.Telefono, Roles.Nombre AS RolNombre 
                    FROM Usuarios 
                    LEFT JOIN Roles ON Usuarios.IdRol = Roles.Id";
            $result = $conn->query($sql);

            if ($result) {
                $usuarios = $result->fetch_all(MYSQLI_ASSOC);
                echo json_encode([
                    'status' => 'success',
                    'data' => $usuarios
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Error al obtener los usuarios'
                ]);
            }
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Acción no válida'
            ]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['Nombre']) && !empty($data['Correo']) && !empty($data['Telefono']) && !empty($data['Password']) && isset($data['IdRol'])) {
            $sql = "INSERT INTO Usuarios (Nombre, Correo, Telefono, Password, IdRol) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssi", $data['Nombre'], $data['Correo'], $data['Telefono'], $data['Password'], $data['IdRol']);
                $stmt->execute();
                echo json_encode(['status' => 'success', 'message' => 'Usuario creado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['Id']) && !empty($data['Nombre']) && !empty($data['Correo']) && !empty($data['Telefono']) && !empty($data['Password']) && isset($data['IdRol'])) {
            $sql = "UPDATE Usuarios SET Nombre = ?, Correo = ?, Telefono = ?, Password = ?, IdRol = ? WHERE Id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssii", $data['Nombre'], $data['Correo'], $data['Telefono'], $data['Password'], $data['IdRol'], $data['Id']);
                $stmt->execute();
                echo json_encode(['status' => 'success', 'message' => 'Usuario actualizado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['Id'])) {
            $sql = "DELETE FROM Usuarios WHERE Id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("i", $data['Id']);
                $stmt->execute();
                echo json_encode(['status' => 'success', 'message' => 'Usuario eliminado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID de usuario no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        break;
}

$conn->close();
?>
