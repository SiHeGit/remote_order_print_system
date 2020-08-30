/*
    created:        2020-04-04
    author:         S. Hennes
    description:    current order methods
*/

// views *******************************************************************************************

/**
 * create main view
 */
function currentOrderMain(){

    clearContent();

    // header *****************************************
    document.getElementById("idHeader").innerText = "Aktuelle Bestellung"

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

        createHTMLButton(tr);
    
    }
    document.getElementById("idContentScroll").appendChild(tbl);
    
    // add event listener
    for (i = 0; i < listOfElements.length; i++) {
        var clickable = document.getElementById("item".concat(i));
        clickable.addEventListener('tap', addToTrolley);
        clickable.addEventListener('longtap', removeFromTrolley);
    }

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
    clickable.addEventListener('tap', currentOrderPay);
}

// content methods *******************************************************************************************


/**
 * add elements to trolley
 */
function addToTrolley(){
    var id = this.id;
    var i = id.substring(id.length - 1, id.length);
    listOfElements[i].amount += 1;

    if(listOfElements[i].selectToPay < (listOfElements[i].amount - listOfElements[i].paid)) { // change select to pay if selection is outside of the new border
        listOfElements[i].selectToPay += 1;
    }
    checkAllSelected();  // check if all elements are selected (depending on the current selection is it possible that all elements are selected noc)
    document.getElementById("trolley".concat(i)).innerHTML = listOfElements[i].amount; // set in HTML new value
    itemsSent = SENTNOT; // reset sent check mark
}

/**
 * remove elements from from trolley
 */
function removeFromTrolley(){
    var id = this.id;
    var i = id.substring(id.length - 1, id.length);
    if(listOfElements[i].amount > 0){ // avoid negative numbers
        listOfElements[i].amount -= 1;

        if(listOfElements[i].selectToPay > (listOfElements[i].amount - listOfElements[i].paid)) { // change select to pay if selection is outside of the new border
            listOfElements[i].selectToPay -= 1;
        }
        checkAllSelected(); // check if all elements are selected (depending on the current selection is it possible that all elements are selected noc)
        document.getElementById("trolley".concat(i)).innerHTML = listOfElements[i].amount; // set in HTML new value
    }
    itemsSent = SENTNOT; // reset sent check mark
}

/**
 * create a new order and delete old order local
 */
function clearOrder(){

    for (i = 0; i < listOfElements.length; i++) {
        listOfElements[i].amount = 0;
        listOfElements[i].selectToPay = 0;
        listOfElements[i].paid = 0;
    }

    itemsSent = SENTNOT;
    itemsSentSuccessOnce = false;
    // listOfElements = (function () { return; })(); // set as undefined
    currentOrderMain();
}