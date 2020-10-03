/*
    created:        2020-04-13
    author:         S. Hennes
    description:    current order methods
*/

var currentOrderPay = currentOrderPay || {}; // creation of a namespace

currentOrderPay.class = (function() {

    var itemsSent = 0; // 0 = not sent, 1 = sent successfull, 2 = sent failure:
    var itemsSentSuccessOnce = false; // if a change

    // views *******************************************************************************************

    /**
     * create order pay page
     */
    var main = function() {

        currentOrder.class.clearContent();

        // header *****************************************
        document.getElementById("idHeader").innerText = "Bezahlen"

        // contentScroll *****************************************
        // create HTML item list page

        var tbl = document.createElement('table'); // create HTML table
        var btn;
        var buttonsAvailable = false;

        for (i = 0; i < listOfElements.length; i++) {

            if(currentOrder.class.conditionToDraw(i)){

                buttonsAvailable = true; // a button will be drawed
                
                if(currentOrder.class.getCheckAllItems()){
                    listOfElements[i].selectToPay = listOfElements[i].amount - listOfElements[i].paid;
                } else{
                    listOfElements[i].selectToPay = listOfElements[i].selectToPay;
                }

                var tr = document.createElement('tr'); // create new row
                tr.setAttribute("id", "trItem".concat(i));
                tbl.appendChild(tr);

                var td = document.createElement('td'); // create new column
                var nobr = document.createElement('nobr');
                    // var spanSymbol = document.createElement('span');
                    //     spanSymbol.setAttribute("class", "iconLayoutSpaceRight");
                    //     spanSymbol.innerHTML = iconCheckBox;
                    //     nobr.appendChild(spanSymbol);
                    var spanText = document.createElement('span');
                        spanText.setAttribute("id", "toPay".concat(i));
                        spanText.innerHTML = listOfElements[i].selectToPay;
                        nobr.appendChild(spanText);
                    td.appendChild(nobr);
                tr.appendChild(td);

                currentOrder.class.createHTMLButton(tr);

                var td = document.createElement('td'); // create new column
                    var nobr = document.createElement('nobr');
                        var div = document.createElement('div');
                        div.setAttribute("class", "frac");
                        var span;
                        var spanText;
                        var spanSymbol;
                            span = document.createElement('span');
                                spanText = document.createElement('span');
                                    spanText.setAttribute("id", "paid".concat(i));
                                    spanText.innerHTML = listOfElements[i].paid;
                                    span.appendChild(spanText);
                                spanSymbol = document.createElement('span');
                                    spanSymbol.setAttribute("class", "iconLayoutSpaceLeft");
                                    spanSymbol.innerHTML = ICONMONEYBAG;
                                    span.appendChild(spanSymbol);
                            div.appendChild(span);

                            span = document.createElement('span');
                                span.setAttribute("class", "symbol");
                                span.innerHTML = "/";
                                div.appendChild(span);

                            span = document.createElement('span');
                                span.setAttribute("class", "bottom");
                                spanText = document.createElement('span');
                                    spanText.setAttribute("id", "trolley".concat(i));
                                    spanText.innerHTML = listOfElements[i].amount;
                                    span.appendChild(spanText);
                                spanSymbol = document.createElement('span');
                                    spanSymbol.setAttribute("class", "iconLayoutSpaceLeft");
                                    spanSymbol.innerHTML = ICONSHOPPINGTROLLEY;
                                    span.appendChild(spanSymbol);
                            div.appendChild(span);
                        nobr.appendChild(div);
                    td.appendChild(nobr);
                tr.appendChild(td);


            }
        }
        document.getElementById("idContentScroll").appendChild(tbl);

        if(!buttonsAvailable){ // if no buttos have been drawn, output a message
            showNoElementSelectMsg();
        }

        // add event listener
        for (i = 0; i < listOfElements.length; i++) {
            if(currentOrder.class.conditionToDraw(i)){
                var clickable = document.getElementById("item".concat(i));
                clickable.addEventListener('tap', addToPay);
                clickable.addEventListener('longtap', removeToPay);
            }
        }

        markPaidElements();

        // contentStatic *****************************************
        // calculate total price
        var staticContent = document.getElementById("idContentStatic");
            staticContent.setAttribute("style", "padding: 5px 15px");

            var div = document.createElement("div");
                div.setAttribute("class", "contentStaticBorder");
                var divElement = document.createElement("div")
                    var input = document.createElement("input");
                        input.setAttribute("type", "checkbox");
                        input.setAttribute("id", "checkAll");
                        input.setAttribute("onclick", "currentOrderPay.class.checkBoxSelectAll()");
                        divElement.appendChild(input);
                    var label = document.createElement("label");
                        label.setAttribute("onclick", "currentOrderPay.class.checkBoxSelectAll()");
                        label.innerText = "Alles auswählen";
                        divElement.appendChild(label)
                div.appendChild(divElement);
                var divElement = document.createElement("div");
                    divElement.style.cssText = "font-weight: bold; font-size: x-large;"
                    var spanText;
                    spanText = document.createElement("span");
                    spanText.innerText = "Summe: ";
                        divElement.appendChild(spanText);
                        spanText = document.createElement("span");
                        spanText.setAttribute("id", "totalPrice");
                        spanText.innerText = "0.00";
                        divElement.appendChild(spanText);
                div.appendChild(divElement)
            staticContent.appendChild(div);

            checkBox = document.getElementById("checkAll"); // set state of checkbox
            checkBox.checked = currentOrder.class.getCheckAllItems();

        // footer *****************************************
        btn = document.createElement("button");
            btn.setAttribute("id", "idBack");
            btn.innerText = "Zurück";
            document.getElementById("idFooter").appendChild(btn);
        btn = document.createElement("button");
            btn.setAttribute("id", "idBill");
            var spanText = document.createElement("span");
                spanText.innerText = "Bezahlen";
                btn.appendChild(spanText);
            var spanIcon = document.createElement("span");
                spanIcon.setAttribute("class", "iconLayoutSpaceLeft");
                spanIcon.setAttribute("id", "iconPaid");
                spanIcon.style.display = "none";
                spanIcon.innerHTML = ICONCHECKMARK;
                btn.appendChild(spanIcon);


        var sendList = getSendList();
        document.getElementById("idFooter").appendChild(btn);
            btn = document.createElement("button");
            btn.setAttribute("id", "idSend");
            var spanText = document.createElement("span");
                spanText.innerText = "Senden";
                if(sendList.length > 0){
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                    btn.style.backgroundColor = COLORGREY; // grey out
                }
                btn.appendChild(spanText);
            var spanIcon = document.createElement("span");
                spanIcon.setAttribute("class", "iconLayoutSpaceLeft");
                spanIcon.setAttribute("id", "iconSent");
                spanIcon.style.display = "none";
                btn.appendChild(spanIcon);
            document.getElementById("idFooter").appendChild(btn);


        var clickable = document.getElementById("idBack");
        clickable.addEventListener('tap', currentOrderMain.class.main);

        var clickable = document.getElementById("idBill");
        clickable.addEventListener('tap', payBill);

        var clickable = document.getElementById("idSend");
        clickable.addEventListener('tap', sendData);

        calculateTotalPrice();
        checkSent();

    };

    // content methods *******************************************************************************************

    /**
     * when the checkbox is called: save state and reload window
     */
    var checkBoxSelectAll = function() {

        currentOrder.class.setCheckAllItems(!currentOrder.class.getCheckAllItems()); // toggle

        if(!currentOrder.class.getCheckAllItems()){ // reset if uncheck all
            for (i = 0; i < listOfElements.length; i++) {
                listOfElements[i].selectToPay = 0;
            }
        }

        // reload window of currentOrderPay
        main();
    };

    /**
     * add elements to pay
     */
    var addToPay = function(){
        var id = this.id;
        var i = id.substring(id.length - 1, id.length);

        if(listOfElements[i].selectToPay < (listOfElements[i].amount - listOfElements[i].paid)) { // select not more than in the trolley
            addElement(i);
        }

        if(listOfElements[i].selectToPay > (listOfElements[i].amount - listOfElements[i].paid)) {
            subtractElement(i);
        }
    };

    /**
     * remove elements to pay
     */
    var removeToPay = function(){
        var id = this.id;
        var i = id.substring(id.length - 1, id.length);
        if(listOfElements[i].selectToPay > 0) { // avoid negative numbers
            subtractElement(i);
        }

        if(listOfElements[i].selectToPay < 0) {
            addElement(i);
        }
    };

    /**
     * add element to pay
     * @param {index} i 
     */
    var addElement = function(i) {
        listOfElements[i].selectToPay += 1;
        updateToPayAfterChange(i);
    };

    /**
     * subtract element to pay
     * @param {index} i
     */
    var subtractElement = function(i) {
        listOfElements[i].selectToPay -= 1;
        updateToPayAfterChange(i);
    };

    /**
     * update item which has been selected for payment of the button
     * @param {index} i
     */
    var updateToPayAfterChange = function(i){
        document.getElementById("toPay".concat(i)).innerHTML = listOfElements[i].selectToPay; // set in HTML new value
        calculateTotalPrice();
        var checkBox = document.getElementById("checkAll");

        checkBox.checked = currentOrder.class.checkAllSelected();
    };

    /**
     * calculate total price of selected elements
     */
    var calculateTotalPrice = function() {
        var totalPrice = 0;
        var checkForAllPayed = false;

        for (i = 0; i < listOfElements.length; i++) {

            if(listOfElements[i].selectToPay != 0){
                totalPrice += (listOfElements[i].price * listOfElements[i].selectToPay);
            }

            if(listOfElements[i].amount - listOfElements[i].paid != 0){
                checkForAllPayed = true;
            }
        }

        var icon = document.getElementById("iconPaid");
        var btn = document.getElementById("idBill");
        if(icon != null){
            if(!checkForAllPayed) {
                icon.style.display  = "inline"; // show green check mark
                btn.disabled = true;
                btn.style.backgroundColor = COLORGREY; // grey out

            } else{
                icon.style.display  = "none";
                btn.disabled = false;
                btn.style.backgroundColor = ""
            }
        }


        var sum = document.getElementById("totalPrice");
        sum.innerText = currentOrder.class.formatCurrency(totalPrice);

        if(totalPrice < 0){
            sum.style.color = "red"; // set color to red for negative numbers
        } else {
            sum.style.color = ""; // reset color
        }

    };

    /**
     * remove elements from "selectToPay" and add to "paid"
     */
    var payBill = function() {

        var btn = document.getElementById("idBill");

        if(!btn.disabled) {
            for (i = 0; i < listOfElements.length; i++) {
                if(listOfElements[i].selectToPay != 0){
                    listOfElements[i].paid += listOfElements[i].selectToPay;
                    listOfElements[i].selectToPay = 0;

                    document.getElementById("toPay".concat(i)).innerHTML = listOfElements[i].selectToPay;
                    document.getElementById("paid".concat(i)).innerHTML = listOfElements[i].paid;
                }
            }

            markPaidElements();

            calculateTotalPrice();
        }
    };

    /**
     * highlight buttons as marked and hide item selector
     */
    var markPaidElements = function() {
        var deleted = false;
        var pendingPayment = false;

        for (i = 0; i < listOfElements.length; i++) {

            if(listOfElements[i].amount == 0 && listOfElements[i].paid == 0){ // Element needs to be removed from list since the element was paid out.

                var tr = document.getElementById("trItem".concat(i));
                if(tr != null){
                    tr.parentNode.removeChild(tr); // remove from DOM
                    deleted = true;
                }

            } else{
                if(listOfElements[i].amount == listOfElements[i].paid){
                    var btn = document.getElementById("item".concat(i));
                    if(btn != null){
                        btn.style.backgroundColor = COLORGREY;
                        var toPay = document.getElementById("toPay".concat(i));
                        toPay.innerHTML = "";
                    }
                }
            }

            if(listOfElements[i].amount != listOfElements[i].paid){ // check if a payment is pending. Therefore message (see below) is not allowed
                pendingPayment = true;
            }
        }

        if(deleted && !pendingPayment && getSendList().length == 0 && itemsSentSuccessOnce){ // if elements has been deleted and no payment is pending and list to send is empty and list has been send once
            showMessage("Bestellung gelöscht! Bitte informieren Sie die Küche.", "removedOrder", 6000, "red");
            setItemsSentSuccessOnce(false);
        }

        if(deleted && !pendingPayment){ // if elements has been deleted and no payment is pending show message
            showNoElementSelectMsg();
        }
    };

    /**
     * use to show a message in the body if no element is available to draw
     */
    var showNoElementSelectMsg = function(){
        var div = document.createElement("div");
            div.innerText = "Keine Elemente ausgewählt.";
            div.style.padding = "15px 15px 0px 15px"

        document.getElementById("idContentScroll").appendChild(div);
    }

    /**
     * send data to print / store
     */
    var sendData = function() {

        var btn = document.getElementById("idSend");

        if(!btn.disabled) {
            var sendList = getSendList();

            if(sendList.length > 0){
                if(itemsSentSuccessOnce){
                    showMessage("Erneut gesendet! Bitte informieren Sie die Küche über die geänderte Bestellung.", "stillSentMessage", 6000, "red");
                }

                var data = JSON.stringify(sendList);
                currentOrder.class.ajaxRequest(phpDatabaseSet, evaluateRequest, "POST", data);

            }
        }

    };

    /**
     * callback method executed after ajax
     * used to show message after print / storage
     * @param {} xhttp
     */
    var evaluateRequest = function(xhttp, message){

        if(message == ""){
            var json = xhttp.responseText;
            var obj = JSON.parse(json);
    
            var timeout = 3000; // standard timeout
            var messageColor = "";
            if (obj.state == "success") {
                setItemsSent(SENTSUCCESSFULL);
                setItemsSentSuccessOnce(true);
            } else {// change timeout and color on failure
                messageColor = "red";
                timeout = 6000;
                setItemsSent(SENTFAILURE);
            }
            dispMessage = obj.message;

        } else {
            dispMessage = message + "\nKontaktieren Sie Ihren Administrator.";
            messageColor = "red";
            timeout = 6000;
            setItemsSent(SENTFAILURE);
        }

        checkSent();
        showMessage(dispMessage, "requestMessage", timeout, messageColor);

    };

    /**
     * create list to send
     */
    var getSendList = function(){
        var sendList = new Array(); // create array which contains objects
        var counter = 0;
        for (i = 0; i < listOfElements.length; i++) {
            if(listOfElements[i].amount > 0){
                var item = new Object(); // create key value objects (see https://stackoverflow.com/questions/351495/dynamically-creating-keys-in-javascript-associative-array)
                // item['id'] = listOfElements[i].id;
                item['item'] = listOfElements[i].item;
                item['amount'] = listOfElements[i].amount;
                sendList[counter] = item;
                counter += 1;
            }
        }
        return sendList;
    };

    /**
     * method to show a message in the message bar
     * @param {message to print} message
     * @param {id to identify} id
     * @param {timeout in ms} timeout
     * @param {color of the message} messageColor
     */
    var showMessage = function(message, id, timeout = 3000, messageColor = ""){

        var element = document.getElementById("idMessageBar");
        var div = document.createElement("div");
            div.setAttribute("id", id);
            div.innerText = message;
            div.style.color = messageColor;
            div.style.padding = "15px 15px 0px 15px"
        element.appendChild(div);

        setTimeout(timeElapsed(id), timeout);
    };

    /**
     * callback method of the show message method after timeout
     * @param {id to identify} id
     */
    var timeElapsed = function(id){
        return function() {
            var div = document.getElementById(id);
            if(div != null){
                div.parentNode.removeChild(div);
            }
        }
    };

    /**
     * method used to evaluate if the order has been sent or not
     */
    var checkSent = function() {

        var icon = document.getElementById("iconSent");
        var btn = document.getElementById("idSend");
        switch(itemsSent) {

            case SENTSUCCESSFULL:
                icon.innerHTML = ICONCHECKMARK;
                btn.disabled = true;
                btn.style.backgroundColor = COLORGREY;
                icon.style.display = "inline";
                break;
            case SENTFAILURE:
                icon.innerHTML = ICONCROSSMARK;
                icon.style.display = "inline";
                break;
            case SENTNOT:
            default:
                icon.style.display = "hide";
        }
    };

    /**
     * method to set the value of variable itemsSent
     * @param {range 0..2, see definition of SENTNOT, SENTSUCCESSFULL, SENTFAILURE} value 
     */
    var setItemsSent = function(value) {
        itemsSent = value;
    };

    /**
     * method to set the value of variable itemsSentSuccessOnce
     * @param {true/false} value 
     */
    var setItemsSentSuccessOnce = function(value) {
        itemsSentSuccessOnce = value;
    };


    return { // definition of public methods
        main: main,
        setItemsSent: setItemsSent, // needed by currentOrderMain
        setItemsSentSuccessOnce: setItemsSentSuccessOnce, // needed by currentOrderMain
        checkBoxSelectAll: checkBoxSelectAll // needed by the setAttribute HTML expression
    };

})();