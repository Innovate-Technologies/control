import { angular } from "../../vendor";
import clocks from "./clocks";
import intervals from "./intervals";

export default angular.module("control.dj.continuous", [
  clocks,
  intervals,
])
    .run(/*@ngInject*/ (DjManageService) => {
      DjManageService.addSection({
        name: "Continious",
        id: "continious",
      });
    })
    .name;
