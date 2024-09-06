<?

include("koneksi.php"); // menyertakan file koneksi.php

$judul=$_POST['judul']; // mengambil data dari input nama dst..
$deskripsi=$_POST['deskripsi'];
$bidang=$_POST['bidang'];
// memasukkan / insert data ke database.
$insert=mysql_query("insert into data_prestasi (judul,deskripsi,bidang)
                     value ('$judul','$deskripsi','$bidang')");

header("location:admin_data_prestasi_view.php"); // menuju ke file query.php
?>