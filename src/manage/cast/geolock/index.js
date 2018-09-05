import "./geolock-icon.css";

import { angular } from "../../../vendor";

import GeoLockCtrl from "./geolock-ctrl.js";

export default angular.module("control.manage.cast.geolock", [])
    .controller("GeoLockCtrl", GeoLockCtrl)
    .run(/*@ngInject*/ (ManageService) => {
      ManageService.addItem({
        sectionId: "cast",
        name: "GeoLock",
        iconHtml: `<span class="geolock-icon-container">
      <i class="fas fa-globe fa-fw"></i>
      <i class="fas fa-lock fa-xs"></i>
    </span>
    `,
        order: 50,
        route: {
          subPathName: "geolock",
          name: "geolock",
          template: require("./geolock.html"),
          controller: "GeoLockCtrl",
          controllerAs: "ctrl",
          title: "GeoLock",
          resolve: /*@ngInject*/ {
            config: (ConfigService) => ConfigService.getConfig(),
            countries: (ConfigService) => ConfigService.getCountries(),
          },
        },
      });
    })
    .name;
