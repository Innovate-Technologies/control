export default class AuthService {
  /*@ngInject*/
  constructor(
    $http,
    $rootScope,
    $interval,
    ENV,
    AUTH_EVENTS,
    Session,
  ) {
    this.keepAlivePromise = null;
    this.logIn = (credentials) => {
      return $http.post(`${ENV.apiEndpoint}/authenticate`, credentials)
        .then((res) => {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          Session.create({ token: res.data.token });
        }, () => {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    this.logOut = () => {
      return $http
        .post(`${ENV.apiEndpoint}/control/log-out`)
        .then(() => {
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
          Session.destroy();
        }, () => {
          $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
        });
    };

    this.keepAlive = () => {
      $http.post(`${ENV.apiEndpoint}/control/keep-alive`)
        .then(({ data }) => {
          Session.update({ token: data.token }, false);
        }, () => {
          $interval.cancel(this.keepAlivePromise);
          this.keepAlivePromise = null;
        });
    };

    $rootScope.$on("sessionCreated", () => {
      if (this.keepAlivePromise) {
        return;
      }
      this.keepAlivePromise = $interval(this.keepAlive, 1000 * 60 * 15);
      // Refresh user info.
      $http.get(`${ENV.apiEndpoint}/control/user-info`)
        .then(({ data }) => Session.update(data, false));
    });
    $rootScope.$on("sessionDestroyed", () => {
      if (!this.keepAlivePromise) {
        return;
      }
      $interval.cancel(this.keepAlivePromise);
      this.keepAlivePromise = null;
    });
  }
}
