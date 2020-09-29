/*
    created:        2020-04-13
    author:         S. Hennes
    description:    current order methods
*/

// *****************************************************************
/**
 * public variables an constants
 */
var listOfElements; // global attribute to store data

const ICONMONEYBAG = "&#x1F4B0;";
const ICONSHOPPINGTROLLEY = "&#x1F6D2;";
const ICONCHECKBOX = "&#x2611;";
const ICONCHECKMARK = "&#x2714;&#xFE0F;";
const ICONCROSSMARK = "&#x274C";

const COLORGREY = "#a7a7a7";

const SENTNOT = 0, SENTSUCCESSFULL = 1, SENTFAILURE = 2;
// *****************************************************************

var currentOrder = currentOrder || {}; // creation of a namespace

currentOrder.class = (function() {

    var checkAllItems = true; // true = check box select all enabledItems
    var errorMessage = ""; // definition of error message which is set if the ajax request was not successful

    // content methods *******************************************************************************************

    /**
     * request data
     */
    var main = function() {
        // console.log("log");
        menu.class.closeNavbar();

        if(listOfElements == undefined){ // if list of elements is undefined: request new list from server

            ajaxRequest(phpDatabaseGet, createListOfElements, "POST", "")
        }
    };

    /**
     * clear all elements of "content"
     */
    var clearContent = function(){
        // remove old content
        document.getElementById("idHeader").innerHTML = "";
        document.getElementById("idContentScroll").innerHTML = "";
        var contentStatic = document.getElementById("idContentStatic");
        contentStatic.innerHTML = "";
        contentStatic.setAttribute("style", "padding:0px");
        document.getElementById("idFooter").innerHTML = "";
    };

    /**
     * create button of item list
     * @param {*} tr 
     */
    var createHTMLButton = function(tr) {
        var td = document.createElement('td'); // create new column
            btn = document.createElement("button"); // create button
                btn.setAttribute("id", "item".concat(i)); // set attribute
                var div = document.createElement("div");
                    var p = document.createElement("p");
                        p.setAttribute("class", "alignleft");
                        p.innerText = listOfElements[i].item;
                        div.appendChild(p);
                        var nobr = document.createElement("nobr");
                            p = document.createElement("p");
                                p.setAttribute("class", "alignright");
                                p.innerText = listOfElements[i].price + " €";
                            nobr.appendChild(p);
                        div.appendChild(nobr);
                btn.appendChild(div);
            td.appendChild(btn);
        tr.appendChild(td);

    };

    /**
     * check if all available elements are selected
     */
    var checkAllSelected = function() {
        var allSelected = false;
        for (i = 0; i < listOfElements.length; i++) { // evaluate if all is selected or not
            if(conditionToDraw(i)){
                if(!((listOfElements[i].amount - listOfElements[i].paid) == listOfElements[i].selectToPay)) {
                    allSelected = true;
                }
            }
        }
        checkAllItems = !allSelected;
        return checkAllItems;
    };

    /**
     * checks if an element should be drawed in currentOrderPay
     * @param {*} i
     */
    var conditionToDraw = function(i){
        return listOfElements[i].amount > 0 || listOfElements[i].paid > 0;
    };

    /**
     * AJAX request method
     * @param {php script to call} script 
     * @param {function to call} callbackFunction 
     * @param {GET or POST} type 
     * @param {JSON formatted data} json 
     */
    var ajaxRequest = function(script, callbackFunction, type, json){
        
        // get content from script
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callbackFunction(this);
            }
        };
        xhttp.open(type, script, true);
        xhttp.send(json);

    };

    /**
     * callback method executed after ajax
     * used to create list of elements
     * @param {} xhttp 
     */
    function createListOfElements(xhttp){

        var json = xhttp.responseText;
        var obj = JSON.parse(json);

        listOfElements = [];

        if (obj.state == "success") { 
            errorMessage = "Unbekannter Fehler."; // reset the error message to a default value

            // prepare data attribute
            listOfElements = obj.itemList;

            for (i = 0; i < listOfElements.length; i++) {
                listOfElements[i]["amount"] = 0; // add an additional key value
                listOfElements[i]["selectToPay"] = 0;
                listOfElements[i]["paid"] = 0;
            }
            
        } else if (obj.state == "empty") {
            errorMessage = "Keine Elemente angelegt.";
        } else {
            errorMessage = "Serverfehler";
            if(obj.message == ""){
                errorMessage += ".";
            } else{
                errorMessage += ":\n" + obj.message;
            }
        }

        errorMessage += "\nKontaktieren Sie Ihren Administrator."

        currentOrderMain.class.main();
    }

    /**
     * set variable checkAllItems
     * @param {true/false} value 
     */
    var setCheckAllItems = function(value){
        checkAllItems = value;
    };

    /**
     * get variable checkAllItems
     */
    var getCheckAllItems = function(){
        return checkAllItems;
    };

    /**
     * returns the current error message from the server
     */
    var getErrorMessage = function(){
        return errorMessage;
    };


    return { // definition of public methods
        main: main,
        clearContent: clearContent,
        createHTMLButton: createHTMLButton,
        checkAllSelected: checkAllSelected,
        conditionToDraw: conditionToDraw,
        ajaxRequest: ajaxRequest,
        setCheckAllItems: setCheckAllItems,
        getCheckAllItems: getCheckAllItems,
        getErrorMessage: getErrorMessage
    };

})();