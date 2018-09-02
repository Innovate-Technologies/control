import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (config, ConfigService, $alert, $q, $scope, TunesService) {

  this.streamNames = ["32kbps", "64kbps", "96kbps", "128kbps", "192kbps", "256kbps", "320kbps"];
  this.streams = angular.copy(config.streams) || [];

  this.hideListenerCount = config.hideListenerCount;
  this.antiStreamRipper = config.antiStreamRipper;
  this.isSaving = false;
  this.djEnabled = config.DJ.enabled;
  this.hasTunes = false;

  TunesService.getSongCount(config.username).then(data => {
    if (data.count > 0) {
      this.hasTunes = true;
    }
  });

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

    for (let stream of this.streams) {
      if (stream.isRelay) {
        if (!stream.relay) {
          $alert({
            content: "You need to fill in an URL in order to relay",
            type: "danger",
            duration: 5,
          });
          this.disableForm = false;
          return $q.reject();
        }
        if (stream.relay.indexOf("http") !== 0) {
          stream.relay = `http://${stream.relay}`;
        }
        if (!/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(stream.relay)) {
          $alert({
            content: `${stream.relay} isn't a valid URL`,
            type: "danger",
            duration: 5,
          });
          this.disableForm = false;
          return $q.reject();
        }
      } else {
        stream.relay = "";
      }
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
    ConfigService.setAntiStreamRipper(newIsEnabled).then(() => {
      this.isSaving = false;
      $scope.$emit("invalidate-cast-config-cache");
    });
  });

  $scope.$watch(() => this.hideListenerCount, (newIsEnabled, oldIsEnabled) => {
    if (newIsEnabled === oldIsEnabled) {
      return;
    }
    this.isSaving = true;
    ConfigService.setHideListenerCount(newIsEnabled).then(() => {
      this.isSaving = false;
      $scope.$emit("invalidate-cast-config-cache");
    });
  });

}
