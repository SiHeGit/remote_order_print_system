<?php

    /**
     * Script is used to create a database connection and to execute SQL queries.
     */

    class DBConnection
    {
        private $dbconn;

        // constructor
        function __construct(){
            $this->openConnection(); // check post condition
        }

        // destructor to close the connection when the object is destroyed
        public function __destruct(){
            if(!is_null($this->dbconn)){
                pg_close($this->dbconn);
            }
        }

        // openConnection() used to create a new connection
        protected function openConnection(){

            // include variables for db connection (not committed variable file with following variables: $host, $database, $pgUser, $pgPassword)
            include './vari.php';
            
            // connect to database
            $this->dbconn = pg_connect("host=$host dbname=$database user=$pgUser password=$pgPassword");
            $this->evaluateResult($this->dbconn, "Connection to database failed!");

        }

        // executePgQuery() used to execute SQL query
        protected function executePgQuery($query) { // execute SQL query
            $result = pg_query($this->dbconn, sprintf($query));
            $this->evaluateResult($result, "Query could not be executed!");
            // pg_free_result($result); // free memory, needs to be specified if needed
            return $result;
        }

        // generates a prepared statement with $name and $query
        // $name can be "" if the prepared state is only used once
        protected function preparation($name, $query) {
            $result = pg_prepare($this->dbconn, $name, $query);
            $this->evaluateResult($result, "Preparation of query not possible!");
            return $result;
        }

        // executes a prepared statement with $name and $parameter as array
        // $name can be "" if the prepared state is only used once
        protected function execution($name, $parameter) {
            $result = pg_execute($this->dbconn, $name, $parameter);
            $this->evaluateResult($result, "Execution of prepared statement not possible!");
            return $result;
        }

        // getConnection() used to get the reference of the database object
        protected function getConnection() {
            return $this->dbconn;
        }

        // check if a POST is used to request the script
        protected function checkPOSTRequestMethod(){
            if($_SERVER["REQUEST_METHOD"]=="POST") {
                return;
            } else {
                die();
            }
        }

        /***
         * check if result is valid or die
        */
        private function evaluateResult($result, $message){ 
            if (!$result) {
                if (error_reporting() == 0) {
                    throw new Exception(); // silent mode
                } else{
                    $error = pg_last_error($this->dbconn); // check if error is available
                    if (!empty($error)) {
                        throw new Exception($message."\n" . $error . "\n");
                    } else {
                        throw new Exception($message."\nNo detailed description available!\n");
                    }
                }
            }
        }

    }
?>