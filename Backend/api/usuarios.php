<?php
header("Content-Type: application/json");

include_once 'db.php';

// Función para registrar auditoría
function registrarAuditoria($conn, $idUsuario, $accion, $detalle) {
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');
    
    $query = "INSERT INTO Auditoria (IdUsuario, Accion, Detalle, Fecha, Hora) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("issss", $idUsuario, $accion, $detalle, $fecha, $hora);
    $stmt->execute();
}

// Iniciar la sesión
session_start();
$userId = $_SESSION['userId'] ?? 0; // Obtener el ID del usuario de la sesión

if ($userId == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
    exit;
}

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
                registrarAuditoria($conn, $userId, 'Consulta de usuarios', 'Se consultaron todos los usuarios');

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
            $rolQuery = "SELECT Id FROM Roles WHERE Id = ?";
            $stmtRol = $conn->prepare($rolQuery);
            $stmtRol->bind_param("i", $data['IdRol']);
            $stmtRol->execute();
            $rolResult = $stmtRol->get_result();

            if ($rolResult->num_rows === 0) {
                echo json_encode(['status' => 'error', 'message' => 'El rol especificado no existe']);
                exit;
            }

            $hashedPassword = password_hash($data['Password'], PASSWORD_DEFAULT);
            $sql = "INSERT INTO Usuarios (Nombre, Correo, Telefono, Password, IdRol) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssi", $data['Nombre'], $data['Correo'], $data['Telefono'], $hashedPassword, $data['IdRol']);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    registrarAuditoria($conn, $userId, 'Creación de usuario', "Se creó un usuario con nombre: {$data['Nombre']}");
                    echo json_encode(['status' => 'success', 'message' => 'Usuario creado con éxito']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'No se pudo crear el usuario']);
                }
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
            $hashedPassword = password_hash($data['Password'], PASSWORD_DEFAULT);
            $sql = "UPDATE Usuarios SET Nombre = ?, Correo = ?, Telefono = ?, Password = ?, IdRol = ? WHERE Id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssii", $data['Nombre'], $data['Correo'], $data['Telefono'], $hashedPassword, $data['IdRol'], $data['Id']);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    registrarAuditoria($conn, $userId, 'Actualización de usuario', "Se actualizó el usuario con ID: {$data['Id']}");
                    echo json_encode(['status' => 'success', 'message' => 'Usuario actualizado']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'No se pudo actualizar el usuario']);
                }
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
            $userIdToDelete = $data['Id'];

            $sql = "DELETE FROM Usuarios WHERE Id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("i", $userIdToDelete);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    registrarAuditoria($conn, $userId, 'Eliminación de usuario', "Se eliminó el usuario con ID: $userIdToDelete");
                    echo json_encode(['status' => 'success', 'message' => 'Usuario eliminado con éxito.']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'No se pudo eliminar el usuario. Verifique restricciones.']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de eliminación.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ID de usuario no proporcionado.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        break;
}

$conn->close();
?>
