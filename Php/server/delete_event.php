<?php

    require('./connector.php');

    session_start();
    if(!$_SESSION["username"])
    {
        $response['msg'] = 'Sesión caducada';
        echo json_encode($response);
        return;
    }

    $response['msg'] = 'OK';
    $conn = new MySqlConnector();
    if (!$conn->initConnection())
    {
        $response['msg'] = 'Error al conectar con la base de datos';
        echo json_encode($response);
        return;
    }

    $condition = 'id='.$_POST['id'];
    $conn->delete('events', $condition);

    $conn->closeConnection();

    echo json_encode($response);
 ?>
