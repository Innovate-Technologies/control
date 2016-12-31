export default class DjConfigService {
  /*@ngInject*/
  constructor(ConfigService, $rootScope, $http, ENV) { // The config is embedded in the Cast config.
    /**
     * Return the DJ config for the current selected Cast service.
     * @async
     * @return {Object} DJ config
     */
    this.getConfig = function () {
      return ConfigService.getConfig();
    };

    /**
     * Save the DJ config (as in PUT) and invalidate the cache
     * @param  {Object} config
     * @async
     */
    this.saveConfig = (config) => {
      const username = $rootScope.service.username;
      return $http.post(`${ENV.apiEndpoint}/control/cast/dj/settings/${username}`, {
        enabled: config.DJ.enabled,
        name: config.name,
        genre: config.genre,
        fadeLength: config.DJ.fadeLength,
      }).then(this.invalidateCache);
    };
  }
}
