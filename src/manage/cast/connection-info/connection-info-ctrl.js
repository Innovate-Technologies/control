import { angular } from "../../../vendor";

export default /*@ngInject*/ function (config) {
  this.protocol = "SHOUTcast";
  this.config = angular.copy(config);
}
