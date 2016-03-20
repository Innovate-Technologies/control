import { lodash as _ } from "../vendor";

/*@ngInject*/
export default class DjServicesService {
  /*@ngInject*/
  constructor(ENV, $http, $location, promiseCache) {
    let cachedServices;
    this.invalidateCache = () => {
      promiseCache.removeAll();
      cachedServices = null;
    };
    this.initAndGetService = () => {
      return this.getServicesPromise().then(this.getSelectedService);
    };
    this.initAndGetServices = () => {
      return this.getServicesPromise().then(this.getServicesList);
    };
    this.getServicesPromise = () => {
      return promiseCache({
        promise: () => $http
          .get(`${ENV.apiEndpoint}/control/products`)
          .then(({ data }) => {
            cachedServices = data;
            return data;
          }),
        ttl: -1,
      });
    };
    this.getServicesList = () => {
      return _.filter(cachedServices, (service) => {
        return service.status === "Active"
          && service.group.toLowerCase().includes("dj");
      });
    };
    this.getSelectedService = () => {
      var service;
      if (!service) {
        service = this.getServicesList()[0];
      }
      return service;
    };
  }
}
