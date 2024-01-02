<?php
include "dbconfig.php";

$con = mysqli_connect($host, $username, $password, $dbname)
or die("<br>Cannot connect to DB:$dbname on $host\n");

$browser_login = $_POST["login"];
$userData = array(
    "success" => FALSE,
    "uid" => '',
    "login" => '',
    "name" => '',
    "gender" => '',
);

$sql = "SELECT * FROM datamining.DV_User where login = '$browser_login'";
$result = mysqli_query($con, $sql);
if($result){
    if(mysqli_num_rows($result) != 1){
        echo "Something Went Wrong";
    }
    else{
        $row = mysqli_fetch_assoc($result);
        $userData["success"] = TRUE;
        $userData["uid"] = $row["uid"];
        $userData["login"] = $row["login"];
        $userData["name"] = $row["name"];
        $userData["gender"] = $row["gender"];
    }
}

$jsonData = json_encode($userData);
header('Content-Type: application/json');
echo $jsonData;


?>