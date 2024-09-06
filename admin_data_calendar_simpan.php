<?

include("koneksi.php"); // menyertakan file koneksi.php

$file=$_POST['file']; // mengambil data dari input nama dst..
// memasukkan / insert data ke database.
$insert=mysql_query("insert into calendar (file)
                     value ('$file')");

header("location:admin_data_calendar_view.php"); // menuju ke file query.php
?>