import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (config, StatisticsService, NgMap) {

  this.config = angular.copy(config);

  NgMap.getMap().then((map) => {
    this.map = map;
    this.map.data.loadGeoJson(`${config.hostname}/api/*/${config.apikey}/listenersmap`);
  });

  this.primaryStream = _.findWhere(config.streams, {
    primary: true,
  }).stream;

  this.listeners = {};

  this.updateStats = () => {
    this.config.streams.forEach((entry) => {
      entry.failedLoading = false;
      entry.loadingStats = true;
      StatisticsService.getListeners(this.config.hostname, entry.stream, this.config.apikey)
        .then(listeners => {
          entry.loadingStats = false;
          this.listeners[entry.stream] = listeners;
        }, () => {
          entry.failedLoading = true;
          entry.loadingStats = false;
        });
    });

    if (this.map) {
      this.map.data.loadGeoJson(`${config.hostname}/api/*/${config.apikey}/listenersmap`);
    }
  };
  this.updateStats();

}
