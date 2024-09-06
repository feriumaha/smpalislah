                         <?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select id, nama, tlp, alamat, jabatan, bidang
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
         <th width=\"250\"><b>Editor</b></th>
	   </tr>";

  // mengulang dan menampilkan nama siswa semuanya
  while(list($id, $nama,$tlp,$alamat,$jabatan,$bidang)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo"<tr>
            <td>$nama</td>
			<td>$alamat</td>
			<td>$jabatan</td>
			<td>$bidang</td>
            <td><a href='admin_data_guru_hapus.php?id=$id' onclick=\"return confirm('Anda yakin akan menghapus data $nama?');\">Hapus</a> <a href='admin_data_guru_edit.php?id=$id';\">Edit</a></td>
          </tr>";
 }

  echo"</table>"; //tutup table

}else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"data guru masih kosong.";

}
?>