export default class AuthInterceptor {
  /*@ngInject*/
  constructor($rootScope, $q, AUTH_EVENTS, Session, ENV) {
    this.request = (config) => {
      config.headers = config.headers || {};
      if (config.url.indexOf(ENV.apiEndpoint) !== -1 && Session.token) {
        config.headers.Authorization = "Bearer " + Session.token;
      }
      return config;
    };
    this.responseError = (response) => {
      if (response.status === 400) {
        $rootScope.$broadcast(AUTH_EVENTS.badRequest, response);
      }
      if (response.status === 401) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response);
      }
      if (response.status === 403) {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response);
      }
      if (response.status === 419 || response.status === 440) {
        $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout, response);
      }
      return $q.reject(response);
    };
  }
}
