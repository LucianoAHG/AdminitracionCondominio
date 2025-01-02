<?php
// Configuraci車n de la conexi車n a la base de datos
$host = 'localhost'; // Omitir el puerto si no es necesario
$port = '3306';
$user = 'user_admin';
$password = 'uAhWD!~07MKB';
$database = 'SistemaAuditoria';

// Crear conexi車n
$conn = new mysqli("$host:$port", $user, $password, $database);

// Verificar la conexi車n
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Error de conexi車n a la base de datos: " . $conn->connect_error
    ]));
}

// Configurar el conjunto de caracteres
if (!$conn->set_charset("utf8mb4")) {
    die(json_encode([
        "status" => "error",
        "message" => "Error configurando el conjunto de caracteres: " . $conn->error
    ]));
}
?>
