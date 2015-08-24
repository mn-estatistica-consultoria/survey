# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.27)
# Database: sumo_survey
# Generation Time: 2015-08-24 16:17:38 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Guests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Guests`;

CREATE TABLE `Guests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) DEFAULT NULL,
  `ipAddress` varchar(32) DEFAULT '',
  `userAgent` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Guests` WRITE;
/*!40000 ALTER TABLE `Guests` DISABLE KEYS */;

INSERT INTO `Guests` (`id`, `uuid`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'a04c6a70-49bc-11e5-85d0-a3c44b3241ae','::ffff:127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:40.0) Gecko/20100101 Firefox/40.0','2015-08-23 12:30:19','2015-08-23 12:30:19',NULL),
	(2,'4e4844a0-4a7b-11e5-bd4e-8f66aae7ff59','::ffff:127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:40.0) Gecko/20100101 Firefox/40.0','2015-08-24 11:15:15','2015-08-24 11:15:15',NULL),
	(3,'62d18800-4a7b-11e5-bd4e-8f66aae7ff59','::ffff:127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:40.0) Gecko/20100101 Firefox/40.0','2015-08-24 11:15:50','2015-08-24 11:15:50',NULL);

/*!40000 ALTER TABLE `Guests` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table QuestionGuests
# ------------------------------------------------------------

DROP TABLE IF EXISTS `QuestionGuests`;

CREATE TABLE `QuestionGuests` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `QuestionId` int(11) unsigned DEFAULT NULL,
  `GuestId` int(11) unsigned DEFAULT NULL,
  `ResponseId` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `question_id` (`QuestionId`,`GuestId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `QuestionGuests` WRITE;
/*!40000 ALTER TABLE `QuestionGuests` DISABLE KEYS */;

INSERT INTO `QuestionGuests` (`id`, `QuestionId`, `GuestId`, `ResponseId`)
VALUES
	(11,1,1,9),
	(12,2,1,1),
	(13,8,1,39),
	(14,7,1,36),
	(15,6,1,27),
	(16,5,1,23),
	(17,1,2,10),
	(18,2,2,20),
	(19,8,2,37),
	(20,6,2,29),
	(21,7,2,36),
	(22,5,2,24),
	(23,1,3,10),
	(24,2,3,20),
	(25,7,3,34),
	(26,6,3,30),
	(27,5,3,22),
	(28,8,3,38);

/*!40000 ALTER TABLE `QuestionGuests` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Questions`;

CREATE TABLE `Questions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `text` text,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;

INSERT INTO `Questions` (`id`, `text`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'What is your favorite soda brand?','2015-08-20 12:51:33','2015-08-20 12:51:33',NULL),
	(2,'Who is your favorite actor?','2015-08-20 12:58:30','2015-08-23 15:00:44',NULL),
	(5,'Pick a number between 1 and 5','2015-08-24 10:59:51','2015-08-24 11:00:47',NULL),
	(6,'What is the best color?','2015-08-24 11:00:07','2015-08-24 11:00:07',NULL),
	(7,'This survey was useful.','2015-08-24 11:01:46','2015-08-24 11:01:46',NULL),
	(8,'Which city would you most like to live in?','2015-08-24 11:03:00','2015-08-24 11:03:00',NULL);

/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Responses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Responses`;

CREATE TABLE `Responses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `QuestionId` int(11) unsigned NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`QuestionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Responses` WRITE;
/*!40000 ALTER TABLE `Responses` DISABLE KEYS */;

INSERT INTO `Responses` (`id`, `QuestionId`, `text`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,2,'Brad Pitt','2015-08-23 10:37:42','2015-08-23 15:19:13',NULL),
	(2,2,'Tom Cruise','2015-08-23 11:10:00','2015-08-23 11:10:00',NULL),
	(3,3,'1','2015-08-23 11:10:35','2015-08-23 11:10:35',NULL),
	(4,3,'2','2015-08-23 11:10:39','2015-08-23 11:10:39',NULL),
	(5,3,'3','2015-08-23 11:10:44','2015-08-23 11:10:44',NULL),
	(6,3,'4+','2015-08-23 11:10:50','2015-08-23 11:10:50',NULL),
	(7,3,'I prefer not to answer','2015-08-23 11:11:01','2015-08-23 11:11:01',NULL),
	(8,1,'Coca-Cola','2015-08-23 11:42:08','2015-08-23 11:42:08',NULL),
	(9,1,'Pepsi','2015-08-23 11:43:14','2015-08-23 11:43:14',NULL),
	(10,1,'Dr. Pepper','2015-08-23 11:43:21','2015-08-23 11:43:21',NULL),
	(11,1,'RC Cola','2015-08-23 11:44:39','2015-08-23 11:44:39',NULL),
	(12,0,'Shasta','2015-08-23 11:46:15','2015-08-23 11:46:15',NULL),
	(13,1,'Sprite','2015-08-23 11:47:04','2015-08-23 11:47:04',NULL),
	(14,4,'1','2015-08-23 13:50:22','2015-08-23 13:50:22',NULL),
	(15,4,'2','2015-08-23 13:50:26','2015-08-23 13:50:26',NULL),
	(16,4,'3','2015-08-23 13:50:30','2015-08-23 13:50:30',NULL),
	(17,4,'4','2015-08-23 13:50:34','2015-08-23 13:50:34',NULL),
	(18,4,'5','2015-08-23 13:50:37','2015-08-23 13:50:37',NULL),
	(20,2,'Bill Murray','2015-08-23 22:54:10','2015-08-23 22:54:10',NULL),
	(21,5,'1','2015-08-24 11:00:24','2015-08-24 11:00:24',NULL),
	(22,5,'2','2015-08-24 11:00:28','2015-08-24 11:00:28',NULL),
	(23,5,'3','2015-08-24 11:00:31','2015-08-24 11:00:31',NULL),
	(24,5,'4','2015-08-24 11:00:38','2015-08-24 11:00:38',NULL),
	(25,5,'5','2015-08-24 11:00:42','2015-08-24 11:00:42',NULL),
	(26,6,'Red','2015-08-24 11:01:00','2015-08-24 11:01:00',NULL),
	(27,6,'Green','2015-08-24 11:01:05','2015-08-24 11:01:05',NULL),
	(28,6,'Blue','2015-08-24 11:01:09','2015-08-24 11:01:09',NULL),
	(29,6,'Yellow','2015-08-24 11:01:14','2015-08-24 11:01:14',NULL),
	(30,6,'Purple','2015-08-24 11:01:20','2015-08-24 11:01:20',NULL),
	(31,6,'Orange','2015-08-24 11:01:24','2015-08-24 11:01:24',NULL),
	(32,7,'Strongly disagree','2015-08-24 11:02:01','2015-08-24 11:02:01',NULL),
	(33,7,'Somewhat disagree','2015-08-24 11:02:10','2015-08-24 11:02:10',NULL),
	(34,7,'Neither agree nor disagree','2015-08-24 11:02:25','2015-08-24 11:02:25',NULL),
	(35,7,'Somewhat agree','2015-08-24 11:02:32','2015-08-24 11:02:32',NULL),
	(36,7,'Strongly agree','2015-08-24 11:02:40','2015-08-24 11:02:40',NULL),
	(37,8,'New York','2015-08-24 11:03:14','2015-08-24 11:03:14',NULL),
	(38,8,'Chicago','2015-08-24 11:03:19','2015-08-24 11:03:19',NULL),
	(39,8,'Los Angeles','2015-08-24 11:03:29','2015-08-24 11:03:41',NULL),
	(40,8,'Dallas','2015-08-24 11:03:47','2015-08-24 11:03:47',NULL);

/*!40000 ALTER TABLE `Responses` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
