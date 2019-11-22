<?php
  class MySqlConnector
  {
    private $host = 'localhost';
    private $user = 'yantrossero';
    private $password = '9lslpXPic2B0XkPI';
    private $db_name = 'nextuphp';
    private $connection;
   

    /*Intenta crear una conexión a la base de datos*/
    function initConnection(){
      $this->connection = new mysqli($this->host, $this->user, $this->password, $this->db_name);
      if ($this->connection->connect_error) {
        return false;
      }else {
        return true;
      }
    }

    /*Cierra una conexión de base de datos*/
    function closeConnection(){
        $this->connection->close();
    }

    /*Crea una tabla en la base de datos*/
    function createTable($table_name, $fileds){
      $sql = 'CREATE TABLE '.$table_name.' (';
      $length_array = count($fileds);
      $i = 1;
      foreach ($fileds as $key => $value) {
        $sql .= $key.' '.$value;
        if ($i!= $length_array) {
          $sql .= ', ';
        }else {
          $sql .= ');';
        }
        $i++;
      }
      return $sql;
    }

    /*Ejecuta una consulta MySql*/
    function executeQuery($query){
      return $this->connection->query($query);
    }
   
    /*Inserta registros en una tabla*/
    function insert($table, $data){
        $sql = 'INSERT INTO '.$table.' (';
        $i = 1;
        foreach ($data as $key => $value) {
            $sql .= $key;
            if ($i<count($data)) {
              $sql .= ', ';
            }else $sql .= ')';
            $i++;
        }
        $sql .= ' VALUES (';
        $i = 1;
        foreach ($data as $key => $value) {
            $sql .= "'".$value."'";
            if ($i<count($data)) {
            $sql .= ', ';
            }else $sql .= ');';
            $i++;
        }
        
        return $this->executeQuery($sql);
    }

    function newId(){
      return $this->connection->insert_id;
    }

    /*Actualiza registros en base de datos*/
    function update($table, $data, $condition){
        $sql = 'UPDATE '.$table.' SET ';
        $i=1;
        foreach ($data as $key => $value) {
          $sql .=  $key.'="'.$value.'"';
          if ($i<sizeof($data)) {
            $sql .= ', ';
          }else $sql .= ' WHERE '.$condition.';';
          $i++;
        }
        $query = $sql;
        return $this->executeQuery($sql);
    }

    /*Elimina registros*/
    function delete($table, $condition){
        $sql = "DELETE FROM ".$table." WHERE ".$condition.";";
        return $this->executeQuery($sql);
      }
  
    /*Realiza consultas*/
    function select($tables, $fields, $condition = ""){        
        $sql = "SELECT ";
        $keys = array_keys($fields);
        $last_key = end($keys);
        foreach ($fields as $key => $value) {
          $sql .= $value;
          if ($key!=$last_key) {
            $sql.=", ";
          }else $sql .=" FROM ";
        }
  
        $keys = array_keys($tables);
        $last_key = end($keys);
        foreach ($tables as $key => $value) {
          $sql .= $value;
          if ($key!=$last_key) {
            $sql.=", ";
          }else $sql .= " ";
        }
  
        if ($condition == "") {
          $sql .= ";";
        }else {
          $sql .= $condition.";";
        }
      
        return $this->executeQuery($sql);
    }
  }
 ?>
