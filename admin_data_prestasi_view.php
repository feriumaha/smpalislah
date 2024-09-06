<?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select judul, deskripsi, bidang
                   from data_prestasi order by judul asc");

// menghitung jumlah baris data  pada table data_kelas.
$jumlah=mysql_num_rows($query);

if($jumlah > 0){ // jika jumlah lebih dari 0 maka

  echo"<table id=\"table-a\">";//buat table
  //buat baris atas nama
  echo"<tr>
         <th width=\"250\"><b>Judul Prestasi</b></th>
	     <th width=\"250\"><b>Deskripsi</b></th>
	     <th width=\"250\"><b>Bidang Prestasi</b></th>
	   </tr>";

  // mengulang dan menampilkan nama siswa semuanya
  while(list($judul,$deskripsi,$bidang)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo"<tr>
            <td>$judul</td>
            <td>$deskripsi</td>
			<td>$bidang</td>
          </tr>";
 }

  echo"</table>"; //tutup table

}else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"data prestasi masih kosong.";

}
?>