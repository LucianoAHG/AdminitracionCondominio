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

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    session_start(); // Iniciar la sesión

    $action = isset($_GET['action']) ? $_GET['action'] : null;
    $userId = $_SESSION['userId'] ?? 0; // Obtener el ID del usuario de la sesión

    if ($userId == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
        exit;
    }

    if ($action === 'fetchUsers') {
        // Obtener lista de usuarios para el modal
        $query = "SELECT Id, Nombre FROM Usuarios";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }

        registrarAuditoria($conn, $userId, 'Consulta de usuarios', 'Se obtuvieron todos los usuarios');
        
        echo json_encode([
            'status' => 'success',
            'data' => $usuarios
        ]);
    } elseif ($action === 'fetch') {
        // Consultar IngresosEgresos con el nombre del usuario
        $query = "SELECT IngresosEgresos.*, Usuarios.Nombre AS UsuarioNombre 
                  FROM IngresosEgresos 
                  LEFT JOIN Usuarios ON IngresosEgresos.IdUsuario = Usuarios.Id";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $registros = [];
        while ($row = $result->fetch_assoc()) {
            $registros[] = $row;
        }

        registrarAuditoria($conn, $userId, 'Consulta de ingresos/egresos', 'Se obtuvieron todos los registros');

        echo json_encode([
            'status' => 'success',
            'data' => $registros
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
    }
} elseif ($method === 'POST') {
    session_start(); // Iniciar la sesión
    
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $_SESSION['userId'] ?? 0; // Obtener el ID del usuario de la sesión

    if ($userId == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
        exit;
    }

    $sql = "INSERT INTO IngresosEgresos (Tipo, Categoria, Descripcion, Monto, Fecha, IdUsuario) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "sssdis",
        $data['Tipo'],
        $data['Categoria'],
        $data['Descripcion'],
        $data['Monto'],
        $data['Fecha'],
        $userId // Usar el ID del usuario de la sesión
    );

    if ($stmt->execute()) {
        registrarAuditoria($conn, $userId, 'Creación de ingreso/egreso', 'Se creó un nuevo registro');
        echo json_encode(['status' => 'success', 'message' => 'Registro creado']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear el registro']);
    }
} elseif ($method === 'DELETE') {
    session_start(); // Iniciar la sesión

    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $userId = $_SESSION['userId'] ?? 0; // Obtener el ID del usuario de la sesión

        if ($userId == 0) {
            echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
            exit;
        }

        $sql = "DELETE FROM IngresosEgresos WHERE Id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            registrarAuditoria($conn, $userId, 'Eliminación de ingreso/egreso', "Se eliminó el registro con ID: $id");
            echo json_encode(['status' => 'success', 'message' => 'Registro eliminado']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el registro']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}

$conn->close();
?>
