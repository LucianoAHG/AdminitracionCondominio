<?php
// Conexión a la base de datos
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Iniciar la sesión
session_start();
$userId = $_SESSION['userId'] ?? 0; // Obtener el ID del usuario de la sesión

if ($userId == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado']);
    exit;
}

// Obtener el método HTTP de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Manejo de solicitudes GET: Obtener registros de auditoría
    try {
        $query = "SELECT Id, IdUsuario, Accion, Detalle, Fecha, Hora FROM Auditoria";
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
        $auditorias = [];

        while ($row = $result->fetch_assoc()) {
            $auditorias[] = [
                'Id'        => $row['Id'],
                'IdUsuario' => $row['IdUsuario'],
                'Accion'    => $row['Accion'],
                'Detalle'   => $row['Detalle'],
                'Fecha'     => $row['Fecha'],
                'Hora'      => $row['Hora']
            ];
        }

        echo json_encode([
            "status" => "success",
            "data"   => $auditorias
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "status"  => "error",
            "message" => "Error al obtener los registros de auditoría: " . $e->getMessage()
        ]);
    }
} elseif ($method === 'POST') {
    // Manejo de solicitudes POST: Crear un nuevo registro de auditoría
    try {
        $data = json_decode(file_get_contents("php://input"), true);

        // Validación básica
        if (!isset($data['Accion'])) {
            echo json_encode([
                "status"  => "error",
                "message" => "El campo 'Accion' es obligatorio"
            ]);
            exit;
        }

        $accion = $data['Accion'];

        // Validar campos según el tipo de acción
        if ($accion === 'Login Fallido') {
            if (!isset($data['Detalle'], $data['Fecha'], $data['Hora'])) {
                echo json_encode([
                    "status"  => "error",
                    "message" => "Campos obligatorios faltantes para Login Fallido: Detalle, Fecha, Hora"
                ]);
                exit;
            }
        } else {
            if (!isset($data['IdUsuario'], $data['Detalle'], $data['Fecha'], $data['Hora'])) {
                echo json_encode([
                    "status"  => "error",
                    "message" => "Campos obligatorios faltantes: IdUsuario, Detalle, Fecha, Hora"
                ]);
                exit;
            }
        }

        // Preparar consulta según el tipo de acción
        if ($accion === 'Login Fallido') {
            $query = "INSERT INTO Auditoria (Accion, Detalle, Fecha, Hora) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $params = [
                $data['Accion'],
                $data['Detalle'],
                $data['Fecha'],
                $data['Hora']
            ];
            $types = "ssss";
        } else {
            $query = "INSERT INTO Auditoria (IdUsuario, Accion, Detalle, Fecha, Hora) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);
            $params = [
                $data['IdUsuario'],
                $data['Accion'],
                $data['Detalle'],
                $data['Fecha'],
                $data['Hora']
            ];
            $types = "issss";
        }

        if (!$stmt) {
            echo json_encode([
                "status" => "error",
                "message" => "Error al preparar la consulta: " . $conn->error
            ]);
            exit;
        }

        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Registro de auditoría creado exitosamente",
                "id" => $stmt->insert_id
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Error al crear el registro de auditoría: " . $stmt->error
            ]);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            "status"  => "error",
            "message" => "Error al procesar la solicitud: " . $e->getMessage()
        ]);
    }
} elseif ($method === 'DELETE') {
    // Manejo de solicitudes DELETE: Eliminar un registro de auditoría
    try {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);

            $query = "DELETE FROM Auditoria WHERE Id = ?";
            $stmt = $conn->prepare($query);

            if (!$stmt) {
                echo json_encode([
                    "status"  => "error",
                    "message" => "Error al preparar la consulta: " . $conn->error
                ]);
                exit;
            }

            $stmt->bind_param("i", $id);

            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    registrarAuditoria($conn, $userId, 'Eliminación de registro de auditoría', "Se eliminó el registro de auditoría con ID: $id");
                    echo json_encode([
                        "status"  => "success",
                        "message" => "Registro de auditoría eliminado exitosamente"
                    ]);
                } else {
                    echo json_encode([
                        "status"  => "error",
                        "message" => "No se encontró un registro de auditoría con el ID especificado"
                    ]);
                }
            } else {
                echo json_encode([
                    "status"  => "error",
                    "message" => "Error al eliminar el registro de auditoría: " . $stmt->error
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                "status"  => "error",
                "message" => "El parámetro 'id' es obligatorio para eliminar un registro de auditoría"
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status"  => "error",
            "message" => "Error al procesar la solicitud: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Método no permitido"
    ]);
}
?>
