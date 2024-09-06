-- phpMyAdmin SQL Dump
-- version 2.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 09, 2015 at 02:53 PM
-- Server version: 5.1.33
-- PHP Version: 5.2.8
--
-- Database: `smp_alislah`
--

-- --------------------------------------------------------

--
-- Table structure for table `buku_tamu`
--

CREATE TABLE `buku_tamu` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `tgl` date NOT NULL,
  `nama` varchar(1000) NOT NULL,
  `kota` varchar(1000) NOT NULL,
  `email` varchar(1000) NOT NULL,
  `pesan` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `buku_tamu`
--

INSERT INTO `buku_tamu` VALUES (9, '2014-01-29', 'Rina', 'Surabaya', 'rinna@gmail.com', 'Sukses Om');
INSERT INTO `buku_tamu` VALUES (10, '2015-01-29', 'regita cahyaning putri', 'surabaya', 'regitacah@gmail.com', 'keren');
INSERT INTO `buku_tamu` VALUES (11, '2015-01-29', 'anggi afifta volta', 'surabaya', 'anggivolta@gmail.com', 'mantab gan,

lanjut teruuus');
INSERT INTO `buku_tamu` VALUES (12, '2015-01-29', 'rosy novita sari', 'surabaya', 'rosynovitasari04@gmail.com', 'hmmm .. wow.

');
INSERT INTO `buku_tamu` VALUES (13, '2015-01-30', 'Rohmawati', 'Surabaya', 'rohma_wati160@yahoo.com', 'haaaa... keren

keren... tapi aku gak paham... lebih di  perbarui lagi ya... ojok ngawur-ngawur lho ngesih data.e.... hehehe sukses dah...');
INSERT INTO `buku_tamu` VALUES (14, '2015-01-31', 'feri', 'Surabaya', 'andikaferi10@gmail.com', 'lannjuut ');
INSERT INTO `buku_tamu` VALUES (16, '2015-01-31', 'Junaidi Slankers ', 'Surabaya', 'junaidifared@yahoo.co.id', 'Siip gan ');
INSERT INTO `buku_tamu` VALUES (17, '2015-02-02', 'Fajar Oktavianto', 'Surabaya , Gunung Anyar', 'viancaem700@gmail.com',

'Lanjutkan Gan (y)');
INSERT INTO `buku_tamu` VALUES (18, '2015-02-02', 'M Yourheza R P', 'Sidoarjo', 'yourhezaputra@yahoo.co.id', 'Kebenaran Tak

Mengenal Adanya Kejelekan.... Terbaik !!!            ');

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `gambar` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `calendar`
--


-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `judul` varchar(1000) NOT NULL,
  `nama` varchar(1000) NOT NULL,
  `tlp` varchar(1000) NOT NULL,
  `alamat` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `contact`
--


-- --------------------------------------------------------

--
-- Table structure for table `data_exskull`
--

CREATE TABLE `data_exskull` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `nama` varchar(1000) NOT NULL,
  `jumlah` varchar(1000) NOT NULL,
  `pembina` varchar(1000) NOT NULL,
  `status` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `data_exskull`
--

INSERT INTO `data_exskull` VALUES (4, 'Pencak Silat Pagar Nusa Nahdlotul Ulama', '100 Siswa', 'Muh Amin', '');
INSERT INTO `data_exskull` VALUES (5, 'Paskibraka', '30 Siswa', 'Alumnus SMP Al-Islah', '');
INSERT INTO `data_exskull` VALUES (6, 'Pramuka ', 'Semua Siswa', 'Pak Wahyudi', '');
INSERT INTO `data_exskull` VALUES (11, 'Al-Banjari', '30 Siswa', '-', '');

-- --------------------------------------------------------

--
-- Table structure for table `data_guru`
--

CREATE TABLE `data_guru` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `nama` varchar(1000) NOT NULL,
  `tlp` varchar(1000) NOT NULL,
  `alamat` varchar(1000) NOT NULL,
  `jabatan` varchar(1000) NOT NULL,
  `bidang` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `data_guru`
--

INSERT INTO `data_guru` VALUES (2, 'Mudzakkir', '+62xxxxxx', 'Ketintang', 'Guru', 'Ekonomi, Pembukuan');
INSERT INTO `data_guru` VALUES (3, 'Wiwik Hirawati ', '+62xxxxxx', 'Wonokromo', 'Guru', 'Bahasa Inggris');
INSERT INTO `data_guru` VALUES (12, 'Nidya puri', '+62xxxxxx', 'Surabaya', 'Guru', 'Fisika');
INSERT INTO `data_guru` VALUES (6, 'Monik Endah ', '+62xxxxxx', 'Jl.Gunung Anyar Kidul', 'Guru', 'PPKN');
INSERT INTO `data_guru` VALUES (10, 'Abdul Musta''in', '+62xxxxxx', 'Jl. Gunung Anyar Kidul', 'Wakil Kepala Sekolah dan

Guru', 'Fisika');
INSERT INTO `data_guru` VALUES (11, 'Ali Afandi', '+62xxxxxx', 'Jl.Gunung Anyar Kidul', 'Kepala Sekolah dan Guru', 'Bahasa

Indonesia');

-- --------------------------------------------------------

--
-- Table structure for table `data_kelas`
--

CREATE TABLE `data_kelas` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `kelas` varchar(1000) NOT NULL,
  `jumlah` varchar(1000) NOT NULL,
  `wali` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `data_kelas`
--

INSERT INTO `data_kelas` VALUES (4, 'VII A', '40 Siswa', 'Bu Wiwik');
INSERT INTO `data_kelas` VALUES (5, 'VII B', '40 Siswa', 'Bu Nusroti');
INSERT INTO `data_kelas` VALUES (6, 'VII C', '40 Siswa', 'bu maya');
INSERT INTO `data_kelas` VALUES (7, 'VII D', '40 Siswa', 'Bu lala');
INSERT INTO `data_kelas` VALUES (8, 'VIII A', '40 Siswa', 'Bu Istikhomah');
INSERT INTO `data_kelas` VALUES (9, 'VIII B', '40 Siswa', 'Bu Nurul fathon');
INSERT INTO `data_kelas` VALUES (10, 'VIII C', '40 Siswa', 'Bu Suwarni');
INSERT INTO `data_kelas` VALUES (11, 'VIII D', '40 Siswa', 'Pak Yunus');
INSERT INTO `data_kelas` VALUES (12, 'XI A', '40 Siswa', 'Bu Anik');
INSERT INTO `data_kelas` VALUES (13, 'XI B', '40 Siswa', 'Pak Syifa''');
INSERT INTO `data_kelas` VALUES (14, 'XI C', '40 Siswa', 'Pak Ali');
INSERT INTO `data_kelas` VALUES (15, 'XI D', '40 Siswa', 'Pak Ta''in');

-- --------------------------------------------------------

--
-- Table structure for table `data_prestasi`
--

CREATE TABLE `data_prestasi` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `judul` varchar(1000) NOT NULL,
  `deskripsi` varchar(1000) NOT NULL,
  `bidang` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `data_prestasi`
--

INSERT INTO `data_prestasi` VALUES (2, 'Prestasi Kejurcab Pencak Silat', 'Prestasi diraih oleh anggota Pencak Silat Nu',

'Olahraga dan Bela diri');
