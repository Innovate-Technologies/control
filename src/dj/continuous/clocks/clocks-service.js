export default class ClocksService {
    /*@ngInject*/
  constructor($http, $rootScope, ENV) {
    const username = $rootScope.service.username;
    this.getClocks = () => {
      return $http.get(`${ENV.apiEndpoint}/control/cast/dj/clocks/${username}`).then(resp => resp.data);
    };
    this.setClocks = (clocks) => {
      return $http.put(`${ENV.apiEndpoint}/control/cast/dj/clocks/${username}`, clocks).then(resp => resp.data);
    };
  }
}
