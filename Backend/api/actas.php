<?php
// Conexión a la base de datos
require_once 'db.php';
header('Content-Type: application/json; charset=utf-8');

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

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Manejo de solicitudes GET
    try {
        $query = "SELECT a.*, 
                         (SELECT GROUP_CONCAT(u.Nombre SEPARATOR ', ') 
                          FROM Usuarios u 
                          WHERE FIND_IN_SET(u.Id, a.Socios)) AS NombresSocios 
                  FROM Actas a";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            echo json_encode([
                "status" => "error",
                "message" => "Error al preparar la consulta: " . $conn->error
            ]);
            exit;
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $actas = [];
        while ($row = $result->fetch_assoc()) {
            $actas[] = [
                'Id' => $row['Id'],
                'Fecha' => $row['Fecha'],
                'Numero' => $row['Numero'],
                'Detalle' => $row['Detalle'],
                'Acuerdo' => $row['Acuerdo'],
                'Invitados' => $row['Invitados'],
                'Socios' => $row['NombresSocios'] ?? 'Sin socios asociados',
            ];
        }

        registrarAuditoria($conn, $userId, 'Consulta de actas', 'Se obtuvieron todos los registros de actas');
        echo json_encode([
            "status" => "success",
            "data" => $actas
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener las actas: " . $e->getMessage()
        ]);
    }
} elseif ($method === 'POST') {
    // Manejo de solicitudes POST
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['Fecha']) && isset($data['Numero']) && isset($data['Detalle']) && isset($data['Acuerdo']) && isset($data['Invitados']) && isset($data['Socios'])) {
            $socios = is_array($data['Socios']) ? implode(',', array_map('intval', $data['Socios'])) : '';

            $query = "INSERT INTO Actas (Fecha, Numero, Detalle, Acuerdo, Invitados, Socios) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al preparar la consulta: " . $conn->error
                ]);
                exit;
            }

            $stmt->bind_param("ssssss", $data['Fecha'], $data['Numero'], $data['Detalle'], $data['Acuerdo'], $data['Invitados'], $socios);

            if ($stmt->execute()) {
                registrarAuditoria($conn, $userId, 'Creación de acta', 'Se creó una nueva acta con ID: ' . $stmt->insert_id);
                echo json_encode([
                    "status" => "success",
                    "message" => "Acta creada exitosamente",
                    "id" => $stmt->insert_id
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al crear el acta: " . $stmt->error
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Todos los campos son obligatorios: Fecha, Numero, Detalle, Acuerdo, Invitados, Socios"
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al procesar la solicitud: " . $e->getMessage()
        ]);
    }
} elseif ($method === 'DELETE') {
    // Manejo de solicitudes DELETE
    try {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);

            $query = "DELETE FROM Actas WHERE Id = ?";
            $stmt = $conn->prepare($query);
            if (!$stmt) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al preparar la consulta: " . $conn->error
                ]);
                exit;
            }

            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    registrarAuditoria($conn, $userId, 'Eliminación de acta', "Se eliminó el acta con ID: $id");
                    echo json_encode([
                        "status" => "success",
                        "message" => "Acta eliminada exitosamente"
                    ]);
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "No se encontró un acta con el ID especificado"
                    ]);
                }
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al eliminar el acta: " . $stmt->error
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "El parámetro 'id' es obligatorio para eliminar un acta"
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al procesar la solicitud: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
}
?>
