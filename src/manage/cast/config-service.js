export default class ConfigService {
  /*@ngInject*/
  constructor($http, ENV, promiseCache, $rootScope, $q) {
    this.invalidateCache = function () {
      const username = $rootScope.service.username;
      promiseCache.remove("castConfig_" + username);
    };

    this.getConfig = function () {
      const username = $rootScope.service.username;
      if ($rootScope.service.group.toLowerCase().indexOf("nodes") === -1) {
        return $q.reject("selected service is a non-Cast service");
      }
      return promiseCache({
        promise: function () {
          return $http
            .get(ENV.apiEndpoint + "/control/cast/configuration/" + username)
            .then(function (response) {
              return response.data;
            });
        },
        key: "castConfig_" + username,
        ttl: -1,
      });
    };

    /**
     * Get an array of countries from /app/common/iso-3166-2-countries.json
     * @return {Promise}
     */
    this.getCountries = () => require("../../common/iso-3166-2-countries.json");

    /**
     * Save GeoLock configuration for a Cast service.
     * @param  {Object}  config    GeoLock configuration object
     *                             { enabled: true/false, mode: "whitelist"/"blacklist",
     *                               countryCodes: ["BE", "FR", "GB"] }
     * @return {Promise}
     */
    this.saveGeoLockConfig = (config) => {
      const username = $rootScope.service.username;
      return $http.put(`${ENV.apiEndpoint}/control/cast/geolock/${username}`, config)
        .then(response => response.data);
    };

    /**
     * Save the streams config
     * @param {Array} config - An array of streams
     */
    this.saveStreamsConfig = (config) => {
      const username = $rootScope.service.username;
      return $http.put(`${ENV.apiEndpoint}/control/cast/streams/${username}`, config)
        .then(response => response.data);
    };

    /**
     * Set hide listener count
     * @param {Boolead} isEnabled - Whether to enable or disable
     */
    this.setHideListenerCount = (isEnabled) => {
      const username = $rootScope.service.username;
      return $http.put(`${ENV.apiEndpoint}/control/cast/hide-listener-count/${username}`, { isEnabled })
        .then(response => response.data);
    };

    /**
     * Set anti stream ripper
     * @param {Boolead} isEnabled - Whether to enable or disable
     */
    this.setAntiStreamRipper = (isEnabled) => {
      const username = $rootScope.service.username;
      return $http.put(`${ENV.apiEndpoint}/control/cast/anti-stream-ripper/${username}`, { isEnabled })
        .then(response => response.data);
    };

    $rootScope.$on("invalidate-cast-config-cache", this.invalidateCache);
  }
}
