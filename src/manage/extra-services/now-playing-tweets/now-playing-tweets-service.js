export default /*@ngInject*/ function NowPlayingTweetsServiceFactory($http, ENV, promiseCache, $rootScope) {
  var NowPlayingTweetsService = {
    submitSettings: function (username, settings) {
      this.invalidateCache();
      settings.disableReason = "";
      return $http.put(ENV.apiEndpoint + "/control/now-playing-tweets/settings/" + username, settings);
    },
    tweetNow: function (username) {
      return $http.post(ENV.apiEndpoint + "/control/now-playing-tweets/tweet/" + username, {});
    },
    enable: function (username, settings) {
      this.invalidateCache();
      settings.isEnabled = true;
      return $http.put(
                ENV.apiEndpoint + "/control/now-playing-tweets/settings/" + username,
                settings
            );
    },
    disable: function (username, settings) {
      this.invalidateCache();
      settings.isEnabled = false;
      return $http.put(
                ENV.apiEndpoint + "/control/now-playing-tweets/settings/" + username,
                settings
            );
    },
    removeSettings: function (username) {
      this.invalidateCache();
      return $http.delete(ENV.apiEndpoint + "/control/now-playing-tweets/settings/" + username);
    },
    invalidateCache: function () {
      if (!$rootScope.service) {
        return;
      }
      var username = $rootScope.service.username;
      promiseCache.remove("nowPlayingTweetsSettings_" + username);
    },
    getSettings: function () {
      if (!$rootScope.service) {
        return;
      }
      var username = $rootScope.service.username;
      return promiseCache({
        promise: function () {
          return $http
                        .get(ENV.apiEndpoint + "/control/now-playing-tweets/settings/" + username)
                        .then(function (response) {
                          return response.data;
                        });
        },
        key: "nowPlayingTweetsSettings_" + username,
        ttl: -1,
      });
    },
  };

  return NowPlayingTweetsService;
}
