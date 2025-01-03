<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Permitir CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    $action = $_GET['action'] ?? '';

    if ($action === 'fetch') {
        // Obtener cuotas con información de usuario
        $query = "SELECT Cuotas.*, Usuarios.Nombre AS UsuarioNombre FROM Cuotas JOIN Usuarios ON Cuotas.IdUsuario = Usuarios.Id";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $cuotas = [];
        while ($row = $result->fetch_assoc()) {
            $cuotas[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $cuotas]);

    } elseif ($action === 'updateFechaPago') {
        // Actualizar fecha de pago
        $Id = $_GET['id'] ?? null;
        $FechaPago = $_GET['fechaPago'] ?? null;

        if (!$Id || !$FechaPago) {
            echo json_encode(['status' => 'error', 'message' => 'Id y FechaPago son obligatorios']);
            exit;
        }

        // Verificar el estado antes de actualizar la fecha
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

        echo json_encode(['status' => 'success', 'message' => 'Fecha de pago actualizada exitosamente']);

    } elseif ($action === 'updateEstado') {
        // Actualizar estado de la cuota
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

        echo json_encode(['status' => 'success', 'message' => 'Estado de la cuota actualizado exitosamente']);

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
?>
