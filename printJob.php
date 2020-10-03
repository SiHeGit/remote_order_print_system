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
        private $enablePrinter = False; // only for development purposes
        private $pid = 0;

        /**
         * constructor
         */
        public function __construct(){
            $failure = False;

            do {
                try {
                    $this->pid = getmypid();
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

            try {
                // prepare statements
                parent::preparation("orderUnit", "SELECT id_orderunit FROM public.orderunit WHERE readytoprint = true AND printtime is NULL");
                parent::preparation("order", "SELECT amount, menu_id FROM public.order WHERE orderunit_id = $1");
                parent::preparation("orderUnitUpdate", "UPDATE orderunit SET printtime = $1 WHERE id_orderunit = $2");

                while(True){

                    try {               

                        $notify = pg_get_notify($this->dbconn); // get notify
                        if (!$notify) {
                            
                            // nothing to do
                            print_r("nothing to do... (PID: " . $this->pid . ")\n");
        
                        } else {
                            print_r($notify);


                            if($this->enablePrinter){
                                $connector = new NetworkPrintConnector("192.168.0.224", 9100);
                                $printer = new Printer($connector);
                            }

                            $resultOrderUnit = parent::execution("orderUnit", array());

                            while ($id_orderunit = pg_fetch_row($resultOrderUnit)) {
        
                                $resultOrder = parent::execution("order", array($id_orderunit[0]));
        
                                while ($orderData = pg_fetch_row($resultOrder)) {
                                    
                                    if($this->enablePrinter){
                                        // Initialize
                                        $printer -> initialize(); // resets formatting back to the defaults
                                        $printer -> setJustification(Printer::JUSTIFY_CENTER); // justification
                                    }                                    
        
                                    for ($i = 0; $i < $orderData[0]; $i++) { // print out data
                                        print_r("printing order: " . $orderData[1]. "\n");
                                        if($this->enablePrinter){
                                            $printer -> text($orderData[1]."\n");
                                            $printer -> cut();
                                        }
                                    }
                                }

                                // update database
                                parent::execution("orderUnitUpdate", array(date('Y-m-d H:i:s'), $id_orderunit[0]));
                            }

                            if($this->enablePrinter){
                                $printer -> close();
                            }
                        }

                    } catch (Exception $e) {
                        print_r("Exception occured!\nMessage: " . $e->getMessage(). "\n");
                    }

                    sleep(1);
                }
            } catch (Exception $e) {
                print_r("Exception occured! Script dies!\nMessage: " . $e->getMessage(). "\n");
            }


        
        }

    }

    $obj = new PrintJob();
    $obj->run();

?>