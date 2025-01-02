<?php
header("Content-Type: application/json");

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : null;

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

        // Devolver los usuarios como un objeto JSON
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

        // Devolver los registros como un objeto JSON
        echo json_encode([
            'status' => 'success',
            'data' => $registros
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
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
        $data['IdUsuario']
    );
    $stmt->execute();
    echo json_encode(['status' => 'success', 'message' => 'Registro creado']);
} elseif ($method === 'DELETE') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql = "DELETE FROM IngresosEgresos WHERE Id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Registro eliminado']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}

$conn->close();
?>
