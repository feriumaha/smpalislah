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
                    <!-- buku tamu form dan rumus php-->
						<div class="video-holder">
                         <h2>Data Prestasi</h2>
  <form action="admin_data_prestasi_simpan.php" method="post">
      <table width="498" border="0" cellspacing="0" cellpadding="0" align="center">
        <tr>
		  <td><span class="style1">judul</span></td>
          <td>
            <input type="text" name="judul" id="judul" size=30 value="" required/>
          </td>
        </tr>
		<tr>
		  <td><span class="style1">deskripsi</span></td>
          <td>
            <input type="text" name="deskripsi" id="deskripsi" size="30" value="" required/>
          </td>
        </tr>
		<tr>
		  <td><span class="style1">bidang</span></td>
          <td>
            <input type="text" name="bidang" id="bidang" size=30 value="" required/>
          </td>
        </tr>
		<tr>
		  <td>
            <input type="submit" value="Save" name="submit">
		  </td>
          <td>
			<input type="reset" value="Reset" name="reset">
          </td>
        </tr>
      </table>
    </form>

						</div>
                   <!-- end login form and rumus php -->
                   <!-- view buku tamu dan rumus php -->
						<div class="post-cnt">
                        <h2>View Data Prestasi</h2>
                         <div style="padding:3px;overflow:auto;width:auto;height:200px;border:1px solid grey" >
   <? include ("admin_data_prestasi_view.php"); ?>
                         </div>
						</div>
                    <!-- end view buku tamu dan rumus php -->
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
			</div>
		  <!-- end of container -->
		</div>
		<!-- end of shell -->
	</div>
	<!-- end of wrapper -->
</body>
</html>