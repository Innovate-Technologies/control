export default class StatisticsService {
    /*@ngInject*/
  constructor($http) {
    this.config = {};

    this.getListeners = (stream) => {
      return $http.get(`${this.config.hostname}/api/${stream}/${this.config.apikey}/listeners`).then(res => res.data);
    };

    this.getOpenSessions = () => {
      return $http.get(`${this.config.hostname}/api/statistics/${this.config.apikey}/get-all-open-sessions`).then(res => res.data);
    };

    this.getCalculatedInfo = (resolution, start, end) => {
      return $http.get(`${this.config.hostname}/api/statistics/${this.config.apikey}/get-calculated-info-for-period/${start}/${end}/${resolution}`).then(res => res.data);
    };
  }
}
