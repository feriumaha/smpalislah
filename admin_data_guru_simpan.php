<?

include("koneksi.php"); // menyertakan file koneksi.php

$nama=$_POST['nama']; // mengambil data dari input nama dst..
$tlp=$_POST['tlp'];
$alamat=$_POST['alamat'];
$jabatan=$_POST['jabatan'];
$bidang=$_POST['bidang'];
// memasukkan / insert data ke database.
$insert=mysql_query("insert into data_guru (nama,tlp,alamat,jabatan,bidang)
                     value ('$nama','$tlp','$alamat','$jabatan','$bidang')");

header("location:admin_data_guru_view.php"); // menuju ke file query.php
?>