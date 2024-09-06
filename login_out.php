<?

session_start(); // memmbuka session
session_destroy(); // menghapus session

header("location: index.php"); // kembali ke index.php
?>