-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2026 at 02:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jbm_dummydata`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_FN` varchar(100) DEFAULT NULL,
  `admin_LN` varchar(100) DEFAULT NULL,
  `admin_email` varchar(100) DEFAULT NULL,
  `admin_password` varchar(255) DEFAULT NULL,
  `admin_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_FN`, `admin_LN`, `admin_email`, `admin_password`, `admin_createdat`) VALUES
(1, 'System', 'Administrator', 'admin@jbmtrading.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2026-02-15 11:25:21');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `cart_quantity` int(11) DEFAULT NULL,
  `cart_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `Cat_ID` int(11) NOT NULL,
  `Cat_Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`Cat_ID`, `Cat_Name`) VALUES
(1, 'School Supplies'),
(2, 'Office Supplies and Equipment'),
(3, 'Medicine and Medical Supplies'),
(4, 'Sports Supplies and Equipment'),
(5, 'Furniture and Fixtures');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `order_total` decimal(10,2) DEFAULT NULL,
  `order_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderstatus`
--

CREATE TABLE `orderstatus` (
  `os_id` int(11) NOT NULL,
  `oi_id` int(11) DEFAULT NULL,
  `os_status` enum('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `os_date` datetime DEFAULT NULL,
  `os_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `oi_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `oi_quantity` int(11) DEFAULT NULL,
  `oi_subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productcategory`
--

CREATE TABLE `productcategory` (
  `PC_ID` int(11) NOT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `Cat_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productcategory`
--

INSERT INTO `productcategory` (`PC_ID`, `Prod_ID`, `Cat_ID`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(11, 11, 2),
(12, 12, 2),
(13, 13, 2),
(14, 14, 2),
(15, 15, 2),
(16, 16, 2),
(17, 17, 2),
(18, 18, 2),
(19, 19, 2),
(20, 20, 2),
(21, 21, 3),
(22, 22, 3),
(23, 23, 3),
(24, 24, 3),
(25, 25, 3),
(26, 26, 3),
(27, 27, 3),
(28, 28, 3),
(29, 29, 3),
(30, 30, 3),
(31, 31, 4),
(32, 32, 4),
(33, 33, 4),
(34, 34, 4),
(35, 35, 4),
(36, 36, 4),
(37, 37, 4),
(38, 38, 4),
(39, 39, 4),
(40, 40, 4),
(41, 41, 5),
(42, 42, 5),
(43, 43, 5),
(44, 44, 5),
(45, 45, 5),
(46, 46, 5),
(47, 47, 5),
(48, 48, 5),
(49, 49, 5),
(50, 50, 5);

-- --------------------------------------------------------

--
-- Table structure for table `productprice`
--

CREATE TABLE `productprice` (
  `PP_ID` int(11) NOT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `PP_ProdPrice` decimal(10,2) DEFAULT NULL,
  `PP_ValidFrom` datetime DEFAULT NULL,
  `PP_ValidTo` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productprice`
--

INSERT INTO `productprice` (`PP_ID`, `Prod_ID`, `PP_ProdPrice`, `PP_ValidFrom`, `PP_ValidTo`) VALUES
(1, 1, 15.00, '2026-01-01 00:00:00', NULL),
(2, 2, 45.00, '2026-01-01 00:00:00', NULL),
(3, 3, 65.00, '2026-01-01 00:00:00', NULL),
(4, 4, 20.00, '2026-01-01 00:00:00', NULL),
(5, 5, 35.00, '2026-01-01 00:00:00', NULL),
(6, 6, 85.00, '2026-01-01 00:00:00', NULL),
(7, 7, 25.00, '2026-01-01 00:00:00', NULL),
(8, 8, 450.00, '2026-01-01 00:00:00', NULL),
(9, 9, 10.00, '2026-01-01 00:00:00', NULL),
(10, 10, 55.00, '2026-01-01 00:00:00', NULL),
(11, 11, 120.00, '2026-01-01 00:00:00', NULL),
(12, 12, 30.00, '2026-01-01 00:00:00', NULL),
(13, 13, 180.00, '2026-01-01 00:00:00', NULL),
(14, 14, 250.00, '2026-01-01 00:00:00', NULL),
(15, 15, 550.00, '2026-01-01 00:00:00', NULL),
(16, 16, 280.00, '2026-01-01 00:00:00', NULL),
(17, 17, 195.00, '2026-01-01 00:00:00', NULL),
(18, 18, 95.00, '2026-01-01 00:00:00', NULL),
(19, 19, 45.00, '2026-01-01 00:00:00', NULL),
(20, 20, 75.00, '2026-01-01 00:00:00', NULL),
(21, 21, 450.00, '2026-01-01 00:00:00', NULL),
(22, 22, 180.00, '2026-01-01 00:00:00', NULL),
(23, 23, 1250.00, '2026-01-01 00:00:00', NULL),
(24, 24, 250.00, '2026-01-01 00:00:00', NULL),
(25, 25, 120.00, '2026-01-01 00:00:00', NULL),
(26, 26, 85.00, '2026-01-01 00:00:00', NULL),
(27, 27, 65.00, '2026-01-01 00:00:00', NULL),
(28, 28, 95.00, '2026-01-01 00:00:00', NULL),
(29, 29, 280.00, '2026-01-01 00:00:00', NULL),
(30, 30, 550.00, '2026-01-01 00:00:00', NULL),
(31, 31, 650.00, '2026-01-01 00:00:00', NULL),
(32, 32, 580.00, '2026-01-01 00:00:00', NULL),
(33, 33, 450.00, '2026-01-01 00:00:00', NULL),
(34, 34, 850.00, '2026-01-01 00:00:00', NULL),
(35, 35, 180.00, '2026-01-01 00:00:00', NULL),
(36, 36, 1250.00, '2026-01-01 00:00:00', NULL),
(37, 37, 280.00, '2026-01-01 00:00:00', NULL),
(38, 38, 380.00, '2026-01-01 00:00:00', NULL),
(39, 39, 150.00, '2026-01-01 00:00:00', NULL),
(40, 40, 750.00, '2026-01-01 00:00:00', NULL),
(41, 41, 3500.00, '2026-01-01 00:00:00', NULL),
(42, 42, 4500.00, '2026-01-01 00:00:00', NULL),
(43, 43, 2800.00, '2026-01-01 00:00:00', NULL),
(44, 44, 3200.00, '2026-01-01 00:00:00', NULL),
(45, 45, 12500.00, '2026-01-01 00:00:00', NULL),
(46, 46, 1850.00, '2026-01-01 00:00:00', NULL),
(47, 47, 4200.00, '2026-01-01 00:00:00', NULL),
(48, 48, 8500.00, '2026-01-01 00:00:00', NULL),
(49, 49, 5600.00, '2026-01-01 00:00:00', NULL),
(50, 50, 6500.00, '2026-01-01 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `Prod_ID` int(11) NOT NULL,
  `Prod_name` varchar(255) DEFAULT NULL,
  `Prod_description` text DEFAULT NULL,
  `Prod_available` tinyint(4) DEFAULT 1,
  `Prod_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`Prod_ID`, `Prod_name`, `Prod_description`, `Prod_available`, `Prod_createdat`) VALUES
(1, 'Ballpen - Blue', 'High-quality blue ballpoint pen', 1, '2026-02-15 11:25:21'),
(2, 'Notebook - Spiral', 'A4 size spiral notebook, 100 pages', 1, '2026-02-15 11:25:21'),
(3, 'Pencil Set', 'Set of 12 HB pencils with eraser', 1, '2026-02-15 11:25:21'),
(4, 'Ruler - 30cm', 'Transparent plastic ruler', 1, '2026-02-15 11:25:21'),
(5, 'Scissors', 'Sharp stainless steel scissors', 1, '2026-02-15 11:25:21'),
(6, 'Crayons - 24 colors', 'Non-toxic vibrant crayons', 1, '2026-02-15 11:25:21'),
(7, 'Glue Stick', 'Fast-drying washable glue', 1, '2026-02-15 11:25:21'),
(8, 'Backpack', 'Durable school backpack', 1, '2026-02-15 11:25:21'),
(9, 'Eraser - White', 'Soft white eraser', 1, '2026-02-15 11:25:21'),
(10, 'Highlighter Set', 'Set of 4 fluorescent highlighters', 1, '2026-02-15 11:25:21'),
(11, 'Stapler', 'Heavy-duty metal stapler', 1, '2026-02-15 11:25:21'),
(12, 'Paper Clips - 100', 'Standard size clips, silver', 1, '2026-02-15 11:25:21'),
(13, 'Printer Paper - A4', 'Premium white paper, 500 sheets', 1, '2026-02-15 11:25:21'),
(14, 'File Organizer', 'Desktop file organizer', 1, '2026-02-15 11:25:21'),
(15, 'Desk Lamp', 'LED desk lamp', 1, '2026-02-15 11:25:21'),
(16, 'Calculator', 'Scientific solar calculator', 1, '2026-02-15 11:25:21'),
(17, 'Desk Organizer', 'Multi-compartment organizer', 1, '2026-02-15 11:25:21'),
(18, 'Whiteboard Markers', 'Set of 4 dry-erase markers', 1, '2026-02-15 11:25:21'),
(19, 'Binder Clips', 'Assorted sizes, pack of 12', 1, '2026-02-15 11:25:21'),
(20, 'Tape Dispenser', 'Desktop dispenser with tape', 1, '2026-02-15 11:25:21'),
(21, 'First Aid Kit', 'Complete first aid supplies', 1, '2026-02-15 11:25:21'),
(22, 'Digital Thermometer', 'Fast and accurate thermometer', 1, '2026-02-15 11:25:21'),
(23, 'BP Monitor', 'Automatic blood pressure monitor', 1, '2026-02-15 11:25:21'),
(24, 'Face Masks - 50', 'Disposable 3-ply face masks', 1, '2026-02-15 11:25:21'),
(25, 'Hand Sanitizer', 'Antibacterial gel, 500ml', 1, '2026-02-15 11:25:21'),
(26, 'Bandages', 'Waterproof adhesive bandages', 1, '2026-02-15 11:25:21'),
(27, 'Cotton Balls', 'Sterile cotton, 100pcs', 1, '2026-02-15 11:25:21'),
(28, 'Gauze Pads', 'Sterile gauze, pack of 25', 1, '2026-02-15 11:25:21'),
(29, 'Medical Gloves', 'Latex-free disposable gloves', 1, '2026-02-15 11:25:21'),
(30, 'Pulse Oximeter', 'Fingertip pulse oximeter', 1, '2026-02-15 11:25:21'),
(31, 'Basketball', 'Official size indoor/outdoor ball', 1, '2026-02-15 11:25:21'),
(32, 'Soccer Ball', 'Professional ball, size 5', 1, '2026-02-15 11:25:21'),
(33, 'Yoga Mat', 'Non-slip mat with strap', 1, '2026-02-15 11:25:21'),
(34, 'Dumbbells - 5kg', 'Pair of rubber dumbbells', 1, '2026-02-15 11:25:21'),
(35, 'Jump Rope', 'Adjustable speed fitness rope', 1, '2026-02-15 11:25:21'),
(36, 'Tennis Racket', 'Lightweight racket with grip', 1, '2026-02-15 11:25:21'),
(37, 'Swimming Goggles', 'Anti-fog swimming goggles', 1, '2026-02-15 11:25:21'),
(38, 'Resistance Bands', 'Set of 5 with handles', 1, '2026-02-15 11:25:21'),
(39, 'Water Bottle - 1L', 'Sports flip cap bottle', 1, '2026-02-15 11:25:21'),
(40, 'Badminton Set', '2 rackets and shuttlecocks', 1, '2026-02-15 11:25:21'),
(41, 'Office Chair', 'Ergonomic lumbar support chair', 1, '2026-02-15 11:25:21'),
(42, 'Computer Desk', 'Modern desk with storage', 1, '2026-02-15 11:25:21'),
(43, 'Bookshelf', 'Wooden 5-tier bookshelf', 1, '2026-02-15 11:25:21'),
(44, 'Filing Cabinet', '3-drawer metal cabinet', 1, '2026-02-15 11:25:21'),
(45, 'Conference Table', 'Large table for 8 people', 1, '2026-02-15 11:25:21'),
(46, 'Whiteboard - 4x6', 'Magnetic with marker tray', 1, '2026-02-15 11:25:21'),
(47, 'Storage Cabinet', 'Lockable cabinet with shelves', 1, '2026-02-15 11:25:21'),
(48, 'Reception Desk', 'Professional desk with counter', 1, '2026-02-15 11:25:21'),
(49, 'Meeting Chair Set', 'Set of 4 stackable chairs', 1, '2026-02-15 11:25:21'),
(50, 'Display Cabinet', 'Glass cabinet with lighting', 1, '2026-02-15 11:25:21');

-- --------------------------------------------------------

--
-- Table structure for table `productstock`
--

CREATE TABLE `productstock` (
  `ps_id` int(11) NOT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `ps_quantity` int(11) DEFAULT NULL,
  `ps_updatedat` datetime DEFAULT NULL,
  `ps_status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productstock`
--

INSERT INTO `productstock` (`ps_id`, `Prod_ID`, `ps_quantity`, `ps_updatedat`, `ps_status`) VALUES
(1, 1, 100, '2026-02-15 19:25:21', 1),
(2, 2, 50, '2026-02-15 19:25:21', 1),
(3, 3, 75, '2026-02-15 19:25:21', 1),
(4, 4, 60, '2026-02-15 19:25:21', 1),
(5, 5, 40, '2026-02-15 19:25:21', 1),
(6, 6, 80, '2026-02-15 19:25:21', 1),
(7, 7, 90, '2026-02-15 19:25:21', 1),
(8, 8, 20, '2026-02-15 19:25:21', 1),
(9, 9, 200, '2026-02-15 19:25:21', 1),
(10, 10, 45, '2026-02-15 19:25:21', 1),
(11, 11, 30, '2026-02-15 19:25:21', 1),
(12, 12, 100, '2026-02-15 19:25:21', 1),
(13, 13, 20, '2026-02-15 19:25:21', 1),
(14, 14, 15, '2026-02-15 19:25:21', 1),
(15, 15, 10, '2026-02-15 19:25:21', 1),
(16, 16, 25, '2026-02-15 19:25:21', 1),
(17, 17, 35, '2026-02-15 19:25:21', 1),
(18, 18, 65, '2026-02-15 19:25:21', 1),
(19, 19, 85, '2026-02-15 19:25:21', 1),
(20, 20, 40, '2026-02-15 19:25:21', 1),
(21, 21, 15, '2026-02-15 19:25:21', 1),
(22, 22, 20, '2026-02-15 19:25:21', 1),
(23, 23, 10, '2026-02-15 19:25:21', 1),
(24, 24, 500, '2026-02-15 19:25:21', 1),
(25, 25, 100, '2026-02-15 19:25:21', 1),
(26, 26, 150, '2026-02-15 19:25:21', 1),
(27, 27, 120, '2026-02-15 19:25:21', 1),
(28, 28, 80, '2026-02-15 19:25:21', 1),
(29, 29, 200, '2026-02-15 19:25:21', 1),
(30, 30, 15, '2026-02-15 19:25:21', 1),
(31, 31, 20, '2026-02-15 19:25:21', 1),
(32, 32, 25, '2026-02-15 19:25:21', 1),
(33, 33, 30, '2026-02-15 19:25:21', 1),
(34, 34, 15, '2026-02-15 19:25:21', 1),
(35, 35, 40, '2026-02-15 19:25:21', 1),
(36, 36, 10, '2026-02-15 19:25:21', 1),
(37, 37, 25, '2026-02-15 19:25:21', 1),
(38, 38, 35, '2026-02-15 19:25:21', 1),
(39, 39, 60, '2026-02-15 19:25:21', 1),
(40, 40, 12, '2026-02-15 19:25:21', 1),
(41, 41, 8, '2026-02-15 19:25:21', 1),
(42, 42, 5, '2026-02-15 19:25:21', 1),
(43, 43, 6, '2026-02-15 19:25:21', 1),
(44, 44, 10, '2026-02-15 19:25:21', 1),
(45, 45, 3, '2026-02-15 19:25:21', 1),
(46, 46, 15, '2026-02-15 19:25:21', 1),
(47, 47, 10, '2026-02-15 19:25:21', 1),
(48, 48, 2, '2026-02-15 19:25:21', 1),
(49, 49, 8, '2026-02-15 19:25:21', 1),
(50, 50, 4, '2026-02-15 19:25:21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `pi_id` int(11) NOT NULL,
  `Prod_ID` int(11) DEFAULT NULL,
  `pi_imagepath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`pi_id`, `Prod_ID`, `pi_imagepath`) VALUES
(1, 1, 'https://www.bizasiatrading.com/cdn/shop/products/FLEX-STICK-BALLPEN-BLUE-0.5_720x.jpg?v=1592152976'),
(2, 2, 'https://m.media-amazon.com/images/I/718vM+75UNL._SL1500_.jpg'),
(3, 3, 'https://m.media-amazon.com/images/I/71GKp97203L._AC_SL1500_.jpg'),
(4, 4, 'https://digitalcontent.api.tesco.com/v2/media/marketplace/5d565a61-ff9c-4e06-b8d9-adcf5abdf35b/1jQiMcY7U4-gxhGV6bhHWFqdY_2032453376.jpeg?h=960&w=960'),
(5, 5, 'https://www.ikea.com/ph/en/images/products/maerkbart-scissors-set-of-2__0711774_pe728443_s5.jpg?f=xxxl'),
(6, 6, 'https://officeworks-dcn.sgp1.digitaloceanspaces.com/2021/10/Crayola-24-colours-.jpg'),
(7, 7, 'https://hbw.ph/wp-content/uploads/2017/10/EA-2100D-scaled.jpg'),
(8, 8, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
(9, 9, 'https://m.media-amazon.com/images/I/61J0dJ+dj3L._AC_SL1500_.jpg'),
(10, 10, 'https://m.media-amazon.com/images/I/71DBNc6dShL._AC_SL1500_.jpg'),
(11, 11, 'https://m.media-amazon.com/images/I/71ORqgJajrL._AC_SL1500_.jpg'),
(12, 12, 'https://m.media-amazon.com/images/I/718qI9yXt1L._AC_SL1500_.jpg'),
(13, 13, 'https://down-ph.img.susercontent.com/file/ph-11134207-81ztq-mhbc0q6ve3gpa2.webp'),
(14, 14, 'https://m.media-amazon.com/images/I/71FW6VD2nML._AC_SL400_.jpg'),
(15, 15, 'https://markslojd.com/cdn/shop/files/108453_architect_100_e75065ea-3f3d-4e61-ac66-a15751af3ba2.webp?v=1762869857'),
(16, 16, 'https://www.mrprice.online/cdn/shop/files/mrprice-online-stationery-default-title-casio-fx83gtcw-pink-scientific-calculator-54939055194448_1400x.jpg?v=1742816266'),
(17, 17, 'https://down-ph.img.susercontent.com/file/ph-11134207-7r98o-lwaxig9jxf5wff'),
(18, 18, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRK9tXIHSGQXioFdrEQMk7tSii4nsMU8cqYUi3Br6nQymRNWBH1ry_zw6iVLffpkcS2ip_ARpQhobzkAKSQtRLXwM50QYcwLEYVhE1vtGewJCfir8Q8kkyN'),
(19, 19, 'https://www.officewarehouse.com.ph/__resources/_web_data_/products/products/image_gallery/10571-A.jpg'),
(20, 20, 'https://foodpanda.dhmedia.io/image/darsktores-ph/nonfood/200000269054.jpg?height=480'),
(21, 21, 'https://down-ph.img.susercontent.com/file/ph-11134207-7r98u-lq8s80ef99ov8e'),
(22, 22, 'https://i.ebayimg.com/images/g/hIYAAOSw~1Newy7-/s-l1200.jpg'),
(23, 23, 'https://medias.watsons.com.ph/publishing/WTCPH-50001708-front-zoom.jpg?version=1734070157'),
(24, 24, 'https://technopackcorp.com/cdn/shop/products/JORESTECH-RESPIRATORY-FACEMASKS-MK-3PLY-GB-H-01copy_1600x1600.png?v=1630012769'),
(25, 25, 'https://enfant.com.ph/cdn/shop/files/d453c0ed98add424fd81d8d244e4b5ac.jpg?v=1724403442&width=1445'),
(26, 26, 'https://img.uline.com/is/image/uline/S-7036?$Mobile_Zoom$'),
(27, 27, 'https://shopsuki.ph/cdn/shop/files/10_40ca2831-412b-452f-8d82-85330f524eff_800x.png?v=1709277056'),
(28, 28, 'https://medsgo.ph/images/detailed/30/GauzePad2x2.png'),
(29, 29, 'https://m.media-amazon.com/images/I/71I4ttEIZ0L._AC_SL1500_.jpg'),
(30, 30, 'https://medias.watsons.com.ph/publishing/WTCPH-50002863-front-zoom.jpg?version=1734049552'),
(31, 31, 'https://www.molten.com.ph/on/demandware.static/-/Sites-masterCatalog_molten/default/dwdfb3b79d/images/molten-new3/B7G3800-Q5Z-5.jpg'),
(32, 32, 'https://bootcamp.com.ph/cdn/shop/files/AURORA_HV6335-100_PHSBZ001-2000.jpg?v=1757047881'),
(33, 33, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'),
(34, 34, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'),
(35, 35, 'https://chrissports.com/cdn/shop/products/Fitness_and_Athletics_Speed_Rope_2400x_86f63332-58d9-42ae-88df-7713858ee61b_800x.jpg?v=1641734419'),
(36, 36, 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400'),
(37, 37, 'https://contents.mediadecathlon.com/m17985908/k$f0abfdbcf4fbcf595e2448a13e27d6fc/view-swipe-anti-fog-swim-goggles-view-d3c5fec0-d353-4557-a204-aac2097f8036.jpg'),
(38, 38, 'https://www.jbsports.com.ph/__resources/webdata/images/products/778.jpg'),
(39, 39, 'https://m.media-amazon.com/images/I/71sB7UpGfDL._AC_UF894,1000_QL80_.jpg'),
(40, 40, 'https://image.made-in-china.com/2f0j00LKTYtAbcOQoD/2-Player-Badminton-Racquets-Set-Carbon-Shaft-Light-Weight-Badminton-Racket-Set-with-1-Carrying-Bag.webp'),
(41, 41, 'https://images-cdn.ubuy.co.in/65fef056cfc0621f5700099a-ergonomic-mesh-office-chair-high-back.jpg'),
(42, 42, 'https://joebz.com/cdn/shop/products/Screenshot_57_1024x1024.png?v=1669441121'),
(43, 43, 'https://m.media-amazon.com/images/I/61+RM1n0lqL._AC_UF894,1000_QL80_.jpg'),
(44, 44, 'https://m.media-amazon.com/images/I/61pei4f+0sL.jpg'),
(45, 45, 'https://images.thdstatic.com/productImages/7bdae07c-6f15-4cb9-bf34-6de8f2c712dc/svn/white-byblight-executive-desks-bb-ry0111hy-mt-1f_600.jpg'),
(46, 46, 'https://fpmediasb.com.my/wp-content/uploads/wbwds.jpg'),
(47, 47, 'https://www.lyonworkspace.com/wp-content/uploads/lyon-1200-series-standard-storage-cabinet.jpg'),
(48, 48, 'https://modernofficetabledesigns.ph/wp-content/uploads/2022/06/Reception-Desk-Od-94-1200x1200.jpg'),
(49, 49, 'https://images.thdstatic.com/productImages/2421fb51-5dfe-4c75-925d-c340edcc1992/svn/black-gymax-guest-office-chairs-gym09602-64_1000.jpg?odnHeight=117&odnWidth=117&odnBg=FFFFFF'),
(50, 50, 'https://metrodisplay.com.au/wp-content/uploads/2017/03/MSC-243_B_Large-451x600.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `proof_of_payment`
--

CREATE TABLE `proof_of_payment` (
  `pof_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `pof_imagepath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_address`
--

CREATE TABLE `shipping_address` (
  `sa_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sa_barangay` varchar(100) DEFAULT NULL,
  `sa_municipality` varchar(100) DEFAULT NULL,
  `sa_province` varchar(100) DEFAULT NULL,
  `sa_zipcode` varchar(20) DEFAULT NULL,
  `sa_housenumber` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `soi_status`
--

CREATE TABLE `soi_status` (
  `sois_id` int(11) NOT NULL,
  `soi_id` int(11) DEFAULT NULL,
  `sois_status` enum('Pending','Approved','Disapproved') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `so_items`
--

CREATE TABLE `so_items` (
  `soi_id` int(11) NOT NULL,
  `so_id` int(11) DEFAULT NULL,
  `soi_productname` varchar(255) DEFAULT NULL,
  `soi_product_description` text DEFAULT NULL,
  `soi_productpicture` varchar(255) DEFAULT NULL,
  `soi_productquantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `special_orders`
--

CREATE TABLE `special_orders` (
  `so_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `so_total` decimal(10,2) DEFAULT NULL,
  `so_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_FN` varchar(100) DEFAULT NULL,
  `user_LN` varchar(100) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_isVerified` tinyint(1) DEFAULT 0,
  `user_isActive` tinyint(1) DEFAULT 1,
  `user_createdat` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `Prod_ID` (`Prod_ID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`Cat_ID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `orderstatus`
--
ALTER TABLE `orderstatus`
  ADD PRIMARY KEY (`os_id`),
  ADD KEY `oi_id` (`oi_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`oi_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `Prod_ID` (`Prod_ID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD PRIMARY KEY (`PC_ID`),
  ADD KEY `Prod_ID` (`Prod_ID`),
  ADD KEY `Cat_ID` (`Cat_ID`);

--
-- Indexes for table `productprice`
--
ALTER TABLE `productprice`
  ADD PRIMARY KEY (`PP_ID`),
  ADD KEY `Prod_ID` (`Prod_ID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`Prod_ID`);

--
-- Indexes for table `productstock`
--
ALTER TABLE `productstock`
  ADD PRIMARY KEY (`ps_id`),
  ADD KEY `Prod_ID` (`Prod_ID`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`pi_id`),
  ADD KEY `Prod_ID` (`Prod_ID`);

--
-- Indexes for table `proof_of_payment`
--
ALTER TABLE `proof_of_payment`
  ADD PRIMARY KEY (`pof_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `shipping_address`
--
ALTER TABLE `shipping_address`
  ADD PRIMARY KEY (`sa_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `soi_status`
--
ALTER TABLE `soi_status`
  ADD PRIMARY KEY (`sois_id`),
  ADD KEY `soi_id` (`soi_id`);

--
-- Indexes for table `so_items`
--
ALTER TABLE `so_items`
  ADD PRIMARY KEY (`soi_id`),
  ADD KEY `so_id` (`so_id`);

--
-- Indexes for table `special_orders`
--
ALTER TABLE `special_orders`
  ADD PRIMARY KEY (`so_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `Cat_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderstatus`
--
ALTER TABLE `orderstatus`
  MODIFY `os_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `oi_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productcategory`
--
ALTER TABLE `productcategory`
  MODIFY `PC_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `productprice`
--
ALTER TABLE `productprice`
  MODIFY `PP_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `productstock`
--
ALTER TABLE `productstock`
  MODIFY `ps_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `product_image`
--
ALTER TABLE `product_image`
  MODIFY `pi_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `proof_of_payment`
--
ALTER TABLE `proof_of_payment`
  MODIFY `pof_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping_address`
--
ALTER TABLE `shipping_address`
  MODIFY `sa_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `soi_status`
--
ALTER TABLE `soi_status`
  MODIFY `sois_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `so_items`
--
ALTER TABLE `so_items`
  MODIFY `soi_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `special_orders`
--
ALTER TABLE `special_orders`
  MODIFY `so_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `orderstatus`
--
ALTER TABLE `orderstatus`
  ADD CONSTRAINT `orderstatus_ibfk_1` FOREIGN KEY (`oi_id`) REFERENCES `order_items` (`oi_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`);

--
-- Constraints for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD CONSTRAINT `productcategory_ibfk_1` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`),
  ADD CONSTRAINT `productcategory_ibfk_2` FOREIGN KEY (`Cat_ID`) REFERENCES `category` (`Cat_ID`);

--
-- Constraints for table `productprice`
--
ALTER TABLE `productprice`
  ADD CONSTRAINT `productprice_ibfk_1` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`);

--
-- Constraints for table `productstock`
--
ALTER TABLE `productstock`
  ADD CONSTRAINT `productstock_ibfk_1` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`);

--
-- Constraints for table `product_image`
--
ALTER TABLE `product_image`
  ADD CONSTRAINT `product_image_ibfk_1` FOREIGN KEY (`Prod_ID`) REFERENCES `products` (`Prod_ID`);

--
-- Constraints for table `proof_of_payment`
--
ALTER TABLE `proof_of_payment`
  ADD CONSTRAINT `proof_of_payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`);

--
-- Constraints for table `shipping_address`
--
ALTER TABLE `shipping_address`
  ADD CONSTRAINT `shipping_address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `soi_status`
--
ALTER TABLE `soi_status`
  ADD CONSTRAINT `soi_status_ibfk_1` FOREIGN KEY (`soi_id`) REFERENCES `so_items` (`soi_id`);

--
-- Constraints for table `so_items`
--
ALTER TABLE `so_items`
  ADD CONSTRAINT `so_items_ibfk_1` FOREIGN KEY (`so_id`) REFERENCES `special_orders` (`so_id`);

--
-- Constraints for table `special_orders`
--
ALTER TABLE `special_orders`
  ADD CONSTRAINT `special_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
