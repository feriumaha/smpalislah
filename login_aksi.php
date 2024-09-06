<?

include("koneksi.php");

$_user="admin"; // username login
$_pass="123456"; // password login

$user=$_POST['username']; // mengambil username dari form
$pass=$_POST['password'];  // mengambil password dari form

if($_password==$password && $_username==$username){ // mencocokkan username dan password dengan form

  session_start(); // membuka session untuk memasukkan informasi login
  $_SESSION['login_oke']=1; // memasukkan info login bernama login_oke ke dalam session menjadi 1

  header("location: admin.php"); // pergi ke admin.php

}else{ // jika tidak cocok

  $error="Username dan Password Salah!!";  // pesan error
  include("login.php");  // menyertakan file login.php

}
?>
