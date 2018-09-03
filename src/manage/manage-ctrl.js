export default /*@ngInject*/ function ($rootScope, service, $scope, ManageService, AboutService, ConfigService) {
  $rootScope.service = service;
  if (service.group.toLowerCase().indexOf("node") !== -1) {
    ConfigService.getConfig().then((config) => {
      this.castRevision = config.version.Cast;
      checkCastVersion();
    });
  }
  $scope.sections = ManageService.getSections();

  const checkCastVersion = () => {
    AboutService.getCastBuildInfo().then(({ version: stableRevision }) => {
      AboutService.getCastBetaBuildInfo().then(({ version: betaRevision }) =>{
        $scope.castNeedsUpdate = stableRevision !== this.castRevision && betaRevision !== this.castRevision;
      });
    });
  };
}
