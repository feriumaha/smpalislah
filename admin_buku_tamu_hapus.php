<?
include("koneksi.php");

$id=$_GET['id'];

$delete=mysql_query("delete from buku_tamu where id='$id'");

header("location:admin_buku_tamu_view.php");
?>
