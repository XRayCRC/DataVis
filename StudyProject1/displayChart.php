<?php
include "dbconfig.php";

$con=mysqli_connect($host, $username, $password, $dbname)
or die("<br>Cannot connect to DB:$dbname on $host\n");

// Fetch data from database
$query = "SELECT year, level_current FROM datamining.US_GDP_year;";
$result = mysqli_query($con, $query);

// Process the data into JSON format
$data = array('labels' => [], 'values' => []);
while ($row = mysqli_fetch_array($result)) {
    $data['labels'][] = $row['year'];
    $data['values'][] = $row['level_current'];
}

// Close the database connection
mysqli_close($con);

// Output data as JSON
$jsonData = json_encode($data);
header('Content-Type: application/json');
echo $jsonData;
?>