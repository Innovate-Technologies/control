import { angular } from "../../../vendor";

import AlexaCtrl from "./alexa-ctrl";
import AlexaServiceFactory from "./alexa-service";
import "./alexa.css";

export default angular.module("control.manage.extra-services.np-tweets", [])
    .factory("AlexaService", AlexaServiceFactory)
    .controller("AlexaCtrl", AlexaCtrl)
    .run(/*@ngInject*/ function (ManageService) {
      ManageService.addItem({
        sectionId: "extra-services",
        name: "Alexa",
        icon: "amazon",
        route: {
          subPathName: "alexa",
          name: "alexa",
          template: require("./alexa.html"),
          controller: "AlexaCtrl",
          title: "Alexa Skill",
          resolve: /*@ngInject*/ {
            settings: function (AlexaService, $q) {
              return AlexaService.getSettings().then(
                            settings => $q.resolve(settings), () => $q.resolve({}));
            },
          },
        },
      });
    })
    .name;
