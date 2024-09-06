<!-- header -->
<? include ("header.php") ?>
<!-- end header -->
<!-- navigation -->
<? include ("nav.php") ?>
<!-- end navigation -->
<!-- validate form email -->
				<script type="text/javascript">
<!--
function MM_validateForm() { //v4.0
  if (document.getElementById){
    var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
    for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=document.getElementById(args[i]);
      if (val) { nm=val.name; if ((val=val.value)!="") {
        if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
          if (p<1 || p==(val.length-1)) errors+='- '+nm+' must contain an e-mail address.\n';
        } else if (test!='R') { num = parseFloat(val);
          if (isNaN(val)) errors+='- '+nm+' must contain a number.\n';
          if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
            min=test.substring(8,p); max=test.substring(p+1);
            if (num<min || max<num) errors+='- '+nm+' must contain a number between '+min+' and '+max+'.\n';
      } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' is required.\n'; }
    } if (errors) alert('The following error(s) occurred:\n'+errors);
    document.MM_returnValue = (errors == '');
} }
//-->
                </script>
<!-- end validate email form -->

				<!-- main image of slider -->
				<div class="main">
                   <!-- Content -->
					<section class="post">
                    <!-- buku tamu form dan rumus php-->
						<div class="video-holder">
                         <h2>Buku Tamu</h2>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
 <form action="buku_tamu_simpan.php" method="post">
      <table width="498" border="0" cellspacing="0" cellpadding="0" align="center">
        <tr>
		 <td><span class="style1">tanggal</span></td>
		 <td><input type="date" name="tgl" id="tgl" size="30" required /></td>
		</tr>
	    <tr>
		  <td><span class="style1">nama</span></td>
          <td>
            <input type="text" name="nama" id="nama" size=30 value="" required/>
          </td>
        </tr>
        <tr>
          <td><span class="style1">kota</span></td>
          <td>
            <input type="text" name="kota" id="kota" size=30 value="" required/>
          </td>
        </tr>
        <tr>
          <td><span class="style1">email</span></td>
          <td>
            <input name="email" type="text" id="email"  value="" size="30" onblur="MM_validateForm('email','','RisEmail');return document.MM_returnValue" required/>
          </td>
        </tr>
        <tr>
          <td valign="top"><span class="style1">pesan</span></td>
          <td>
            <textarea name="pesan" id="pesan" style="height: 50px; size: 30; " required/></textarea>
          </td>
        </tr>
        <tr>
          <td>
            <input type="submit" value="Send" name="submit">
            <input type="reset" value="Reset" name="reset">
          </td>
        </tr>
      </table>
    </form>
</table>
						</div>
                   <!-- end login form and rumus php -->
                   <!-- view buku tamu dan rumus php -->
						<div class="post-cnt">
                        <h2>View Buku Tamu</h2>
                         <div style="padding:3px;overflow:auto;width:auto;height:200px;border:1px solid grey" >
                          <?
include("koneksi.php");
?>
   <div style=" overflow: auto; max-height: 350px;padding-right:5px;margin-bottom:10px; background-color: #5A99CC;">
   <?
    $query=mysql_query("select id, nama, kota, email, pesan, tgl from buku_tamu order by id desc");
    $jumlah=mysql_num_rows($query);

    if($jumlah > 0){
      while(list($id,$nama, $kota, $email, $pesan, $tgl)=mysql_fetch_array($query)){

        echo "<div class='tamu'>
              <b>$nama</b><br />";

        if($kota) echo "<u>$kota</u><br />";

        if($email) echo "<u>$email</u><br />";

        if($pesan) echo "<u>$pesan</u><br />";

        echo "<span class='small'>$tgl</span></div>";
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
                         </div>
						</div>
                    <!-- end view buku tamu dan rumus php -->
                    <!-- end Content -->
						<div class="cl">&nbsp;</div>
					</section>
                    <!-- Testimoni -->
					<section class="testimonial">
						<h2><estimoni>Testimoni</estimoni></h2>

						<p><strong class="quote">“</strong>gunakan buku tamu dengan baik dan beri pesan yang tidak mengandung unsur SARA”</p>

					  <p class="author">Admin <strong>Yayasan Pendidikan AL-ISLAH</strong></p>
					</section>
                    <!-- end Testimoni -->
				</div>
				<!-- end main  -->
				<div id="footer">
<!-- footer cols -->
<? include ("footer_cols.php") ?>
<!-- end footer clos -->
<!-- footer -->
<? include ("footer.php") ?>
<!-- end footer -->
				</div>