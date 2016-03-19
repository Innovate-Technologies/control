export default class AuthService {
  /*@ngInject*/
  constructor(
    $http,
    $rootScope,
    $interval,
    ENV,
    AUTH_EVENTS,
    Session,
    promiseCache,
    featureFlags,
  ) {
    this.keepAlivePromise = null;
    this.logIn = function (credentials) {
      return $http
        .post(ENV.apiEndpoint + "/authenticate", credentials)
        .then((res) => {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          Session.create(res.data.token);
        }, () => {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };

    this.logOut = function () {
      return $http
        .post(`${ENV.apiEndpoint}/control/log-out`)
        .then(() => {
          $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
          Session.destroy();
        }, () => {
          $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
        });
    };

    this.keepAlive = function () {
      $http.post(`${ENV.apiEndpoint}/control/keep-alive`)
        .then((res) => {
          Session.update(res.data.token);
        }, function () {
          $interval.cancel(AuthService.keepAlivePromise);
          AuthService.keepAlivePromise = null;
        });
    };

    const USER_INFO_CACHE_KEY = "userInfo";
    this.getUserInfo = () => {
      if (!Session.token) {
        return Promise.reject("no valid token");
      }
      return promiseCache({
        promise: () => $http.get(`${ENV.apiEndpoint}/control/user-info`)
          .then(response => response.data),
        key: USER_INFO_CACHE_KEY,
        ttl: -1,
      });
    };
    let invalidateUserInfoCache = () => {
      promiseCache.remove(USER_INFO_CACHE_KEY);
    };

    $rootScope.$on("sessionCreated", () => {
      if (this.keepAlivePromise) {
        return;
      }
      this.keepAlivePromise = $interval(this.keepAlive, 1000 * 60 * 15);
      this.getUserInfo().then(({ flags = [] }) => {
        featureFlags.set(flags);
        featureFlags.enable({ key: "none" });
      });
    });
    $rootScope.$on("sessionDestroyed", () => {
      invalidateUserInfoCache();
      if (!this.keepAlivePromise) {
        return;
      }
      $interval.cancel(this.keepAlivePromise);
      this.keepAlivePromise = null;
    });
  }
}
