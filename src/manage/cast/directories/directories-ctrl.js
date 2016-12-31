import { angular, lodash as _ } from "../../../vendor";

export default /*@ngInject*/ function ($scope, config, choices, DirectoriesService) {
  this.config = angular.copy(config);
  this.directories = angular.copy(choices);

  this.directories.forEach((directory) => {
    directory.isEnabled = (config.directories.Icecast.indexOf(directory.url) !== -1);
    $scope.$watch(() => directory.isEnabled, (newIsEnabled, oldIsEnabled) => {
      if (newIsEnabled === oldIsEnabled) {
        return;
      }
      if (newIsEnabled) {
        this.isSaving = true;
        DirectoriesService.enableDirectory(directory).then(() => this.isSaving = false);
      }
      if (!newIsEnabled) {
        this.isSaving = true;
        DirectoriesService.disableDirectory(directory).then(() => this.isSaving = false);
      }
    });
  });

  this.getDirectoryByName = (name) => _.find(this.directories, { name: name });

}
