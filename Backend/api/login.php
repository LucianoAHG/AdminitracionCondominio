<?php
require_once 'db.php';

header('Content-Type: application/json');

if (isset($_GET['action']) && $_GET['action'] === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $correo = $input['Correo'] ?? '';
    $password = $input['Password'] ?? '';

    // Validación de campos vacíos
    if (empty($correo) || empty($password)) {
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
                echo json_encode([
                    'status' => 'success',
                    'data' => [
                        'Id' => $user['Id'],
                        'Nombre' => $user['Nombre'],
                        'Rol' => $user['Rol'], // Nombre del rol
                    ]
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Contraseña incorrecta.']);
            }
        } else {
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
