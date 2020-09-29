/*
    created:        2020-04-13
    author:         S. Hennes
    description:    current order methods
*/

var currentOrderBill = currentOrderBill || {}; // creation of a namespace

currentOrderBill.class = (function() {

    // views *******************************************************************************************

    /**
     * create order bill page
     */
    var main = function() {
        currentOrder.class.clearContent();

        // header *****************************************
        document.getElementById("idHeader").innerText = "Rechnung"

    };

    // content methods *******************************************************************************************

    return { // definition of public methods
        main: main
    };

})();