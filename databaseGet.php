<?php

	/**
	 * Script to get data from the database
	 */

	// include class
    include 'dbconnection.php';

    // configuration of the error reporting (deactivate error reporting if the program goes to production because of security reasons)
    error_reporting(-1); // 0 = deactivate error reporting completely, -1 (E_ALL) = acitvate error reporting


    class DatabaseGet extends DBConnection {

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
         * get data from the database
         */
		public function getData(){

            $obj = new \stdClass(); // create a new object (JSON)

            try {
                $sendData = array();
                
                parent::preparation("", "SELECT * FROM public.menu");
                $result =  parent::execution("", array());
    
                $data = pg_fetch_all($result);
    
                if(!empty($data)) { // check if data is available
                    
                    // mapping of the data for the app
                    foreach ($data as $k=>$v) { // get index k (primary key) and value v of the data
                        $sendData[$k] = array();
                        $sendData[$k]["category"] = $v["category_id"];
                        $sendData[$k]["item"] = $v["id_menu"];
                        $sendData[$k]["price"] = $v["price"];
                        
                    }
    
                    $obj->state = "success";
                } else {
                    $obj->state = "empty";
                }
                
                // create a json file
                $obj->itemList = $sendData;

            } catch (Exception $e) {
                $obj->state = "failure";
                $obj->message = $e->getMessage();
            }

            echo json_encode($obj);

		}

	}

	$obj = new DatabaseGet();
	$obj->getData();

?>
