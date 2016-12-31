import { angular } from "../../../vendor";

import TunesCtrl from "./tunes-ctrl";
import TunesService from "./tunes-service";
import "./tunes.css";

export default angular.module("control.dj.media.tunes", [])
    .controller("TunesCtrl", TunesCtrl)
    .service("TunesService", TunesService)
    .filter("secondsToDateTime", [() => {
      return (seconds) => {
        return new Date(1970, 0, 1).setSeconds(seconds);
      };
    }])
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addItem({
        sectionId: "media",
        name: "Tunes",
        icon: "database",
        route: {
          subPathName: "tunes",
          name: "tunes",
          template: require("./tunes.html"),
          controller: "TunesCtrl",
          controllerAs: "ctrl",
          title: "Tunes",
          resolve: /*@ngInject*/ {

          },
        },
      });
    })
    .name;
