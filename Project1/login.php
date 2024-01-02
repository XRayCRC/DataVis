<?php
include "dbconfig.php";

$con = mysqli_connect($host, $username, $password, $dbname)
or die("<br>Cannot connect to DB:$dbname on $host\n");

$browser_login = $_POST["login"];
$browser_passwd = $_POST["password"];

$sql = "SELECT * FROM datamining.DV_User where login = '$browser_login'";
$result = mysqli_query($con, $sql);

if($result){
	if (mysqli_num_rows($result) == 0) {
		//Wrong Login
		exit("<br>Login: $browser_username does not exist.\n");
	} else{
		$row= mysqli_fetch_array($result);
		$user_password = $row["password"];
		$user_name = $row["name"];
		if($browser_passwd==$user_password){
			echo "success";
		} else{
			//Right login, wrong password
			exit("<br>Login: $browser_username exists, but password does not match.");
		}
	}
} else{
	//Error
	echo "Something wrong. Error: " . mysqli_error($con);
}
?>