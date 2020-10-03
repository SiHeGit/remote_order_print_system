<?php

	/**
	 * Script to set data into the database
	 */

	// include class
    include 'dbconnection.php';

    // configuration of the error reporting (deactivate error reporting if the program goes to production because of security reasons)
    error_reporting(-1); // 0 = deactivate error reporting completely, -1 (E_ALL) = acitvate error reporting


	class DatabaseSet extends DBConnection {

		/**
         * constructor
         */
		public function __construct(){
            parent::checkPOSTRequestMethod();
            try{
                parent::__construct();
            } catch (Exception $e) {
                // currently do nothing if a connection is not established
            }
        }

        /**
         * set data to the database
         */
		public function setData(){

            $json = file_get_contents('php://input');
            $data = json_decode($json);

            $obj = new \stdClass(); // create a new object (JSON)

            try{

                // $result = pg_query("NOTIFY channel, 'new values';");
        
                // possible queries:
                // 1. INSERT INTO public.menu (id_menu, price, category_id) VALUES ('Pommes', '2.5', 'food')
                // 2. INSERT INTO public.waiter (id_waiter, name, password) VALUES ('def', 'default', '1234')
                // 3. INSERT INTO public.orderunit (readytoprint, timestamp, waiter_id, tableno, printtime) VALUES ('false', '1999-01-08 04:05:06', 'def', '2', '1999-01-08 04:05:06')
                // 4. INSERT INTO public.order (amount, paid, orderunit_id, menu_id) VALUES ('1', '0', '2', 'Pommes')
                
                // create new order unit
                parent::preparation("", "INSERT INTO orderunit (readytoprint, timestamp, waiter_id, tableno, printtime) VALUES ($1, $2, $3, $4, $5) RETURNING id_orderunit");
                $result = parent::execution("", array('true', date('Y-m-d H:i:s'), 'def', '1', NULL));
                $id = pg_fetch_row($result)[0]; // get first element of array

                parent::preparation("storeData", "INSERT INTO public.order (amount, paid, orderunit_id, menu_id) VALUES ($1, $2, $3, $4)");

                foreach ($data as &$element) {
                    $item = $element->item;
                    $amount = $element->amount;

                    settype($item, 'string');
                    settype($amount, 'integer');
                    
                    parent::execution("storeData", array($amount, '0', $id, $item));
                }

                // notify print job
                $result = parent::executePgQuery("NOTIFY printChannel, 'ready';");


                $obj->state = "success";
                $obj->message = "Speichern erfolgreich!";

            } catch (Exception $e) {
                $obj->state = "failure";
                $obj->message = $e->getMessage();
            }

            echo json_encode($obj);

		}

	}

	$obj = new DatabaseSet();
	$obj->setData();

?>
