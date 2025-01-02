<?php
// Conexi¨®n a la base de datos
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Verificar el m¨¦todo HTTP
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Manejo de solicitudes GET
    try {
        $query = "SELECT * FROM Actas";
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
                'Invitados' => $row['Invitados']
            ];
        }

        if (count($actas) > 0) {
            echo json_encode([
                "status" => "success",
                "data" => $actas
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "data" => [],
                "message" => "No hay actas disponibles"
            ]);
        }
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

        if (
            isset($data['Fecha']) &&
            isset($data['Numero']) &&
            isset($data['Detalle']) &&
            isset($data['Acuerdo']) &&
            isset($data['Invitados'])
        ) {
            $query = "INSERT INTO Actas (Fecha, Numero, Detalle, Acuerdo, Invitados) 
                      VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);

            if (!$stmt) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al preparar la consulta: " . $conn->error
                ]);
                exit;
            }

            $stmt->bind_param(
                "sssss",
                $data['Fecha'],
                $data['Numero'],
                $data['Detalle'],
                $data['Acuerdo'],
                $data['Invitados']
            );

            if ($stmt->execute()) {
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
                "message" => "Todos los campos son obligatorios: Fecha, Numero, Detalle, Acuerdo, Invitados"
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
        // Obtener el ID de la acta a eliminar desde la URL
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);

            // Preparar la consulta para eliminar la acta
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

            // Ejecutar la consulta
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode([
                        "status" => "success",
                        "message" => "Acta eliminada exitosamente"
                    ]);
                } else {
                    echo json_encode([
                        "status" => "error",
                        "message" => "No se encontr¨® un acta con el ID especificado"
                    ]);
                }
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al eliminar la acta: " . $stmt->error
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "El par¨¢metro 'id' es obligatorio para eliminar un acta"
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al procesar la solicitud: " . $e->getMessage()
        ]);
    }
} else {
    // Manejo de m¨¦todos no permitidos
    echo json_encode([
        "status" => "error",
        "message" => "M¨¦todo no permitido"
    ]);
}
?>
