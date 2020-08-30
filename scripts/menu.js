/*
    created:        2020-04-04
    author:         S. Hennes
    description:    menu handling
*/

const phpCurrentOrder = "print.php" ;

// menu *******************************************************************************************

function toggleNavbar() { // show sandwitch menu on small screen
    var x = document.getElementById("mainNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

function closeNavbar() { 
    var x = document.getElementById("mainNavbar");
    x.className = "navbar";
}

/* disable text selection on long tap for desktop user (commented out to develop)*/
// window.oncontextmenu = function(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     return false;
// };

