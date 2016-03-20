import "../manage/manage-nav.css";

import { angular } from "../vendor";
import DjServicesService from "./dj-services-service";
import DjManageService from "./dj-manage-service";
// import ManageCtrl from "./manage-ctrl";

const watchForService = /*@ngInject*/ ($rootScope) => {
  if (!$rootScope.service) {
    return;
  }
  return $rootScope.service.id;
};

export default angular.module("control.manage", [

])
  .factory("DjServicesService", DjServicesService)
  .service("DjManageService", DjManageService)
  // .controller("ManageCtrl", ManageCtrl)
  .config(/*@ngInject*/ ($routeSegmentProvider) => {
    $routeSegmentProvider
      .when("/dj", "dj")
      .when("/dj/information", "dj.information")
      .segment("dj", {
        template: require("./manage.html"),
        title: "Manage DJ",
        resolve: {
          service: ["DjServicesService", (service) => service.initAndGetService()],
        },
        controller: "DjManageCtrl",
        watcher: watchForService,
      })
      .within()
      .segment("information", {
        default: true,
        template: require("./information-pane.html"),
        title: "Information",
        watcher: watchForService,
      })
      .up()
      .otherwise("/");
  })
  .name;
