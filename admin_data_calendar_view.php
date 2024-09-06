                       <?

include("koneksi.php"); // menyertakan file koneksi.php

// QUERY pada database
$query=mysql_query("select file
                   from calendar order by nama asc");

// menghitung jumlah baris data  pada table data_kelas.
$jumlah=mysql_num_rows($query);

if($jumlah > 0){ // jika jumlah lebih dari 0 maka

  echo"<table border=\"1\">";//buat table
  //buat baris atas nama
  echo"

  // mengulang dan menampilkan nama siswa semuanya
  while(list($file)=mysql_fetch_array($query)){
     // merubah nama field mnjadi data
     // menampilkan nama dan kelas serta link untuk VIEW detail
     echo" $file
 }


else{ // jika jumlah 0, tuliskan pemberitahuan dan link mengisi data

    echo"calendar masih kosong.";

}
?>