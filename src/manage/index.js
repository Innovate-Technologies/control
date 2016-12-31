import "./manage-nav.css";

import { angular } from "../vendor";
import ServicesService from "./services-service";
import ManageService from "./manage-service";
import ManageCtrl from "./manage-ctrl";

import manageCast from "./cast";
import manageExtra from "./extra-services";

const watchForService = /*@ngInject*/ ($rootScope) => {
  if (!$rootScope.service) {
    return;
  }
  return $rootScope.service.id;
};

export default angular.module("control.manage", [
  manageCast,
  manageExtra,
])
    .service("ServicesService", ServicesService)
    .service("ManageService", ManageService)
    .controller("ManageCtrl", ManageCtrl)
    .config(/*@ngInject*/ ($routeSegmentProvider, $routeProvider, USER_ROLES) => {
      $routeSegmentProvider
            .when("/manage", "manage")
            .when("/manage/information", "manage.information")
            .segment("manage", {
              template: require("./manage.html"),
              authorizedRoles: [USER_ROLES.all],
              title: "Manage your servers",
              resolve: {
                service: ["ServicesService", (SService) => SService.initAndGetService()],
              },
              controller: "ManageCtrl",
              watcher: watchForService,
            })
            .within().segment("information", {
              default: true,
              template: require("./information-pane.html"),
              authorizedRoles: [USER_ROLES.all],
              title: "Information",
              watcher: watchForService,
            })
            .up()
            .otherwise("/");
      $routeProvider.when("/manage/request-app", { redirectTo: "/manage/apps" });
    })
    .name;
