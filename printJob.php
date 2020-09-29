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

        private $dbconn;

        /**
         * constructor
         */
        public function __construct(){
            $failure = False;

            do {
                try {
                    $failure = False;
                    parent::__construct();
                    $this->dbconn = parent::getConnection();
                    $resut = parent::executePgQuery('LISTEN printChannel;'); // listen to channel
                    
                } catch (Exception $e) {
                    $failure = True;
                    print_r($e->getMessage());
                    print_r("...new try to reach the database\n");
                    sleep(1);
                }
            } while ($failure);
        }
        
        /**
         * execute periodically the job
         */
        public function run(){

            
            while(True){

                try {

                    $notify = pg_get_notify($this->dbconn); // get notify
                    if (!$notify) {
                        
                        // nothing to do
                        print_r("nothing to do...\n");
    
                    } else {
                        print_r($notify);

                        $connector = new NetworkPrintConnector("192.168.0.224", 9100);
                        $printer = new Printer($connector);
    
                        $query = "SELECT id_orderunit FROM public.orderunit WHERE readytoprint = true";
                        $resultOrderUnit = parent::executePgQuery($query);
    
                        while ($id_orderunit = pg_fetch_row($resultOrderUnit)) {
    
                            $query = "SELECT amount, menu_id FROM public.order WHERE orderunit_id = '" . $id_orderunit[0] . "'";
                            $resultOrder = parent::executePgQuery($query);
    
                            // $orderData = pg_fetch_row($resultOrder);
    
                            while ($orderData = pg_fetch_row($resultOrder)) {
                                
                                /* Initialize */
                                $printer -> initialize(); // resets formatting back to the defaults
                                $printer -> setJustification(Printer::JUSTIFY_CENTER); // justification
    
                                for ($i = 0; $i < $orderData[0]; $i++) { // print out data
                                    print_r("printing order: " . $orderData[1]. "\n");
                                    $printer -> text($orderData[1]."\n");
                                    $printer -> cut();
                                }
                            }
                        }

                        $printer -> close();
                    }

                } catch (Exception $e) {
                    print_r("Exception occured!\nMessage: " . $e->getMessage(). "\n");
                
                }

                sleep(1);
            }
        
        }

    }

    $obj = new PrintJob();
    $obj->run();

?>