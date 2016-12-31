export default /*@ngInject*/ function ($http, ENV, $rootScope) {
  const username = $rootScope.service.username;
  this.getIntervals = () => {
    return $http.get(`${ENV.apiEndpoint}/control/cast/dj/intervals/${username}`).then(res => res.data);
  };

  this.addInterval = (data) => {
    return $http.put(`${ENV.apiEndpoint}/control/cast/dj/intervals/${username}/`, data).then(res => res.data);
  };

  this.updateInterval = (data) => {
    return $http.post(`${ENV.apiEndpoint}/control/cast/dj/intervals/${username}/${data._id}`, data).then(res => res.data);
  };

  this.deleteInterval = (id) => {
    return $http.delete(`${ENV.apiEndpoint}/control/cast/dj/intervals/${username}/${id}`).then(res => res.data);
  };
}
