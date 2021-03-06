export default class AboutService {
    /*@ngInject*/
  constructor(
        $http,
        $rootScope,
        ENV
    ) {
    this.getCastVersion = (hostname) => {
      return $http.get(`${hostname}/api/version`).then(resp => resp.data);
    };
    let getBuildInfo = (name) => {
      return $http.get(`${ENV.apiEndpoint}/buildinfo/${name}`).then(resp => resp.data);
    };
    this.getCastBuildInfo = () => getBuildInfo("Cast");
    this.getCastBetaBuildInfo = () => getBuildInfo("Cast-beta");
    this.getDjBuildInfo = () => getBuildInfo("DJ");
    this.updateCast = () => {
      return $http.post(`${ENV.apiEndpoint}/control/cast/upgrade/${$rootScope.service.username}`);
    };
    this.relocateCast = () => {
      return $http.post(`${ENV.apiEndpoint}/control/cast/relocate/${$rootScope.service.username}`);
    };
    this.setBranch = (branch) => {
      return $http.put(`${ENV.apiEndpoint}/control/cast/branch/${$rootScope.service.username}`, { branch });
    };
  }
}
