-- phpMyAdmin SQL Dump
-- version 4.6.6deb4+deb9u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 30. Aug 2020 um 18:08
-- Server-Version: 10.1.45-MariaDB-0+deb9u1
-- PHP-Version: 7.0.33-0+deb9u9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `rops`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `category`
--

CREATE TABLE `category` (
  `ID` int(6) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `menu`
--

CREATE TABLE `menu` (
  `ID` int(6) NOT NULL,
  `categoryID` int(6) NOT NULL,
  `item` text NOT NULL,
  `price` double(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orderelement`
--

CREATE TABLE `orderelement` (
  `ID` int(6) NOT NULL,
  `menuID` int(6) NOT NULL,
  `orderunitID` int(6) NOT NULL,
  `amount` int(11) NOT NULL,
  `paid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orderunit`
--

CREATE TABLE `orderunit` (
  `ID` int(6) NOT NULL,
  `waiter` text NOT NULL,
  `tableNo` int(6) NOT NULL,
  `readyToPrint` tinyint(1) NOT NULL,
  `printTime` datetime NOT NULL,
  `timeStamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indizes für die Tabelle `orderelement`
--
ALTER TABLE `orderelement`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `orderunitID` (`orderunitID`),
  ADD KEY `menuID` (`menuID`);

--
-- Indizes für die Tabelle `orderunit`
--
ALTER TABLE `orderunit`
  ADD PRIMARY KEY (`ID`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`ID`);

--
-- Constraints der Tabelle `orderelement`
--
ALTER TABLE `orderelement`
  ADD CONSTRAINT `orderelement_ibfk_2` FOREIGN KEY (`orderunitID`) REFERENCES `orderunit` (`ID`),
  ADD CONSTRAINT `orderelement_ibfk_3` FOREIGN KEY (`menuID`) REFERENCES `menu` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
