import { angular } from "../../../vendor";

import ClocksCtrl from "./clocks-ctrl";
import ClocksService from "./clocks-service";
import ClocksColorService from "./clocks-color-service";
import "./clocks.css";


export default angular.module("control.dj.continuous.clocks", [])
   .controller("ClocksCtrl", ClocksCtrl)
   .service("ClocksService", ClocksService)
   .service("ClocksColorService", ClocksColorService)
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addItem({
        sectionId: "continious",
        name: "Clocks",
        icon: "clock-o",
        route: {
          subPathName: "clocks",
          name: "clocks",
          template: require("./clocks.html"),
          controller: "ClocksCtrl",
          controllerAs: "ctrl",
          title: "Clocks",
          resolve: /*@ngInject*/ {

          },
        },
      });
    })
    .name;
