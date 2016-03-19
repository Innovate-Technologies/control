import "./dashboard.css";

import { angular } from "../vendor";
import DashboardCtrl from "./dashboard-ctrl";

export default angular.module("control.dashboard", [])
  .controller("DashboardCtrl", DashboardCtrl)
  .run(/*@ngInject*/ function ($routeSegmentProvider, USER_ROLES) {
    $routeSegmentProvider
      .when("/", "dashboard")
      .segment("dashboard", {
        template: require("./dashboard.html"),
        authorizedRoles: [USER_ROLES.all],
        title: "Dashboard",
        controller: "DashboardCtrl",
        controllerAs: "ctrl",
      });
  })
  .name;
