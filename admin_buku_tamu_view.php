<? include("header.php"); ?>
<? include("nav_admin.php"); ?>
<? include("koneksi.php"); ?>
   <div style=" overflow: auto; max-height: 350px;padding-right:5px;margin-bottom:10px; background-color: #5A99CC;">
   <?
    $query=mysql_query("select id, nama, kota, email, pesan,z from buku_tamu order by id desc");
    $jumlah=mysql_num_rows($query);

    if($jumlah > 0){
      while(list($id,$nama, $kota, $email, $pesan, $tgl)=mysql_fetch_array($query)){

        echo "<div class='tamu'>
              <b>$nama</b><br />";

        if($kota) echo "<u>$kota</u><br />";

        if($email) echo "<u>$email</u><br />";

       echo "$pesan<br />
              <span class='small'>$tgl <a href='admin_buku_tamu_hapus.php?id=$id' onclick=\"return confirm('Anda yakin akan menghapus pesan dari $nama?');\">Hapus</a> </span></div>";
      }
    }

   ?>
   </div>


   <?
   if($error){
     $err=str_replace('<br>','\n',$error);
     echo"<script>alert('$err')</script>";
     echo"<div class='error'>$error</div>";
   }
   ?>

<? include("footer_admin.php") ?>