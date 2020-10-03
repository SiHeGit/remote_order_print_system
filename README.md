# ROPS (Remote Order Print System)

## About
ROPS is a web-based application that allows you to manage orders in a restaurant or at an event. The order can be recorded, processed and sent to the kitchen by a front end on the Smartphone of the waiter. After sending the order, it is automatically printed out on a thermal POS printer.

## Hardware Setup
- Raspberry Pi (tested with Raspbian GNU/Linux 9 (stretch))
- ESC POS Printer (tested with Thermal Receipt Printer ZJ-8220)

## Software Setup
- nginx (or another webserver)
- PHP 7.0 or newer
- `json` (see [documentation](https://www.php.net/manual/en/book.json.php))
- `intl` (see [documentation](https://www.php.net/manual/en/book.intl.php))
- `zlib` (see [documentation](https://www.php.net/manual/en/book.zlib.php))
- `imagick` or `gd`

see also [ESC/POS Print Driver](https://github.com/mike42/escpos-php#escpos-print-driver-for-php)

## Objectives
The project is in the development stage. Following functions are still planned:
- Database system to store and restore orders
- Cronjobs to print out the orders depending on the database entries
- Front end to identify the waiter (e. g. login system)
- Front end to set up the menu (e. g. specific dishes and drinks)
- Front end to calculate the price and change of the current order

## Security Vulnerabilities
If you discover a security vulnerability within ROPS, please send me a message.

## License
ROPS is open-sourced software licensed under the MIT license.
