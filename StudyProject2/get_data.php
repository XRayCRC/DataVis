<?php
include "dbconfig.php";


$con=mysqli_connect($host, $username, $password, $dbname)
or die("<br>Cannot connect to DB:$dbname on $host\n");

$selectedState = mysqli_real_escape_string($con, $_GET['state']);

$sql = "SELECT * FROM datamining.county_dem_covid_all WHERE state_id = '$selectedState'";
$result = mysqli_query($con, $sql);

$chartData = [
    'less5' => 0,
    '5-10' => 0,
    '10-15' => 0,
    '15-20' => 0,
    '20-25' => 0,
    '25-35' => 0,
    '35-50' => 0,
    '50-75' => 0,
    '75-100' => 0,
    '100-150' => 0,
    'over150' => 0,
];

$count = 0;

while ($data = mysqli_fetch_assoc($result)) {
    $chartData['less5'] += $data['income_household_under_5'];
    $chartData['5-10'] += $data['income_household_5_to_10'];
    $chartData['10-15'] += $data['income_household_10_to_15'];
    $chartData['15-20'] += $data['income_household_15_to_20'];
    $chartData['20-25'] += $data['income_household_20_to_25'];
    $chartData['25-35'] += $data['income_household_25_to_35'];
    $chartData['35-50'] += $data['income_household_35_to_50'];
    $chartData['50-75'] += $data['income_household_50_to_75'];
    $chartData['75-100'] += $data['income_household_75_to_100'];
    $chartData['100-150'] += $data['income_household_100_to_150'];
    $chartData['over150'] += $data['income_household_150_over'];

    $count++;
}

// Calculate averages
foreach ($chartData as $range => $value) {
    $chartData[$range] = $value / $count;
}

mysqli_close($con);

$jsonData = json_encode($chartData);

header('Content-Type: application/json');
echo $jsonData;
?>