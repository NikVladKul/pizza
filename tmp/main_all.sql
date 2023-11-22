CREATE DATABASE  IF NOT EXISTS `main` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `main`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: main
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `passw` varchar(100) DEFAULT NULL,
  `activ` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'root','nikvlad',1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `img` varchar(500) DEFAULT NULL,
  `description` text,
  `activ` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Пицца',NULL,'Пицца нашей пекарни',1),(2,'Ролы',NULL,'Наши ролы',1),(3,'Пирожки',NULL,NULL,1),(4,'Торты',NULL,NULL,1),(5,'Напитки',NULL,NULL,1),(6,'Оружие',NULL,NULL,1),(7,'Женщины',NULL,NULL,1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) DEFAULT NULL,
  `img` varchar(500) DEFAULT NULL,
  `description` text,
  `cost` int DEFAULT NULL,
  `category` int DEFAULT NULL,
  `activ` tinyint DEFAULT NULL,
  `stock` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'Пицца-1','/img/pizza-1.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',200,1,1,0),(2,'Пицца-2','/img/pizza-2.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку.<br> Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',220,1,1,0),(3,'Пицца-3','/img/pizza-3.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',220,1,1,NULL),(4,'Пицца-4','/img/pizza-4.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',250,1,1,0),(5,'Пицца-5','/img/pizza-5.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',230,1,1,NULL),(6,'Пицца-6','/img/pizza-6.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',200,1,1,NULL),(7,'Пицца-7','/img/pizza-7.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',240,1,1,0),(8,'Пицца-8','/img/pizza-8.jpg','Пицца итальянская, изготовлена по традиционному рецепту из того что попалось повару под руку. Состав: какой-то соус, так себе тесто и чего-то сверху накрошили. Потом все это хорошенько запекли в духовке. И вы получаете прекрасную горячую пиццу!',280,1,1,1),(9,'Филадельфия','/img/roll-1.jpg',NULL,500,2,1,NULL),(10,'Унаги спайси','/img/2-roll.jpg',NULL,450,2,1,1),(11,'Сяке-Маке','/img/3-roll.jpg',NULL,440,2,1,NULL),(12,'Фудзи','/img/4-roll.jpg',NULL,400,2,1,NULL),(13,'Ясай Маки','/img/5-roll.jpg',NULL,420,2,1,NULL),(14,'Унаги Каппа','/img/6-roll.jpg',NULL,450,2,1,NULL),(15,'Бонито','/img/7-roll.jpg',NULL,480,2,1,NULL),(16,'С картошкой','/img/1-pie.jpg',NULL,50,3,1,1),(17,'С капустой','/img/2-pie.jpg',NULL,50,3,1,NULL),(18,'С тыквой','/img/3-pie.jpg',NULL,50,3,1,NULL),(19,'С мясом','/img/4-pie.jpg',NULL,60,3,1,NULL),(20,'С настоящим мясом','/img/5-pie.jpg',NULL,80,3,1,NULL),(21,'С баклажаними','/img/6-pie.jpg',NULL,100,3,1,NULL),(22,'С арбузом','/img/7-pie.jpg',NULL,150,3,1,NULL),(23,'С малиной','/img/8-pie.jpg',NULL,120,3,1,NULL),(24,'Араньягалуска','/img/1-cake.jpg',NULL,1500,4,1,NULL),(25,'Амандин','/img/2-cake.jpg',NULL,1600,4,1,NULL),(26,'Баттенберг','/img/3-cake.jpg',NULL,1200,4,1,NULL),(27,'Берлингоццо','/img/4-cake.jpg',NULL,1800,4,1,1),(28,'Боло де мел','/img/5-cake.jpg',NULL,2000,4,1,NULL),(29,'Broyé poitevin','/img/6-cake.jpg',NULL,900,4,1,NULL),(30,'Бубланина','/img/7-cake.jpg',NULL,1400,4,1,NULL);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `passw` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `addres` varchar(500) DEFAULT NULL,
  `activ` tinyint DEFAULT NULL,
  `isRoot` tinyint DEFAULT NULL,
  `isAdmin` tinyint DEFAULT NULL,
  `isCoock` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-21 15:26:02
