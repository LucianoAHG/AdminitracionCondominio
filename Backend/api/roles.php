<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Permitir CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    // Consultar los roles
    $query = "SELECT Id, Nombre FROM Roles";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception('Error al ejecutar la consulta: ' . $stmt->error);
    }

    $roles = [];
    while ($row = $result->fetch_assoc()) {
        $roles[] = [
            'Id' => $row['Id'],
            'Nombre' => $row['Nombre']
        ];
    }

    // Responder con los roles en formato JSON
    echo json_encode([
        'status' => 'success',
        'data' => $roles
    ]);
} catch (Exception $e) {
    // Capturar y devolver errores
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al obtener roles: ' . $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
