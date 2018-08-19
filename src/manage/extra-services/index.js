import { angular } from "../../vendor";

import extraApps from "./apps";
import extraNpTweets from "./now-playing-tweets";
import extraTuneIn from "./tunein-integration";
import extraPlayer from "./player";
import extraAlexa from "./alexa";

export default angular.module("control.manage.extra-services", [
  extraApps,
  extraNpTweets,
  extraTuneIn,
  extraPlayer,
  extraAlexa,
])
    .run(/*@ngInject*/ (ManageService) => {
      ManageService.addSection({
        name: "Extra services",
        id: "extra-services",
      });
    })
    .name;
