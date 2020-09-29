/*
    created:        2020-04-04
    author:         S. Hennes
    description:    current order methods
*/

var currentOrderMain = currentOrderMain || {}; // creation of a namespace

currentOrderMain.class = (function() {

    // views *******************************************************************************************

    /**
     * create main view
     */
    var main = function(){

        currentOrder.class.clearContent();
        createOrderMainHeader();

        if(listOfElements.length > 0){
            createOrderMainBody();
        } else{
            failureView();
        }
        
        createOrderMainFooter();

    };

    var failureView = function(){

        var div = document.createElement("div");
            div.innerText = currentOrder.class.getErrorMessage();
            div.style.color = "red";
            div.style.padding = "15px 15px 0px 15px"

        document.getElementById("idContentScroll").appendChild(div);
    }

    /**
     * generate content of the header
     */
    var createOrderMainHeader = function(){
        document.getElementById("idHeader").innerText = "Aktuelle Bestellung"
    };

    /**
     * generate content of the body
     */
    var createOrderMainBody = function(){
        // contentScroll *****************************************
        // create HTML item list page
        var tbl = document.createElement('table'); // create HTML table
        var btn;
        for (i = 0; i < listOfElements.length; i++) {

            var tr = document.createElement('tr'); // create new row
            tbl.appendChild(tr);

            var td = document.createElement('td'); // create new column
            var nobr = document.createElement('nobr');
                var spanSymbol = document.createElement('span');
                    spanSymbol.setAttribute("class", "iconLayoutSpaceRight");
                    spanSymbol.innerHTML = ICONSHOPPINGTROLLEY;
                    nobr.appendChild(spanSymbol);
                var spanText = document.createElement('span');
                    spanText.innerHTML = listOfElements[i].amount
                    spanText.setAttribute("id", "trolley".concat(i));
                    nobr.appendChild(spanText);
                td.appendChild(nobr);
            tr.appendChild(td);

            currentOrder.class.createHTMLButton(tr);

        }
        document.getElementById("idContentScroll").appendChild(tbl);

        // add event listener
        for (i = 0; i < listOfElements.length; i++) {
            var clickable = document.getElementById("item".concat(i));
            clickable.addEventListener('tap', addToTrolley);
            clickable.addEventListener('longtap', removeFromTrolley);
        }

    };

    /**
     * generate content of the header
     */
    var createOrderMainFooter = function() {
        // footer *****************************************
        btn = document.createElement("button");
            btn.setAttribute("id", "idNewOrder");
            btn.innerText = "Neue Bestellung";
            document.getElementById("idFooter").appendChild(btn);
        btn = document.createElement("button");
            btn.setAttribute("id", "idPay");
            btn.innerText = "Bezahlen";
            document.getElementById("idFooter").appendChild(btn);

        var clickable = document.getElementById("idNewOrder");
        clickable.addEventListener('tap', clearOrder);

        var clickable = document.getElementById("idPay");
        clickable.addEventListener('tap', currentOrderPay.class.main);
    };

    // content methods *******************************************************************************************

    /**
     * add elements to trolley
     */
    var addToTrolley = function(){
        var id = this.id;
        var i = id.substring(id.length - 1, id.length);
        listOfElements[i].amount += 1;

        if(listOfElements[i].selectToPay < (listOfElements[i].amount - listOfElements[i].paid)) { // change select to pay if selection is outside of the new border
            listOfElements[i].selectToPay += 1;
        }
        currentOrder.class.checkAllSelected();  // check if all elements are selected (depending on the current selection is it possible that all elements are selected noc)
        document.getElementById("trolley".concat(i)).innerHTML = listOfElements[i].amount; // set in HTML new value
        currentOrderPay.class.setItemsSent(SENTNOT); // reset sent check mark
    };

    /**
     * remove elements from from trolley
     */
    var removeFromTrolley = function(){
        var id = this.id;
        var i = id.substring(id.length - 1, id.length);
        if(listOfElements[i].amount > 0){ // avoid negative numbers
            listOfElements[i].amount -= 1;

            if(listOfElements[i].selectToPay > (listOfElements[i].amount - listOfElements[i].paid)) { // change select to pay if selection is outside of the new border
                listOfElements[i].selectToPay -= 1;
            }
            currentOrder.class.checkAllSelected(); // check if all elements are selected (depending on the current selection is it possible that all elements are selected noc)
            document.getElementById("trolley".concat(i)).innerHTML = listOfElements[i].amount; // set in HTML new value
        }
        currentOrderPay.class.setItemsSent(SENTNOT); // reset sent check mark
    };

    /**
     * create a new order and delete old order local
     */
    var clearOrder = function(){

        for (i = 0; i < listOfElements.length; i++) {
            listOfElements[i].amount = 0;
            listOfElements[i].selectToPay = 0;
            listOfElements[i].paid = 0;
        }

        currentOrderPay.class.setItemsSent(SENTNOT); // reset sent check mark
        currentOrderPay.class.setItemsSentSuccessOnce(false); // reset send success variable
        // listOfElements = (function () { return; })(); // set as undefined
        main();
    };


    return { // definition of public methods
        main: main
    };

})();