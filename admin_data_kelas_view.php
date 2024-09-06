                       <?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select kelas, jumlah, wali
                   from data_kelas order by kelas asc");

// menghitung jumlah baris data  pada table data_kelas.
$jumlah=mysql_num_rows($query);

if($jumlah > 0){ // jika jumlah lebih dari 0 maka

  echo"<table id=\"table-a\">";//buat table
  //buat baris atas nama
  echo"<tr>
         <th width=\"250\"><b>Kelas</b></th>
	     <th width=\"250\"><b>Jumlah</b></th>
	     <th width=\"250\"><b>Nama Wali</b></th>
	   </tr>";

  // mengulang dan menampilkan nama siswa semuanya
  while(list($kelas,$jumlah,$wali)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo"<tr>
            <td>$kelas</td>
            <td>$jumlah</td>
			<td>$wali</td>
          </tr>";
 }

  echo"</table>"; //tutup table

}else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"data kelas masih kosong, silahkan masukkan data.";

}
?>