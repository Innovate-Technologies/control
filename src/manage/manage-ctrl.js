export default /*@ngInject*/ function ($rootScope, service, $scope, ManageService, AboutService, ConfigService) {
  $scope.service = service;
  if (service.group.toLowerCase().indexOf("node") !== -1) {
    ConfigService.getConfig().then((config) => {
      this.castRevision = config.version.Cast;
      checkCastVersion();
    });
  }
  $scope.sections = ManageService.getSections();

  const checkCastVersion = () => {
    AboutService.getCastBuildInfo().then(({ version: revision }) => {
      if (revision !== this.castRevision) {
        $scope.castNeedsUpdate = true;
      }
    });
  };
}
