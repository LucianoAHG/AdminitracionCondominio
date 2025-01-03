<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

// Permitir CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    // Consultar cuotas
    $queryPagadas = "SELECT COUNT(*) AS cantidad FROM Cuotas WHERE Estado = 'Pagada'";
    $queryPendientes = "SELECT COUNT(*) AS cantidad FROM Cuotas WHERE Estado = 'Pendiente'";

    $stmtPagadas = $conn->prepare($queryPagadas);
    $stmtPagadas->execute();
    $resultPagadas = $stmtPagadas->get_result();
    $cuotasPagadas = $resultPagadas->fetch_assoc();

    $stmtPendientes = $conn->prepare($queryPendientes);
    $stmtPendientes->execute();
    $resultPendientes = $stmtPendientes->get_result();
    $cuotasPendientes = $resultPendientes->fetch_assoc();

    // Consultar últimas 10 actas
    $queryActas = "SELECT Id, Fecha, Numero, Detalle FROM Actas ORDER BY Fecha DESC LIMIT 10";
    $stmtActas = $conn->prepare($queryActas);
    $stmtActas->execute();
    $resultActas = $stmtActas->get_result();
    $actas = [];

    while ($row = $resultActas->fetch_assoc()) {
        $actas[] = [
            'id' => $row['Id'],
            'titulo' => $row['Detalle'], // Usamos "Detalle" como título
            'fecha' => $row['Fecha'],
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'cuotas' => [
                'pagadas' => $cuotasPagadas['cantidad'] ?? 0,
                'pendientes' => $cuotasPendientes['cantidad'] ?? 0,
            ],
            'actas' => $actas,
        ],
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}
?>
