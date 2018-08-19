export default /*@ngInject*/ function alexaServiceFactory($http, ENV, promiseCache, $rootScope) {
  var alexaService = {
    submitSettings: function (username, settings) {
      this.invalidateCache();
      return $http.put(ENV.apiEndpoint + "/control/alexa/settings/" + username, settings);
    },
    removeSettings: function (username) {
      this.invalidateCache();
      return $http.delete(ENV.apiEndpoint + "/control/alexa/settings/" + username);
    },
    invalidateCache: function () {
      if (!$rootScope.service) {
        return;
      }
      var username = $rootScope.service.username;
      promiseCache.remove("alexaSettings_" + username);
    },
    getSettings: function () {
      if (!$rootScope.service) {
        return;
      }
      var username = $rootScope.service.username;
      return promiseCache({
        promise: function () {
          return $http
                        .get(ENV.apiEndpoint + "/control/alexa/settings/" + username)
                        .then(function (response) {
                          return response.data;
                        });
        },
        key: "alexaSettings_" + username,
        ttl: -1,
      });
    },
  };

  return alexaService;
}
