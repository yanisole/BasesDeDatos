<?php
    require('./connector.php');
   
    session_start();

    if(!$_SESSION["username"])
    {
        $response['msg'] = 'Sesión caducada';
        echo json_encode($response);
        return;
    }

    $conn = new MySqlConnector();

    $response['msg'] = 'OK';    
    $response["eventos"] = [];
    if (!$conn->initConnection())
    {
        $response['msg'] = 'Error al conectar con la base de datos';
        echo json_encode($response);
        return;
    }

    //Busco los eventos asociados al usuario
    $condition = 'where id_user="'.$_SESSION["username"].'"';
    $events = $conn->select(['events'], ['*'], $condition);
    if(!$events){
        $response['msg'] = "Error al obtener eventos";
        echo json_encode($response);
        return;
    }

    if($events->num_rows == 0){
        echo json_encode($response);
        return;
    }
    
    while($row = $events->fetch_assoc())
    {
        $event['id'] = $row['id'];
        $event['title'] = $row['title'];
        $event['start'] = $row['start_date'];
        $event['start_hour'] = $row['start_hour'];
        $event['end'] = $row['end_date'];
        $event['end_hour'] = $row['end_hour'];
        if($row['all_day'] == 0)
            $event['allDay'] =  false;
        else
            $event['allDay'] =  true;

        array_push($response["eventos"], $event);
    }
        
    $conn->closeConnection();

    echo json_encode($response);
 ?>
