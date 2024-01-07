-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2024 at 12:43 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_2204959_dellaputri_uas`
--

-- --------------------------------------------------------

--
-- Table structure for table `inventory_dellap`
--

CREATE TABLE `inventory_dellap` (
  `id` int(255) NOT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `jumlah` int(255) DEFAULT NULL,
  `harga_satuan` int(255) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_dellap`
--

INSERT INTO `inventory_dellap` (`id`, `nama_barang`, `jumlah`, `harga_satuan`, `lokasi`, `deskripsi`) VALUES
(1, 'Laptop ABC', 5, 1200, 'Bandung', 'High-performance laptop for professionals'),
(2, 'Printer XYZ', 10, 300, 'Jakarta', 'Color laser printer for office use'),
(3, 'Monitor 27-inch', 15, 250, 'Denpasar', 'Large monitor with high resolution'),
(4, 'External HDD 2TB', 8, 90, 'Manokwari', 'Portable external hard drive'),
(5, 'Keyboard Mechanical', 20, 70, 'Bandung', 'Mechanical keyboard for gaming enthusiasts'),
(6, 'Mouse Wireless', 30, 40, 'Jakarta', 'Wireless mouse with ergonomic design'),
(7, 'Headphones Noise-Canceling', 12, 150, 'Denpasar', 'Premium noise-canceling headphones');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inventory_dellap`
--
ALTER TABLE `inventory_dellap`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inventory_dellap`
--
ALTER TABLE `inventory_dellap`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
