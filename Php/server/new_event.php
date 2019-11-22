<?php
    require('./connector.php');

    session_start();
    $response['msg'] = 'OK';

    $data['title'] = trim($_POST['titulo']);
    if(!empty($_POST['start_date']))
        $data['start_date'] = $_POST['start_date'];
    if(!empty($_POST['start_hour']))
        $data['start_hour'] = $_POST['start_hour'];
    if(!empty($_POST['end_date']))
        $data['end_date'] = $_POST['end_date'];
    if(!empty($_POST['end_hour']))
        $data['end_hour'] = $_POST['end_hour'];
    $data['all_day'] = $_POST['allDay'];
    $data['id_user'] = $_SESSION["username"];

    //Validaciones
    if($data['title'] == ''){
        $response['msg'] = 'Ingrese un titulo para el evento';
        echo json_encode($response);
        return;
    }

    $conn = new MySqlConnector();
    if (!$conn->initConnection())
    {
        $response['msg'] = 'Error al conectar con la base de datos';
        echo json_encode($response);
        return;
    }

    $conn->insert('events', $data);
    $response['id'] = $conn->newId();

    echo json_encode($response);
    return;
    
 ?>
