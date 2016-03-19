import _ from "lodash";
const LOCAL_STORAGE_KEY = "sessionData";

export default class Session {
  /*@ngInject*/
  constructor(USER_ROLES, localStorageService, featureFlags, $rootScope) {
    const updateFeatureFlags = () => {
      const flags = this.sessionData.flags || [];
      featureFlags.set(flags);
      featureFlags.enable({ key: "none" });
    };

    this.create = (data) => {
      if (!data.token) {
        throw new Error("The token is missing from the session data.");
      }
      this.sessionData = data;
      this.token = this.sessionData.token;
      this.userRole = [USER_ROLES.user];
      updateFeatureFlags();
      localStorageService.set(LOCAL_STORAGE_KEY, this.sessionData);
      $rootScope.$broadcast("sessionCreated");
    };

    this.update = (newData = {}, replace = true) => {
      if (!newData.token && replace) {
        throw new Error("The token is missing from the session data.");
      }
      this.sessionData = replace
        ? newData
        : _.extend(this.sessionData, newData);
      this.token = this.sessionData.token;
      updateFeatureFlags();
      localStorageService.set(LOCAL_STORAGE_KEY, this.sessionData);
      $rootScope.$broadcast("sessionUpdated");
    };

    this.createFromLocalStorage = () => {
      const storedValue = localStorageService.get(LOCAL_STORAGE_KEY);
      if (!storedValue) {
        return;
      }
      // Control previously stored the token directly as a string.
      // Remove it to prevent logged in users from storing an old token without knowing it.
      localStorageService.remove("token");
      this.create(storedValue);
    };

    this.destroy = () => {
      this.sessionData = null;
      this.token = null;
      this.userRole = null;
      localStorageService.remove(LOCAL_STORAGE_KEY);
      $rootScope.$broadcast("sessionDestroyed");
    };
  }
}
