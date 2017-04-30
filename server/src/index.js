useStrict(true);

function useStrict(option) {
  if (option == true) {
    "use strict";
    console.log("Starting server in strict mode...");
  } else if (option == false) {
    "don't use strict";
    console.log("Starting server in lenient mode...");
  }
}

var xServer = require('./xQube');
var x = new xServer();
x.start();
