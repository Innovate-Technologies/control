export default class TagsService {
    /*@ngInject*/
  constructor($http, $rootScope, ENV) {
    const username = $rootScope.service.username;
    this.getTags = () => {
      return $http.get(`${ENV.apiEndpoint}/control/cast/dj/tags/${username}`).then(resp => resp.data);
    };
    this.deteleTag = (id) => {
      return $http.delete(`${ENV.apiEndpoint}/control/cast/dj/tags/${username}/${id}`).then(resp => resp.data);
    };
    this.addTag = (tag) => {
      return $http.put(`${ENV.apiEndpoint}/control/cast/dj/tags/${username}`, tag).then(resp => resp.data);
    };
    this.updateTag = (tag) => {
      return $http.post(`${ENV.apiEndpoint}/control/cast/dj/tags/${username}/${tag._id}`, tag).then(resp => resp.data);
    };
  }
}
