<?php

	/**
	 * Script to store and send data from the database
	 */

	// include class
    include 'dbconnection.php';


	class PrinterClass extends DBConnection {

		// constructor
		public function __construct(){
			parent::__construct();
        }

		public function sendData(){


			if ($_SERVER["REQUEST_METHOD"] == "POST" or True) {

				$json = file_get_contents('php://input');
                $data = json_decode($json);
                
				// $test = count($data);
	
				// if(isset($_POST["item"])){
	
				// 	$text = $_POST["item"];
				$obj = new \stdClass(); // create a new object (JSON)
	
				try{
    
                    // $result = pg_query("NOTIFY channel, 'new values';");
			
                    // possible queries:
                    // 1. INSERT INTO public.menu (id_menu, price, category_id) VALUES ('Pommes', '2.5', 'food')
                    // 2. INSERT INTO public.waiter (id_waiter, name, password) VALUES ('def', 'default', '1234')
                    // 3. INSERT INTO public.orderunit (readytoprint, timestamp, waiter_id, tableno, printtime) VALUES ('false', '1999-01-08 04:05:06', 'def', '2', '1999-01-08 04:05:06')
                    // 4. INSERT INTO public.order (amount, paid, orderunit_id, menu_id) VALUES ('1', '0', '2', 'Pommes')
                    
                    // create new order unit
                    $query = "INSERT INTO orderunit (readytoprint, timestamp, waiter_id, tableno, printtime) VALUES ('true', '2020-01-08 04:05:06', 'def', '2', '1999-01-08 04:05:06') RETURNING id_orderunit";
                    $result = parent::executePgQuery($query);
                    $id = pg_fetch_row($result)[0]; // get first element of array

                    // add order to order unit
                    $query = "INSERT INTO public.order (amount, paid, orderunit_id, menu_id) VALUES ('2', '0', '" . $id . "', 'Pommes')";
                    $result = parent::executePgQuery($query);

                    // notify print job
                    $result = parent::executePgQuery("NOTIFY printChannel, 'ready';");
	
	
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
