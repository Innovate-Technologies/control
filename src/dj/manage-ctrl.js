export default /*@ngInject*/ function ($rootScope, service, DjManageService) {
  $rootScope.service = service;
  this.sections = DjManageService.getSections();
  this.isServiceEligible = () => {
    if (!$rootScope.service) {
      return false;
    }
    return $rootScope.service.group.toLowerCase().includes("nodes");
  };
  this.hasEligibleServices = (services) => {
    if (!services || !services.length) {
      return false;
    }
    return services.some((s) => s.group.toLowerCase().includes("nodes"));
  };
}
