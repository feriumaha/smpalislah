<?
$mysql_host="localhost";
$mysql_user="root";
$mysql_pass="123456";
$mysql_dtabase="smp_alislah"; //nama database
@mysql_connect($mysql_host,$mysql_user,$mysql_pass) or die ('Koneksi Gagal!!');
@mysql_select_db($mysql_dtabase) or die ('Database tidak ditemukan!!');
?>