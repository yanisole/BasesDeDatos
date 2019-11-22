<?php

require('./connector.php');

$conn = new MySqlConnector();

session_start();
$_SESSION["username"] = "";
if (!$conn->initConnection())
{
    $response['msg'] = 'Error al conectar con la base de datos';
    echo json_encode($response);
    return;
}

$condition = 'where name="'.$_POST['username'].'"';
$conn->select(['users'], ['*'], $condition);

$exist_user = $conn->select(['users'], ['*'], $condition);
if(!$exist_user){
    $response["msg"] = 'No se pudo comprobar la existencia del usuario: ' . $_POST['username'];
    echo json_encode($response);
    return;
}

if($exist_user->num_rows == 0){
    $response["msg"] = "Usuario no existente";
    echo json_encode($response);    
    return;
}

$row = $exist_user->fetch_assoc();
if(!password_verify($_POST['password'], $row['password']))
    $response["msg"] = "Usuario o contraseña incorrecto";        
else
    $response["msg"] = "OK";

$conn->closeConnection();

$_SESSION["username"] = $_POST['username'];
echo json_encode($response);
?>
