import { angular } from "../../vendor";
import upload from "./upload";
import tags from "./tags";
import tunes from "./tunes";

export default angular.module("control.dj.media", [
  tunes,
  upload,
  tags,
])
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addSection({
        name: "Media",
        id: "media",
      });
    })
    .name;
