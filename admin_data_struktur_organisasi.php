<!-- header -->
<? include ("header.php") ?>
<!-- end header -->
<!-- navigation -->
<? include ("nav_admin.php") ?>
<!-- end navigation -->
				<!-- main image of slider -->
				<div class="main">
                   <!-- Content -->
					<section class="post">
<h2><center>Struktur Organisasi</center></h2>
<form enctype="multipart/form-data" action="admin_data_struktur_organisasi_simpan.php" method="post">
<tr>
 <td>Upload file :</td>
</tr>
<tr>
 <td><input type="file" name="gambar"/></td>
</tr>
<tr>
 <td><input type="submit" value="Upload" /></td>
</tr>
</form>

<!-- view -->
<?php

  include("koneksi.php");


  $koneksi = koneksi_db("select id, gambar
                   from struktur ");
  $sql  = "select * from struktur";
  $aksi = mysql_query($sql,$koneksi);

  echo "<table align='center' border='1'>
        <tr>
         <td>No</td>
         <td>Gambar</td>
        </tr>";

  $no = 1;
  while($data = mysql_fetch_array($aksi)):?>
     <tr>
      <td>
       <?php echo $no; ?>
      </td>
      <td>
       <center>
         <img src="image/<?php echo $data['nama_image']; ?>" border="0"/>
       </center>
      </td>
     </tr>
  <?php
  $no++;
  endwhile;
  ?>
<!-- end view -->



                    <!-- end Content -->
						<div class="cl">&nbsp;</div>
					</section>
				</div>
				<!-- end main  -->
				<div id="footer">
<!-- footer -->
<? include ("footer_admin.php") ?>
<!-- end footer -->
				</div>