<?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select nama, jumlah, pembina, status
                   from data_exskull order by nama asc");

// menghitung jumlah baris data  pada table data_kelas.
$jumlah=mysql_num_rows($query);

if($jumlah > 0){ // jika jumlah lebih dari 0 maka

  echo"<table id=\"table-a\">";//buat table
  //buat baris atas nama
  echo"<tr>
         <th width=\"250\"><b>Nama</b></th>
	     <th width=\"250\"><b>Jumlah</b></th>
	     <th width=\"250\"><b>Pembina</b></th>
	   </tr>";

  // mengulang dan menampilkan nama siswa semuanya
  while(list($nama,$jumlah,$pembina,$status)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo"<tr>
            <td>$nama</td>
            <td>$jumlah</td>
			<td>$pembina</td>
          </tr>";
 }

  echo"</table>"; //tutup table

}else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"data exskull masih kosong.";

}
?>