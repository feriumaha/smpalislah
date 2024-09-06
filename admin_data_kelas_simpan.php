<?

include("koneksi.php"); // menyertakan file koneksi.php

$kelas=$_POST['kelas']; // mengambil data dari input nama dst..
$jumlah=$_POST['jumlah'];
$wali=$_POST['wali'];
// memasukkan / insert data ke database.
$insert=mysql_query("insert into data_kelas (kelas,jumlah,wali)
                     value ('$kelas','$jumlah','$wali')");

header("location:admin_data_kelas_view.php"); // menuju ke file query.php
?>