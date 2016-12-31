import { angular } from "../../../vendor";

import IntervalsCtrl from "./intervals-ctrl";
import IntervalsService from "./intervals-service";
import "./intervals.css";

export default angular.module("control.dj.continuous.intervals", [])
    .controller("IntervalsCtrl", IntervalsCtrl)
    .service("IntervalsService", IntervalsService)
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addItem({
        sectionId: "continious",
        name: "Intervals",
        icon: "indent",
        route: {
          subPathName: "intervals",
          name: "intervals",
          template: require("./intervals.html"),
          controller: "IntervalsCtrl",
          controllerAs: "ctrl",
          title: "Intervals",
          resolve: /*@ngInject*/ {

          },
        },
      });
    })
    .name;
