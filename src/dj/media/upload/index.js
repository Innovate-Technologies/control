import { angular } from "../../../vendor";

import UploadCtrl from "./upload-ctrl";
import UploadService from "./upload-service";

export default angular.module("control.dj.media.upload", [])
   .controller("UploadCtrl", UploadCtrl)
   .service("UploadService", UploadService)
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addItem({
        sectionId: "media",
        name: "Upload",
        icon: "upload",
        route: {
          subPathName: "upload",
          name: "upload",
          template: require("./upload.html"),
          controller: "UploadCtrl",
          controllerAs: "ctrl",
          title: "Upload",
          resolve: /*@ngInject*/ {

          },
        },
      });
    })
    .name;
