export default class ServicesService {
  /*@ngInject*/
  constructor($http, ENV, $rootScope, $location, promiseCache, localStorageService) {
    let cachedServices;
    this.invalidateCache = () => {
      promiseCache.removeAll();
      cachedServices = null;
    };
    this.setServices = (services) => {
      cachedServices = services;
    };
    this.initAndGetService = () => {
      return this.getServicesPromise().then(this.getSelectedService);
    };
    this.initAndGetServices = () => {
      return this.getServicesPromise().then(this.getServicesList);
    };
    this.getServicesPromise = () => {
      return promiseCache({
        promise: () => {
          return $http
            .get(ENV.apiEndpoint + "/control/products")
            .then((response) => {
              cachedServices = response.data;
              return response.data;
            });
        },
        ttl: -1,
      });
    };
    this.getServicesList = () => {
      return cachedServices.filter((service) =>
        service.status === "Active"
          && (service.group.toLowerCase().includes("servers")
            || service.group.toLowerCase().includes("nodes"))
          && !service.name.toLowerCase().includes("free")
      );
    };
    this.getSelectedService = () => {
      let service;
      const lastServiceId = getLastUsedServiceId();
      if (lastServiceId) {
        service = this.getServicesList().find((s) => s.id === lastServiceId);
        if (!service) {
          removeLastUsedServiceId();
          $rootScope.$broadcast("invalid-service");
        }
      }
      if ($location.search().username) {
        service = this.getServicesList().find((s) => s.username === $location.search().username);
        if (!service) {
          $rootScope.$broadcast("invalid-service");
        }
      }
      if ($location.search().serviceId) {
        service = this.getServicesList().find((s) => s.id === $location.search().serviceId);
        if (!service) {
          $rootScope.$broadcast("invalid-service");
        }
      }
      if ($rootScope.service) {
        service = this.getServicesList().find((s) => s.id === $rootScope.service.id);
        if (!service) {
          $rootScope.$broadcast("invalid-service");
        }
      }
      // Fallback to the first service in the list.
      if (!service) {
        service = this.getServicesList()[0];
      }
      return service;
    };

    const LS_KEY = "serviceId";
    const saveLastUsedServiceId = (serviceId) => {
      return localStorageService.set(LS_KEY, serviceId);
    };
    const getLastUsedServiceId = () => {
      return localStorageService.get(LS_KEY);
    };
    const removeLastUsedServiceId = () => {
      return localStorageService.remove(LS_KEY);
    };

    $rootScope.$on("invalidate-services-cache", this.invalidateCache);
    $rootScope.$on("selected-service-changed", (event, serviceId) => {
      saveLastUsedServiceId(serviceId);
    });
  }
}
