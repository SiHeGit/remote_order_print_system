<?php

    /**
     * Script is used to print out the data from the database.
     */

    // include class
    include 'dbconnection.php';

    require __DIR__ . '/composer/vendor/autoload.php';
	
	use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
	use Mike42\Escpos\Printer;
	use Mike42\Escpos\EscposImage;
  
    // configuration of the error reporting (deactivate error reporting if the program goes to production because of security reasons)
    error_reporting(-1); // 0 = deactivate error reporting completely, -1 (E_ALL) = acitvate error reporting
  
    class PrintJob extends DBConnection{

        // constructor
        public function __construct(){
            parent::__construct();
        }
        
        // run() to execute job
        public function run(){

            $dbconn = parent::getConnection();

            $resut = parent::executePgQuery('LISTEN printChannel;');
            // $resut = parent::executePgQuery('LISTEN category_changed;');

            // parent::executePgQuery("NOTIFY category_changed, 'foo';");

            $notify = 0;
            // while(!$notify){
            while(True){
                $notify = pg_get_notify($dbconn); // get notify must be while a connection is acitve!
                if (!$notify) {

                    
                    // nothing to do
                    print_r("nothing to do...\n");

                } else {
                    print_r($notify);

                    $query = "SELECT id_orderunit FROM public.orderunit WHERE readytoprint = true";
                    $resultOrderUnit = parent::executePgQuery($query);

                    while ($id_orderunit = pg_fetch_row($resultOrderUnit)) {

                        $query = "SELECT amount, menu_id FROM public.order WHERE orderunit_id = '" . $id_orderunit[0] . "'";
                        $resultOrder = parent::executePgQuery($query);

                        // $orderData = pg_fetch_row($resultOrder);

                        while ($orderData = pg_fetch_row($resultOrder)) {

                            $connector = new NetworkPrintConnector("192.168.0.224", 9100);
                            $printer = new Printer($connector);
                            
                            /* Initialize */
                            $printer -> initialize(); // resets formatting back to the defaults
                            $printer -> setJustification(Printer::JUSTIFY_CENTER); // justification

                            for ($i = 0; $i < $orderData[0]; $i++) { // print out data
                                print_r("printing order: " . $orderData[1]. "\n");
                                $printer -> text($orderData[1]."\n");
                                $printer -> cut();
                            }

                            $printer -> close();
                        }

                        
                    }


                    // $orderList = $this->getOrderList();
	
					// foreach ($data as &$element) {
					// 	$id = $element->id;
					// 	$amount = $element->amount;

					// 	$item = $orderList->itemList[$id]["item"]; // get item from array
						
	
						// for ($i = 0; $i < $amount; $i++) {
	
							// // print items
							// $printer -> text($item."\n");
							// $printer -> cut();
	
						// }
					// }
					
					
                }
                sleep(1);
            }
        
        }

    }

    $obj = new PrintJob();
    $obj->run();

?>