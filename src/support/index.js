import { angular } from "../vendor";
// import SupportCtrl from "./support-ctrl";
import SupportService from "./support-service";

const SEGMENT_NAME = "support";

export default angular.module("control.support", [])
  .service("SupportService", SupportService)
  // .controller("SupportCtrl", SupportCtrl)
  .run(/*@ngInject*/ function ($routeSegmentProvider, USER_ROLES) {
    $routeSegmentProvider
      .when("/support", SEGMENT_NAME)
      .segment(SEGMENT_NAME, {
        // template: require("./support.html"),
        authorizedRoles: [USER_ROLES.all],
        title: "Support",
        controller: "SupportCtrl",
      });
  })
  .name;
