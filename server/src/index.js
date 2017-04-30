var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhttp = new XMLHttpRequest();
var reqMethod = "GET";
var linkAroni = "http://127.0.0.1/resources/js/conf.json";
var asyncAroni = true;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        var confData = JSON.parse(this.responseText);
        var xServer = require('./xQube');
        var x = new xServer(confData);
        x.start();
    }
};
xhttp.open(reqMethod, linkAroni, asyncAroni);
xhttp.send();
