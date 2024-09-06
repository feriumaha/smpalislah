<? include("koneksi.php"); ?>

   <h1 class="judul">Edit Data Guru</h1>

   <?
   if($error){
     $err=str_replace('<br>','\n',$error);
     echo"<script>alert('$err')</script>";
     echo"<div class='error'>$error</div>";
   }

    $id=$_GET['id'];

    $query=mysql_query("select id, nama, tlp, alamat, jabatan, bidang from data_guru where id='$id'");
    $jumlah=mysql_num_rows($query);

    if($jumlah > 0){
      @list($id,$nama, $tlp, $alamat, $jabatan, $bidang)=mysql_fetch_array($query);

      if($_POST){
        $nama=$_POST['nama'];
        $tlp=$_POST['tlp'];
        $alamat=$_POST['alamat'];
        $jabatan=$_POST['jabatan'];
        $bidang=$_POST['bidang'];
              }
      }


      ?>
       <div class="borders">
       <form method="post" action="admin_data_guru_simpan.php?id=<?= $id ?>">
         <table>
           <tr><td>Nama</td><td>:</td><td><input name="nama" size="35" type="text" value="<?= $nama ?>" /></td></tr>
           <tr><td>tlp</td><td>:</td><td><input name="tlp" size="20" type="text" value="<?= $tlp ?>" /></td></tr>
           <tr><td>alamat</td><td>:</td><td><input name="alamat" size="16" type="text" value="<?= $alamat ?>" /></td></tr>
           <tr><td>jabatan</td><td>:</td><td><input name="jabatan" size="16" type="text" value="<?= $jabatan ?>" /></tr>
		   <tr><td>bidang</td><td>:</td><td><input name="bidang" size="16" type="text" value="<?= $bidang ?>" /></tr>
		   <tr><td>
            <input type="submit" value="Send" name="Update">
		  </td></tr>
         </table>
       </form>
       </div>


