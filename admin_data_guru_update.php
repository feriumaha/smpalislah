<?

include("koneksi.php");
$id=$_GET['id'];
$nama=$_POST['nama'];
$tlp=$_POST['tlp'];
$alamat=$_POST['alamat'];
$jabatan=$_POST['jabatan'];
$bidang=$_POST['bidang'];

if(empty($nama)) $error.="Nama harus diisi!<br>";
if(empty($alamat)) $error.="Alamat tidak boleh kosong!<br>";
if(empty($bidang)) $error.="Bidang tidak boleh kosong!<br>";

if($error){
  include("admin_data_guru_edit.php");
}else{
  $insert=mysql_query("update data_guru nama='$nama',tlp='$tlp',alamat='$alamat',jabatan='$jabatan',bidang='$bidang', where id='$id'");
  header("location:admin_data_guru.php?id=$id");
}

?>