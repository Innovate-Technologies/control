import { angular } from "../../../vendor";

export default /*@ngInject*/ function (config) {
  this.icecast = false;
  this.config = angular.copy(config);
}
