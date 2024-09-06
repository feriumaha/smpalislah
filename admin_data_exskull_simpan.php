<?

include("koneksi.php"); // menyertakan file koneksi.php

$nama=$_POST['nama']; // mengambil data dari input nama dst..
$jumlah=$_POST['jumlah'];
$pembina=$_POST['pembina'];
// memasukkan / insert data ke database.
$insert=mysql_query("insert into data_exskull (nama,jumlah,pembina)
                     value ('$nama','$jumlah','$pembina')");

header("location:admin_data_exskull_view.php"); // menuju ke file query.php
?>