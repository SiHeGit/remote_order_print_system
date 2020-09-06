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
            $this->dbconn = pg_connect("host=$host dbname=$database user=$pgUser password=$pgPassword") or die("Connection to database failed: " . pg_last_error(). "\n");
        }

        // executePgQuery() used to execute SQL query
        protected function executePgQuery($query) // execute SQL query
        {
            $result = pg_query($query) or die("Query could not be executed!\nError message: " . pg_last_error(). "\n");
            // pg_free_result($result); // free memory, needs to be specified if needed
            return $result;
        }

        // getConnection() used to get the reference of the database object
        protected function getConnection()
        {
            return $this->dbconn;
        }

    }
?>