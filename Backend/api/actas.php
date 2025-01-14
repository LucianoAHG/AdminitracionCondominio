<?php
// Conexión a la base de datos
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Verificar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Manejo de solicitudes GET
    try {
        $query = "
            SELECT a.*, 
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
                'Socios' => $row['NombresSocios'] ?? 'Sin socios asociados', // Mostrar nombres de socios
            ];
        }

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

        if (
            isset($data['Fecha']) &&
            isset($data['Numero']) &&
            isset($data['Detalle']) &&
            isset($data['Acuerdo']) &&
            isset($data['Invitados']) &&
            isset($data['Socios']) // Verificar que el campo Socios esté presente
        ) {
            // Convertir el array de IDs de socios en un string separado por comas
            $socios = is_array($data['Socios']) ? implode(',', array_map('intval', $data['Socios'])) : '';

            // Consulta para insertar los datos en la tabla Actas
            $query = "INSERT INTO Actas (Fecha, Numero, Detalle, Acuerdo, Invitados, Socios) 
                      VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($query);

            if (!$stmt) {
                echo json_encode([
                    "status" => "error",
                    "message" => "Error al preparar la consulta: " . $conn->error
                ]);
                exit;
            }

            $stmt->bind_param(
                "ssssss",
                $data['Fecha'],
                $data['Numero'],
                $data['Detalle'],
                $data['Acuerdo'],
                $data['Invitados'],
                $socios // Guardar los IDs de socios como un string separado por comas
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
