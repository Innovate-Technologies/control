import lodash from "lodash";
import angular from "angular";
import angularAnimate from "angular-animate";
import "angular-bootstrap-colorpicker/css/colorpicker.css";
import "angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js";
import angularShowErrors from "angular-bootstrap-show-errors";
import angularFontAwesome from "angular-fontawesome";
import angularFormly from "angular-formly";
import angularFormlyTemplatesBootstrap from "angular-formly-templates-bootstrap";
import "angular-feature-flags/dist/featureFlags.js";
import angularLoadingBar from "angular-loading-bar";
import angularLocalStorage from "angular-local-storage";
import angularMessages from "angular-messages";
import angularPromiseCache from "angular-promise-cache";
import angularResizable from "angular-resizable";
import angularRoute from "angular-route";
import angularRouteSegment from "angular-route-segment";
import angularSanitize from "angular-sanitize";
import angularSmartTable from "angular-smart-table";
import "angular-bootstrap-toggle-switch/angular-toggle-switch.js";
import "angular-bootstrap-toggle-switch/style/bootstrap3/angular-toggle-switch-bootstrap-3.css";
import "angular-xeditable/dist/css/xeditable.css";
import "angular-xeditable/dist/js/xeditable.js";
import "angular-strap/dist/angular-strap.js";
import "angular-strap/dist/angular-strap.tpl.js";
import jQuery from "jquery";
import "ui-select/dist/select.js";
import "ui-select/dist/select.css";
import ngFileUpload from "ng-file-upload";
import ngMap from "ngmap";
import moment from "moment";
import dndLists from "angular-drag-and-drop-lists";
import socketio from "socket.io-client";

import "animate.css/animate.css";
import "api-check";
import "bootstrap/js/collapse.js";
import "bootstrap/js/dropdown.js";
import "bootstrap/js/transition.js";
import "bootstrap/dist/css/bootstrap.css";
import "angular-motion/dist/angular-motion.css";
import "bootstrap-additions/dist/bootstrap-additions.css";
import "font-awesome/css/font-awesome.css";
import "mdi/css/materialdesignicons.css";
import "./mdi-font.css";

export {
    lodash,
    angular,
    angularAnimate,
    angularShowErrors,
    angularFontAwesome,
    angularFormly,
    angularFormlyTemplatesBootstrap,
    angularLoadingBar,
    angularLocalStorage,
    angularMessages,
    angularPromiseCache,
    angularResizable,
    angularRoute,
    angularRouteSegment,
    angularSanitize,
    angularSmartTable,
    jQuery,
    ngFileUpload,
    ngMap,
    moment,
    dndLists,
    socketio,
};

// set global variables
global.moment = moment;
