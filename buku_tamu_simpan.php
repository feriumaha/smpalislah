<?

include("koneksi.php"); // menyertakan file koneksi.php

$tanggal=$_POST['tgl']; // mengambil data dari input nama dst..
$nama=$_POST['nama'];
$kota=$_POST['kota'];
$email=$_POST['email'];
$pesan=$_POST['pesan'];
// memasukkan / insert data ke database.
$insert=mysql_query("insert into buku_tamu (tgl,nama,kota,email,pesan)
                     value ('$tgl','$nama','$kota','$email','$pesan')");

header("location:buku_tamu.php"); // menuju ke file query.php
?>