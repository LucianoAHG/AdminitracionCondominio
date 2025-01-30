<?php
require_once 'db.php';

header('Content-Type: application/json');

// Función para registrar auditoría
function registrarAuditoria($conn, $idUsuario, $accion, $detalle) {
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');
    
    $query = "INSERT INTO Auditoria (IdUsuario, Accion, Detalle, Fecha, Hora) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de auditoría: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("issss", $idUsuario, $accion, $detalle, $fecha, $hora);
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta de auditoría: ' . $stmt->error]);
    }
    $stmt->close();
}

if (isset($_GET['action']) && $_GET['action'] === 'login') {
    session_start(); // Iniciar la sesión

    $input = json_decode(file_get_contents('php://input'), true);
    $correo = $input['Correo'] ?? '';
    $password = $input['Password'] ?? '';

    // Validación de campos vacíos
    if (empty($correo) || empty($password)) {
        registrarAuditoria($conn, 0, 'Intento fallido de inicio de sesión', "Campos vacíos: Correo o contraseña no proporcionados.");
        echo json_encode(['status' => 'error', 'message' => 'Correo y contraseña son obligatorios.']);
        exit;
    }

    // Consulta SQL para obtener el usuario con su rol
    $query = "
        SELECT Usuarios.Id, Usuarios.Nombre, Usuarios.Password, Roles.Nombre AS Rol
        FROM Usuarios
        INNER JOIN Roles ON Usuarios.IdRol = Roles.Id
        WHERE Usuarios.Correo = ?
    ";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('s', $correo);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Validar la contraseña usando password_verify
            if (password_verify($password, $user['Password'])) {
                // Registrar éxito de inicio de sesión en auditoría
                registrarAuditoria($conn, $user['Id'], 'Inicio de sesión exitoso', 'El usuario inició sesión correctamente.');

                // Guardar el ID del usuario en la sesión
                $_SESSION['userId'] = $user['Id'];

                echo json_encode([
                    'status' => 'success',
                    'data' => [
                        'Id' => $user['Id'],
                        'Nombre' => $user['Nombre'],
                        'Rol' => $user['Rol'], // Nombre del rol
                    ]
                ]);
            } else {
                // Registrar intento fallido de inicio de sesión
                registrarAuditoria($conn, 0, 'Intento fallido de inicio de sesión', "Contraseña incorrecta para el correo: $correo");
                echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta.']);
            }
        } else {
            // Registrar intento de inicio de sesión con correo no registrado
            registrarAuditoria($conn, 0, 'Intento de inicio de sesión fallido', "Correo no encontrado: $correo");
            echo json_encode(['status' => 'error', 'message' => 'Correo no encontrado.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta.']);
    }
    $stmt->close();
    $conn->close();
    exit;
}
?>
