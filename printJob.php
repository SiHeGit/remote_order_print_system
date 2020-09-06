<?php

    /**
     * Script is used to print out the data from the database.
     */

    // include class
    include 'dbconnection.php';
  
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

            // $result = parent::executePgQuery('LISTEN channel;');
            $result = parent::executePgQuery('LISTEN category_changed;');

            // parent::executePgQuery("INSERT INTO category VALUES ('7', 'query')");

            // parent::executePgQuery("NOTIFY category_changed, 'foo';");

            $notify = 0;
            while(!$notify){
                $notify = pg_get_notify($dbconn); // get notify must be while a connection is acitve!
                if (!$notify) {
                    echo "No messages\n";

                    // $query = "UPDATE category SET (name) = ('neu') WHERE id_category = '1'";
                } else {
                    print_r($notify);
                }
                sleep(1);
            }
        
        }

    }

    $obj = new PrintJob();
    $obj->run();

?>