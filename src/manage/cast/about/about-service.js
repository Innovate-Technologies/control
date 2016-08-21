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
    this.getDjBuildInfo = () => getBuildInfo("DJ");
    this.updateCast = () => {
      return $http.post(`${ENV.apiEndpoint}/control/cast/upgrade/${$rootScope.service.username}`);
    };
  }
}
