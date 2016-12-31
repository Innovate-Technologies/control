import "../manage/manage-nav.css";
import "./status-pane.css";

import { angular } from "../vendor";
import DjManageService from "./dj-manage-service";
import DjManageCtrl from "./manage-ctrl";
import DjConfigService from "./dj-config-service";
import DjStatusCtrl from "./dj-status-ctrl";
import Continuous from "./continuous";
import Media from "./media";

const watchForService = /*@ngInject*/ ($rootScope) => ($rootScope.service) ? $rootScope.service.id : undefined;

export default angular.module("control.dj", [
  Continuous,
  Media,
])
  .service("DjManageService", DjManageService)
  .service("DjConfigService", DjConfigService)
  .controller("DjManageCtrl", DjManageCtrl)
  .controller("DjStatusCtrl", DjStatusCtrl)
  .config(/*@ngInject*/($routeSegmentProvider) => {
    $routeSegmentProvider
      .when("/dj", "dj")
      .when("/dj/status", "dj.status")
      .segment("dj", {
        template: require("./manage.html"),
        title: "Manage DJ",
        resolve: {
          service: ["ServicesService", (service) => service.initAndGetService(true)],
        },
        resolveFailed: {},
        controller: "DjManageCtrl",
        controllerAs: "DjManageCtrl",
        watcher: watchForService,
        featureFlag: "DJ",
      })
      .within()
      .segment("status", {
        default: true,
        template: require("./status-pane.html"),
        controller: "DjStatusCtrl",
        controllerAs: "DjStatusCtrl",
        title: "Status",
        resolve: {
          config: ["DjConfigService", (service) => service.getConfig()],
        },
        resolveFailed: {},
        featureFlag: "DJ",
      })
      .up()
      .otherwise("/");
  })
  .name;
