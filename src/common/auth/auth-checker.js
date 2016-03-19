export default class AuthChecker {
    /*@ngInject*/
    constructor(Session, USER_ROLES, localStorageService) {
      this.isAuthenticated = () => {
        if (localStorageService.get("token")) {
          Session.createFromLocalStorage();
        }
        return !!Session.token;
      };
      this.isAuthorized = (authorizedRoles) => {
        if (!Array.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        if (authorizedRoles.indexOf(USER_ROLES.public) !== -1) {
          return true;
        }
        if (authorizedRoles.indexOf(USER_ROLES.all) !== -1 && this.isAuthenticated()) {
          return true;
        }
        return this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.userRole) !== -1;
      };
    }
}
