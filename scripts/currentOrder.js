/*
    created:        2020-04-13
    author:         S. Hennes
    description:    current order methods
*/

var listOfElements; // global attribute to store data

const ICONMONEYBAG = "&#x1F4B0;";
const ICONSHOPPINGTROLLEY = "&#x1F6D2;";
const ICONCHECKBOX = "&#x2611;";
const ICONCHECKMARK = "&#x2714;&#xFE0F;";
const ICONCROSSMARK = "&#x274C";

const COLORGREY = "#a7a7a7";


// content methods *******************************************************************************************

/**
 * request data
 */
function currentOrder() {
    // console.log("log");
    closeNavbar();

    if(listOfElements == undefined){ // if list of elements is undefined: request new list from server

        ajaxRequest(createListOfElements, "GET", "")
    }
}


/**
 * clear all elements of "content"
 */
function clearContent(){
    // remove old content
    document.getElementById("idHeader").innerHTML = "";
    document.getElementById("idContentScroll").innerHTML = "";
    var contentStatic = document.getElementById("idContentStatic");
    contentStatic.innerHTML = "";
    contentStatic.setAttribute("style", "padding:0px");
    document.getElementById("idFooter").innerHTML = "";
}

/**
 * create button of item list
 * @param {*} tr 
 */
function createHTMLButton(tr) {
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

}

/**
 * AJAX request method
 * @param {function to call} callbackFunction 
 * @param {GET or POST} type 
 * @param {JSON formatted data} json 
 */
function ajaxRequest(callbackFunction, type, json){
    
    // get content from script
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunction(this);
        }
    };
    xhttp.open(type, phpCurrentOrder, true);
    xhttp.send(json);

}

/**
 * callback method executed after ajax
 * used to create list of elements
 * @param {} xhttp 
 */
function createListOfElements(xhttp){

    var json = xhttp.responseText;

    // prepare data attribute
    listOfElements = JSON.parse(json).itemList;

    for (i = 0; i < listOfElements.length; i++) {
        listOfElements[i]["amount"] = 0; // add an additional key value
        listOfElements[i]["selectToPay"] = 0;
        listOfElements[i]["paid"] = 0;
    }

    currentOrderMain();
}