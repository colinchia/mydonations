/* 
  Create the `mydonations` database.
  Set up a starter table to work from.
*/
CREATE DATABASE IF NOT EXISTS `mydonations`;
USE `mydonations`;

-- Create starter table `donation`
DROP TABLE IF EXISTS `donation`;
CREATE TABLE `donation` (
    `id` int NOT NULL AUTO_INCREMENT,
    `donor_name` varchar(255) NOT NULL,
    `donor_email` varchar(255) NOT NULL,
    `donor_comments` mediumtext,
    `donation_currency` char(3) NOT NULL,
    `donation_amount` decimal(10,2) NOT NULL,
    `transaction_id` varchar(255) NOT NULL,
    `transaction_mode` varchar(255) NOT NULL,
    `transaction_status` varchar(255) NOT NULL,
    `request` longtext NOT NULL,
    `response` longtext NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
