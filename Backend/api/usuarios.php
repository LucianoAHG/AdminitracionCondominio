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
            $sql = "UPDATE Usuarios SET Nombre = ?, Correo = ?, Telefono = ?, Password = ?, IdRol = ? WHERE Id = ?";
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                $stmt->bind_param("ssssii", $data['Nombre'], $data['Correo'], $data['Telefono'], $hashedPassword, $data['IdRol'], $data['Id']);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
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
                $userId = $data['Id'];
        
                // Validar si el usuario existe antes de intentar eliminarlo
                $checkUser = "SELECT Id FROM Usuarios WHERE Id = ?";
                $stmtCheckUser = $conn->prepare($checkUser);
                if (!$stmtCheckUser) {
                    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de validación.']);
                    exit;
                }
        
                $stmtCheckUser->bind_param("i", $userId);
                $stmtCheckUser->execute();
                $resultCheckUser = $stmtCheckUser->get_result();
        
                if ($resultCheckUser->num_rows === 0) {
                    echo json_encode(['status' => 'error', 'message' => 'El usuario no existe en la base de datos.']);
                    exit;
                }
        
                // Validar dependencias antes de eliminar
                $dependencyCheck = "SELECT COUNT(*) AS count FROM Dependencias WHERE UsuarioId = ?";
                $stmtCheck = $conn->prepare($dependencyCheck);
                $stmtCheck->bind_param("i", $userId);
                $stmtCheck->execute();
                $dependencyResult = $stmtCheck->get_result();
                $dependencyCount = $dependencyResult->fetch_assoc()['count'];
        
                if ($dependencyCount > 0) {
                    echo json_encode(['status' => 'error', 'message' => 'El usuario no se puede eliminar porque tiene dependencias asociadas.']);
                    exit;
                }
        
                // Intentar eliminar el usuario
                $sql = "DELETE FROM Usuarios WHERE Id = ?";
                $stmt = $conn->prepare($sql);
        
                if ($stmt) {
                    $stmt->bind_param("i", $userId);
                    $stmt->execute();
        
                    if ($stmt->affected_rows > 0) {
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
