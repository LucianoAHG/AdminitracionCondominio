<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Permitir CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Función para registrar auditoría
function registrarAuditoria($conn, $idUsuario, $accion, $detalle) {
    $fecha = date('Y-m-d');
    $hora = date('H:i:s');
    
    $query = "INSERT INTO Auditoria (IdUsuario, Accion, Detalle, Fecha, Hora) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("issss", $idUsuario, $accion, $detalle, $fecha, $hora);
    $stmt->execute();
}

try {
    $action = $_GET['action'] ?? '';
    
    // Obtener el ID del usuario desde la sesión (supone que estás usando sesiones para manejar la autenticación)
    session_start();
    $userId = $_SESSION['userId'] ?? 0; // Ajusta según cómo manejes la sesión

    if ($userId == 0) {
        echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
        exit;
    }

    if ($action === 'fetch') {
        $query = "SELECT Cuotas.*, Usuarios.Nombre AS UsuarioNombre FROM Cuotas JOIN Usuarios ON Cuotas.IdUsuario = Usuarios.Id";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $cuotas = [];
        while ($row = $result->fetch_assoc()) {
            $cuotas[] = $row;
        }

        registrarAuditoria($conn, $userId, 'Consulta de cuotas', 'Se obtuvieron todas las cuotas');
        echo json_encode(['status' => 'success', 'data' => $cuotas]);

    } elseif ($action === 'delete') {
        $Id = $_GET['id'] ?? null;

        if (!$Id) {
            echo json_encode(['status' => 'error', 'message' => 'El parámetro Id es obligatorio']);
            exit;
        }

        $query = "DELETE FROM Cuotas WHERE Id = ?";
        $stmt = $conn->prepare($query);

        if (!$stmt) {
            echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta']);
            exit;
        }

        $stmt->bind_param('i', $Id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            registrarAuditoria($conn, $userId, 'Eliminación de cuota', "Se eliminó la cuota con ID: $Id");
            echo json_encode(['status' => 'success', 'message' => 'Cuota eliminada exitosamente']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se encontró una cuota con el ID especificado']);
        }

    } elseif ($action === 'update') {
        // Actualizar cuota
        $data = json_decode(file_get_contents('php://input'), true);
        $Id = $data['Id'] ?? null;
        $IdUsuarios = $data['IdUsuarios'] ?? [];
        $Monto = $data['Monto'] ?? null;
        $Estado = $data['Estado'] ?? null;
        $FechaPago = $data['FechaPago'] ?? null;

        if (!$Id || empty($IdUsuarios) || !$Monto || !$Estado) {
            echo json_encode(['status' => 'error', 'message' => 'Id, IdUsuarios, Monto y Estado son obligatorios']);
            exit;
        }

        // Actualizar cuota
        $query = "UPDATE Cuotas SET IdUsuario = ?, Monto = ?, Estado = ?, FechaPago = ? WHERE Id = ?";
        $stmt = $conn->prepare($query);

        foreach ($IdUsuarios as $IdUsuario) {
            $stmt->bind_param('isssi', $IdUsuario, $Monto, $Estado, $FechaPago, $Id);
            $stmt->execute();
        }

        registrarAuditoria($conn, $userId, 'Actualización de cuota', "Se actualizó la cuota con ID: $Id");
        echo json_encode(['status' => 'success', 'message' => 'Cuota actualizada exitosamente']);

    } elseif ($action === 'updateFechaPago') {
        $Id = $_GET['id'] ?? null;
        $FechaPago = $_GET['fechaPago'] ?? null;

        if (!$Id || !$FechaPago) {
            echo json_encode(['status' => 'error', 'message' => 'Id y FechaPago son obligatorios']);
            exit;
        }

        $queryCheck = "SELECT Estado FROM Cuotas WHERE Id = ?";
        $stmtCheck = $conn->prepare($queryCheck);
        $stmtCheck->bind_param('i', $Id);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();
        $row = $resultCheck->fetch_assoc();

        if ($row['Estado'] !== 'Pagada') {
            echo json_encode(['status' => 'error', 'message' => 'Solo se puede actualizar la fecha si el estado es Pagada']);
            exit;
        }

        $query = "UPDATE Cuotas SET FechaPago = ? WHERE Id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('si', $FechaPago, $Id);
        $stmt->execute();

        registrarAuditoria($conn, $userId, 'Actualización de fecha de pago', "Se actualizó la fecha de pago de la cuota con ID: $Id");
        echo json_encode(['status' => 'success', 'message' => 'Fecha de pago actualizada exitosamente']);

    } elseif ($action === 'updateEstado') {
        $Id = $_GET['id'] ?? null;
        $Estado = $_GET['estado'] ?? null;

        if (!$Id || !$Estado) {
            echo json_encode(['status' => 'error', 'message' => 'Id y Estado son obligatorios']);
            exit;
        }

        $query = "UPDATE Cuotas SET Estado = ? WHERE Id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('si', $Estado, $Id);
        $stmt->execute();

        registrarAuditoria($conn, $userId, 'Actualización de estado de cuota', "Se actualizó el estado de la cuota con ID: $Id");
        echo json_encode(['status' => 'success', 'message' => 'Estado de la cuota actualizado exitosamente']);

    } elseif ($action === 'create') {
        $data = json_decode(file_get_contents('php://input'), true);
        $IdUsuarios = $data['IdUsuarios'] ?? [];
        $Monto = $data['Monto'] ?? null;
        $Estado = $data['Estado'] ?? 'Pendiente';
        $FechaPago = $data['FechaPago'] ?? null;

        if (empty($IdUsuarios) || !$Monto) {
            echo json_encode(['status' => 'error', 'message' => 'IdUsuarios y Monto son obligatorios']);
            exit;
        }

        $query = "INSERT INTO Cuotas (IdUsuario, Monto, Estado, FechaPago) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);

        foreach ($IdUsuarios as $IdUsuario) {
            $stmt->bind_param('iiss', $IdUsuario, $Monto, $Estado, $FechaPago);
            $stmt->execute();
            registrarAuditoria($conn, $userId, 'Creación de cuota', "Se creó una cuota para el usuario con ID: $IdUsuario");
        }

        echo json_encode(['status' => 'success', 'message' => 'Cuotas creadas exitosamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
?>
