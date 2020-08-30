<?php

	require __DIR__ . '/composer/vendor/autoload.php';
	
	use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
	use Mike42\Escpos\Printer;
	use Mike42\Escpos\EscposImage;

	class PrinterClass {

		function __construct(){
			// parent::__construct();
		}

		public function sendData(){

			if ($_SERVER["REQUEST_METHOD"] == "POST") {

				$json = file_get_contents('php://input');
				$data = json_decode($json);
	
	
				// $test = count($data);
	
				// if(isset($_POST["item"])){
	
				// 	$text = $_POST["item"];
				$obj = new \stdClass(); // create a new object (JSON)
	
				try{
	
					$connector = new NetworkPrintConnector("192.168.0.224", 9100);
					$printer = new Printer($connector);
	
					/* Initialize */
					$printer -> initialize(); // resets formatting back to the defaults
					$printer -> setJustification(Printer::JUSTIFY_CENTER); // justification

					$orderList = $this->getOrderList();
	
					foreach ($data as &$element) {
						$id = $element->id;
						$amount = $element->amount;

						$item = $orderList->itemList[$id]["item"]; // get item from array
						
	
						for ($i = 0; $i < $amount; $i++) {
	
							// print items
							$printer -> text($item."\n");
							$printer -> cut();
	
						}
					}
					
					$printer -> close();
	
	
					$obj->state = "success";
					// $obj->state = "failure";
					$obj->message = "Drucken erfolgreich!";
	
				} catch (Exception $e) {
					$obj->state = "failure";
					$obj->message = $e->getMessage();
				}
	
				echo json_encode($obj);
	
				// }
			}
			else{
				// include 'currentOrder.html';
	
				$obj = $this->getOrderList();
	
				$json = json_encode($obj);
				echo $json;
	
			}

		}

		private function getOrderList(){

			// Category:
			// 0 = food
			// 1 = drinks
			// 2 = other
			// 3 = special requests (Sonderwünsche)

			$obj = new \stdClass(); // create a new object (JSON)
			$obj->itemList = array(
				array(
					"id" => 0,
					"category" => 0,
					"item" => "Rote Wurst",
					"price" => "2.50"
				),
				array(
					"id" => 1,
					"category" => 0,
					"item" => "Pommes",
					"price" => "2.00"
				),
				array(
					"id" => 2,
					"category" => 0,
					"item" => "Curry Wurst",
					"price" => "3.50"
				),
				array(
					"id" => 3,
					"category" => 0,
					"item" => "Burger",
					"price" => "5.00"
				),
				array(
					"id" => 4,
					"category" => 0,
					"item" => "Finger Food Klassiker",
					"price" => "4.00"
				),
				array(
					"id" => 5,
					"category" => 1,
					"item" => "Wasser",
					"price" => "1.80"
				),
				array(
					"id" => 6,
					"category" => 1,
					"item" => "Spezi",
					"price" => "2.00"
				)
			);

			return $obj;

		}

	}

	$obj = new PrinterClass();
	$obj->sendData();

?>
