/*
    created:        2020-04-04
    author:         S. Hennes
    description:    menu handling
*/

const phpDatabaseSet = "databaseSet.php";
const phpDatabaseGet = "databaseGet.php";

var menu = menu || {}; // creation of a namespace

menu.class = (function() {

    // menu *******************************************************************************************

    var toggleNavbar = function() { // show sandwitch menu on small screen
        var x = document.getElementById("mainNavbar");
        if (x.className === "navbar") {
            x.className += " responsive";
        } else {
            x.className = "navbar";
        }
    };

    var closeNavbar = function() { 
        var x = document.getElementById("mainNavbar");
        x.className = "navbar";
    };

    /* disable text selection on long tap for desktop user (commented out to develop)*/
    // window.oncontextmenu = function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    // };

    return { // definition of public methods
        toggleNavbar: toggleNavbar,
        closeNavbar: closeNavbar
    };

})();



