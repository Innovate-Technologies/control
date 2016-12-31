import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (config, ConfigService, $alert, $q, $scope) {

  this.streamNames = ["32kbps", "64kbps", "96kbps", "128kbps", "192kbps", "256kbps", "320kbps"];
  this.streams = angular.copy(config.streams) || [];

  this.hideListenerCount = config.hideListenerCount;
  this.hideListenerCount = config.antiStreamRipper;
  this.isSaving = false;
  this.djEnabled = config.DJ.enabled;

  /////////////////
  // Editable form
  /////////////////

  this.addStream = () => {
    if (this.streams.length === 3) {
      $alert({
        content: "You cannot have more than 3 streams.",
        type: "danger",
        duration: 5,
      });
      return;
    }
    this.streams.push({});
  };

  this.removeStream = (stream) => {
    if (this.streams.length === 1) {
      $alert({
        content: "You must have at least one stream.",
        type: "danger",
        duration: 5,
      });
      return;
    }
    this.streams = _.without(this.streams, stream);
  };

  this.beforeSave = () => {
    this.disableForm = true;
  };

  this.save = () => {
    if (this.streams.length === 0) {
      $alert({
        content: "You must have at least one stream.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
      return $q.reject();
    }

    if (this.streams.length > 3) {
      $alert({
        content: "You cannot have more than 3 streams.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
      return $q.reject();
    }

    if (_. filter(this.streams, { primary: true }).length === 0) {
      $alert({
        content: "You must have one primary stream.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
      return $q.reject();
    }

    if (_. filter(this.streams, { primary: true }).length > 1) {
      $alert({
        content: "You must have only one primary stream.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
      return $q.reject();
    }

    if ($scope.editableForm.$invalid) {
      $alert({
        content: "You have not filled in the form correctly.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
      return $q.reject();
    }

    return ConfigService.saveStreamsConfig(this.streams).then(() => {
      $alert({
        content: "Successfully saved your stream config.",
        type: "success",
        duration: 3,
      });
      $scope.$emit("invalidate-cast-config-cache");
      this.disableForm = false;
    }, () => {
      $alert({
        content: "Failed to save the new config. Your stream config was not saved. Please try again.",
        type: "danger",
        duration: 5,
      });
      this.disableForm = false;
    });
  };

  let _streams;
  this.onEdit = () => {
    _streams = angular.copy(this.streams);
    var primaryCheckboxes = _. filter($scope.editableForm.$editables, { name: "stream.primary" });
    primaryCheckboxes.forEach((item) => {
      item.scope.$watch("$data", (isPrimary, oldValue) => {
        if (!isPrimary || isPrimary === oldValue) {
          return;
        }
        var otherCheckboxes = _.without(primaryCheckboxes, item);
        otherCheckboxes.forEach((otherItem) => {
          if (!otherItem.scope.$data) {
            return;
          }
          otherItem.scope.$data = false;
        });
      });
    });
  };
  this.onCancel = () => {
    this.streams = angular.copy(_streams);
  };


  $scope.$watch(() => this.antiStreamRipper, (newIsEnabled, oldIsEnabled) => {
    if (newIsEnabled === oldIsEnabled) {
      return;
    }
    this.isSaving = true;
    ConfigService.setAntiStreamRipper(newIsEnabled).then(() => this.isSaving = false);
  });

  $scope.$watch(() => this.hideListenerCount, (newIsEnabled, oldIsEnabled) => {
    if (newIsEnabled === oldIsEnabled) {
      return;
    }
    this.isSaving = true;
    ConfigService.setHideListenerCount(newIsEnabled).then(() => this.isSaving = false);
  });

}
