<?php
    require('./connector.php');

    $conn = new MySqlConnector();
    if (!$conn->initConnection())
        return;

    /*Inserto 3 usuarios*/
    for($i = 0; $i < 3; $i++){
        try {
            $data["name"] = "user".$i;
            $data["password"] = password_hash('pwdUser'.$i, PASSWORD_DEFAULT);

            //Verifico si el usuario ya existe
            $condition = 'where name="'.$data["name"].'"';
            $exist_user = $conn->select(['users'], ['*'], $condition);
            if(!$exist_user){
                echo 'No se pudo comprovar la existencia del usuario: ' . $data["name"];
                continue;
            }
            if($exist_user->num_rows > 0){
                echo "Usuario existente:"  . $data["name"] . "</br>";
                continue;
            }
            //Creo el usuario
            if ($conn->insert('users', $data)) {
                echo "Se insertaro:"  . $data["name"] . " - " . $data["password"] . "</br>";
            } else {
                echo "Se ha producido un error en la inserción " . $data["name"] . " - " . $data["password"] . "</br>";
            }
        }
        catch(Exception $exc)
        {
            echo "Error: ".$exc->getMessage()."</br>";
        }
    }    
  
    $conn->closeConnection();
 ?>
