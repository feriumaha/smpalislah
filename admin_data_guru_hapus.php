<?
include("koneksi.php");

$id=$_GET['id'];

$delete=mysql_query("delete from data_guru where id='$id'");

header("location:admin_data_guru.php");
?>