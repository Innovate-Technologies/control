import enumeration from "../../../common/enum-helper";

export default /*@ngInject*/ function AboutCtrl(
    $alert,
    $http,
    $scope,
    ConfigService,
    AboutService,
    config
) {
  this.config = config;

  this.castStates = enumeration({
    CHECKING: 0,
    UPDATE_AVAILABLE: 2,
    NO_UPDATE: 1,
    UPDATING: 3,
    UPDATE_ERROR: -3,
    CHECK_ERROR: -1,
  });

  this.castState = this.castStates.CHECKING;

  this.getCurrentCastVersion = (_config) => {
    this.castRevision = _config.version.Cast || "unknown";
    AboutService.getCastVersion(_config.hostname).then((response) => {
      this.castVersion = response.version;
    });
  };

  this.checkForCastUpdates = () => {
    AboutService.getCastBuildInfo().then(({ version: revision }) => {
      if (revision !== this.castRevision) {
        this.castState = this.castStates.UPDATE_AVAILABLE;
      } else {
        this.castState = this.castStates.NO_UPDATE;
      }
    }, () => {
      this.castState = this.castStates.CHECK_ERROR;
    });
  };

  this.updateCast = () => {
    this.castState = this.castStates.UPDATING;
    AboutService.updateCast().then(() => {
      this.castState = this.castStates.NO_UPDATE;
      ConfigService.invalidateCache();
      ConfigService.getConfig().then(this.getCurrentCastVersion);
    }, () => {
      this.castState = this.castStates.UPDATE_ERROR;
    });
  };

  this.getCurrentCastVersion(this.config);
  this.checkForCastUpdates();
}
