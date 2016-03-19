/**
 * Control
 * Copyright (C) 2016  Innovate Technologies
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  angular,
  angularRoute,
  angularAnimate,
  angularSanitize,
  angularMessages,
  angularFormly,
  angularFormlyTemplatesBootstrap,
  angularLoadingBar,
  angularSmartTable,
} from "./vendor";

import config from "./config";
import configForms from "./config-forms";
import configHttp from "./config-http";
import configAngularStrap from "./config-angular-strap";

import controlCommon from "./common";
import controlLogin from "./login";
import controlDashboard from "./dashboard";
import controlFeedback from "./feedback";
import controlManage from "./manage";

require("./header-nav.html");
require("./footer.html");

const app = angular.module("control", [
  config,
  controlCommon,
  controlLogin,
  controlDashboard,
  controlFeedback,
  controlManage,
  "angular-promise-cache",
  angularRoute,
  "route-segment",
  "view-segment",
  angularAnimate,
  angularSanitize,
  angularMessages,
  angularLoadingBar,
  "feature-flags",
  "LocalStorageModule",
  "mgcrea.ngStrap",
  "picardy.fontawesome",
  angularFormly,
  angularFormlyTemplatesBootstrap,
  angularSmartTable,
  "ngFileUpload",
  "colorpicker.module",
  "toggle-switch",
  "ui.bootstrap.showErrors",
  "angularResizable",
  "xeditable",
  "ui.select",
]);

app.config(configHttp);
app.config(configAngularStrap);
app.run(configForms);

if (IS_PRODUCTION) {
  require("./config-production").default(app);
}

angular.bootstrap(document, ["control"], { strictDi: true });
