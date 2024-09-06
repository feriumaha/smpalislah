<!-- header -->
<? include ("header.php") ?>
<!-- end header -->
<!-- navigation -->
<? include ("nav.php") ?>
<!-- end navigation -->
				<!-- main image of slider -->
				<div class="main">
                   <!-- Content -->
					<section class="post">
                    <!-- galeri admin-->

                         <center>
<?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select nama, tlp, alamat, jabatan, bidang
                   from data_guru order by nama asc");

// menghitung jumlah baris data  pada table buku_tamu.
$jumlah=mysql_num_rows($query);

if($jumlah > 0){ // jika jumlah lebih dari 0 maka

  echo"<table id=\"table-a\">";//buat table
  //buat baris atas nama
  echo"<tr>
         <th width=\"250\"><b>Nama</b></th>
	     <th width=\"250\"><b>Alamat</b></th>
	     <th width=\"250\"><b>Jabatan</b></th>
		 <th width=\"250\"><b>Bidang</b></th>
	   </tr>";

  // mengulang dan menampilkan nama siswa semuanya
  while(list($nama,$tlp,$alamat,$jabatan,$bidang)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo"<tr>
            <td>$nama</td>
			<td>$alamat</td>
			<td>$jabatan</td>
			<td>$bidang</td>
          </tr>";
 }

  echo"</table>"; //tutup table

}else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"data guru masih kosong.";

}
?>
                         </center>

                   <!-- end galeri admin -->
                    <!-- end Content -->
						<div class="cl">&nbsp;</div>
					</section>

				</div>
				<!-- end main  -->
				<div id="footer">
<!-- footer -->
<? include ("footer_cols.php") ?>
<? include ("footer.php") ?>
<!-- end footer -->
				</div>
			</div>
		  <!-- end of container -->
		</div>
		<!-- end of shell -->
	</div>
	<!-- end of wrapper -->
</body>
</html>