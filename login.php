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
						<div class="video-holder">
							<img src="css/images/video-img.png" alt="" />
						</div>
                    <!-- login form and rumus php -->
						<div class="post-cnt">
							<h2>Login form</h2>
							<p><strong>login hanya diperuntukkan admin saja</strong></p>
                            <form method="post" action="login_aksi.php">
                             <table style="height: 52px">
                               <tr>
                                 <td height: 60px;>username</td>
                                 <td height: 60px;>
                                  <label>
                                   <input type="text" autocomplete="off" name="Username" required />
                                  </label>
                                 </td>
                               </tr>
                               <tr>
                                <td height: 80px;>password</td>
                                <td height: 60px;>
                                 <label>
                                  <input type="password" name="Password" required />
                                 </label>
                                </td>
                               </tr>
                               <tr>
                                <td><input type="submit" name="login" value="login" /></td>
                                <td><input type="reset" name="reset" value="reset" /></td>
                               </tr>
                             </table>
                            </form>
                    <!-- end login form and rumus php -->
						</div>
                    <!-- end Content -->
						<div class="cl">&nbsp;</div>
					</section>
				</div>
				<!-- end main  -->
				<div id="footer">
<!-- footer cols -->
<? include ("footer_cols.php") ?>
<!-- end footer cols -->
<!-- footer -->
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