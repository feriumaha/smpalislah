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
                         <h2>Tambahkan Kalendar</h2>
  <form action="calendar_pendidikan_view.php" method="post">
      <table width="498" border="0" cellspacing="0" cellpadding="0" align="center">
        <tr>
         <td>
          <input type="file" name="file" value="" required />
         </td>
        </tr>
		<tr>
		  <td>                            
            <input type="submit" value="Upload" name="submit" />
		  </td>
        </tr>
      </table>
    </form>

						</div>
                   <!-- end login form and rumus php -->
                  
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