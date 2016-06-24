DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `products`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(10) NOT NULL,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `role`  varchar(20) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `address` varchar(400) DEFAULT NUll,
  `city` varchar(30) DEFAULT NULL,
  `zip` int(10) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE `products` (
  `productId` varchar(10) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `productDescription` varchar(200) DEFAULT NULL,
  `product_group` varchar(20) DEFAULT NULL,
  PRIMARY KEY (productId)
);

insert into users (username, password, role, firstName) values ("jadmin","admin", "admin", "Jenny");



delete from products where productId='3';
delete from users where firstName='holly';
