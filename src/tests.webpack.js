import "angular";
import "angular-mocks/angular-mocks";

import "babel-polyfill";

// TODO: import the required modules directly from the tests
// instead of requiring the whole app from this entry point
import "./app.js";

let testsContext = require.context("./", true, /.tests.js$/);
testsContext.keys().forEach(testsContext);
