export default /*@ngInject*/ function PlayerServiceFactory(
    $rootScope,
    $http,
    ENV,
    promiseCache) {

  let PlayerService = {
    saveSettings(username, settings) {
      this.invalidateCache();
      return $http.put(ENV.apiEndpoint + "/control/player/settings/" + username, settings);
    },
    removeSettings(username) {
      this.invalidateCache();
      return $http.delete(ENV.apiEndpoint + "/control/player/settings/" + username);
    },
    removeNocover(username) {
      this.invalidateCache();
      return $http.delete(ENV.apiEndpoint + "/control/tunes/nocover/" + username);
    },
    invalidateCache() {
      if (!$rootScope.service) {
        return;
      }
      let username = $rootScope.service.username;
      promiseCache.remove("playerSettings_" + username);
    },
    getSettings() {
      if (!$rootScope.service) {
        return;
      }
      let username = $rootScope.service.username;
      return promiseCache({
        promise() {
          return $http
                        .get(ENV.apiEndpoint + "/control/player/settings/" + username)
                        .then(response => response.data);
        },
        key: "playerSettings_" + username,
        ttl: -1,
      });
    },
  };

  return PlayerService;
}
