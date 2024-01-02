<?php
include "dbconfig.php";

$con=mysqli_connect($host, $username, $password, $dbname)
or die("<br>Cannot connect to DB:$dbname on $host\n");

$sql = "SELECT DISTINCT state_id FROM datamining.county_dem_covid_all ORDER BY state_id ASC";
$result = mysqli_query($con, $sql);

$states = [];
while($row = mysqli_fetch_array($result)){
    array_push($states, $row['state_id']);
}

mysqli_close($con);

$jsonData = json_encode($states);

header('Content-Type: application/json');
echo $jsonData;
?>