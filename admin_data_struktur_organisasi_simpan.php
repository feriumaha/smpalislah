<?php
  // code A
  include("koneksi.php");
  // end of code A

  // code B
  $lokasi_file = $_FILES['gambar']['tmp_name'];
  $tipe_file   = $_FILES['gambar']['type'];
  $nama_file   = $_FILES['gambar']['name'];
  $direktori   = "image/$nama_file";
  // end of code B

  if (!empty($lokasi_file)) {
    move_uploaded_file($lokasi_file,$direktori);

    // code C
    $koneksi = koneksi_db();
    $sql = "insert into struktur values (null,'$nama_file')";
    $aksi = mysql_query($sql,$koneksi);
    // end of code C

    // code D
    if (!$aksi) {
    echo "maaf gagal memasukan gambar";
    }else{
        echo "gambar berhasil di upload<br>";
    }
    // end of code D

  }else{
    echo "terjadi kesalahan";
  }

?>