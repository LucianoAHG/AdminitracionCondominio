<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Permitir CORS (si es necesario para desarrollo o producción)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    $action = $_GET['action'] ?? ''; // Validar el parámetro 'action'

    if ($action === 'fetch') {
        // Consulta para obtener cuotas con información de usuario
        $query = "SELECT Cuotas.*, Usuarios.Nombre AS UsuarioNombre FROM Cuotas JOIN Usuarios ON Cuotas.IdUsuario = Usuarios.Id";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $cuotas = [];
        while ($row = $result->fetch_assoc()) {
            $cuotas[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $cuotas]);

    } elseif ($action === 'create') {
        // Crear nueva cuota
        $data = json_decode(file_get_contents('php://input'), true);
        $IdUsuario = $data['IdUsuario'] ?? null;
        $Monto = $data['Monto'] ?? null;
        $Estado = $data['Estado'] ?? 'Pendiente';
        $FechaPago = $data['FechaPago'] ?? null;

        if (!$IdUsuario || !$Monto) {
            echo json_encode(['status' => 'error', 'message' => 'IdUsuario y Monto son obligatorios']);
            exit;
        }

        $query = "INSERT INTO Cuotas (IdUsuario, Monto, Estado, FechaPago) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('idss', $IdUsuario, $Monto, $Estado, $FechaPago);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Cuota creada exitosamente']);

    } elseif ($action === 'delete') {
        // Eliminar cuota
        $Id = $_GET['id'] ?? null;
        if (!$Id) {
            echo json_encode(['status' => 'error', 'message' => 'Id es obligatorio']);
            exit;
        }

        $query = "DELETE FROM Cuotas WHERE Id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $Id);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Cuota eliminada exitosamente']);

    } elseif ($action === 'fetchUsers') {
        // Obtener lista de usuarios para el modal
        $query = "SELECT Id, Nombre FROM Usuarios";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }

        // Devolver los usuarios como un objeto JSON
        echo json_encode([
            'status' => 'success',
            'data' => $usuarios
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
?>
