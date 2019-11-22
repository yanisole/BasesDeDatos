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

    if(!empty($_POST['start_date']))
        $data['start_date'] = $_POST['start_date'];
    if(!empty($_POST['start_hour']))
        $data['start_hour'] = $_POST['start_hour'];
    if(!empty($_POST['end_date']))
        $data['end_date'] = $_POST['end_date'];
    if(!empty($_POST['end_hour']))
        $data['end_hour'] = $_POST['end_hour'];
   
    $condition = 'id='.$_POST['id'];
    $conn->update('events', $data, $condition);
 
    $conn->closeConnection();
    
    echo json_encode($response);
 ?>
