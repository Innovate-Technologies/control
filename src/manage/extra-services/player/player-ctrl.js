import { angular, lodash as _ } from "../../../vendor";

export default /*@ngInject*/ function (
  $rootScope,
  $scope,
  $alert,
  Upload,
  ENV,
  settings,
  PlayerService
) {

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Preview
  ///////////////////////////////////////////////////////////////////////////////////////////////

  $scope.playerUrl = `https://player.shoutca.st/?username=${$scope.service.username}`;
  $scope.previewUrl = $scope.playerUrl;
  $scope.refreshPreview = () => {
    $scope.previewUrl = $scope.playerUrl + `&t=${new Date().getTime()}`;
  };
  $scope.previewWidth = 300;
  $scope.previewHeight = 150;
  $scope.setPreviewSize = (width = 300, height = 150) => {
    if (width) {
      $scope.previewWidth = width;
    }
    if (height) {
      $scope.previewHeight = height;
    }
  };
  $scope.$on("angular-resizable.resizeEnd", (event, { width, height } = {}) =>
    $scope.setPreviewSize(width, height));

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Settings
  ///////////////////////////////////////////////////////////////////////////////////////////////

  let initialiseSettings = (sourceSettings = settings) => {
    $scope.settings = angular.copy(sourceSettings) || {};
    $scope.settings.buttons = $scope.settings.buttons || [];
    $scope.settings.backgroundColour = $scope.settings.backgroundColour || "#000000";
    $scope.settings.tint = $scope.settings.tint || "#ffffff";
    $scope.needsAlternativeTuneInURL = !!$scope.settings.alternativeStreamUrl;
  };

  $scope.disableForm = false;
  initialiseSettings();

  $scope.saveSettings = (newSettings) => {
    $scope.$broadcast("show-errors-check-validity");
    if ($scope.form.$invalid) {
      $alert({
        content: "Please fill in the form correctly first.",
        type: "danger",
        duration: 2,
      });
      return;
    }
    $scope.disableForm = true;
    PlayerService.saveSettings($rootScope.service.username, newSettings).then(() => {
      $scope.disableForm = false;
      $scope.refreshPreview();
      $alert({
        content: "New settings saved.",
        type: "success",
        duration: 5,
      });
    }, (res) => {
      $alert({
        content: "Could not save your settings (" + res.data.error + "). Your settings were not saved. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.disableForm = false;
    });
  };

  $scope.removeSettings = () => {
    initialiseSettings({});
    $scope.disableForm = true;
    PlayerService.removeSettings($rootScope.service.username).then(() => {
      $scope.disableForm = false;
      $alert({
        content: "Your Player settings have been removed. Your Player page is now inaccessible.",
        type: "success",
        duration: 5,
      });
    }, (res) => {
      $alert({
        content: "Could not remove your settings (" + res.data.error + "). Your settings were not removed. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.disableForm = false;
    });
  };

  $scope.addButton = ({ name = "Button", icon = "fa-globe", url = "" } = {}) => {
    $scope.settings.buttons.push({ name, icon, url });
  };

  $scope.removeButton = (button) => {
    $scope.settings.buttons = _.without($scope.settings.buttons, button);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Logo upload
  ///////////////////////////////////////////////////////////////////////////////////////////////

  $scope.onLogoUpload = ($files) => {
    if ($files[0] === undefined) {
      return;
    }
    $scope.settings.logo = null;
    $scope.isUploadingLogo = true;
    $scope.uploadProgressLogo = 0;
    $scope.upload = Upload.upload({
      url: ENV.apiEndpoint + "/control/apps/upload-image",
      method: "POST",
      data: {
        image: $files[0],
      },
    })
      .progress((evt) => {
        $scope.uploadProgressLogo = parseInt(100.0 * evt.loaded / evt.total, 10);
      })
      .success((data) => {
        $scope.isUploadingLogo = false;
        $scope.logoUploaded = true;
        $scope.showUploadControls = false;
        $scope.settings.logo = data.link;
      })
      .error((data) => {
        $scope.isUploadingLogo = false;
        $scope.showUploadControls = true;
        let error = (data && data.error) ? data.error : "could not reach the server";
        $alert({
          content: "Failed to upload your image: " + error,
          type: "danger",
          duration: 15,
        });
      });
  };

  $scope.removeLogo = () => {
    $scope.settings.logo = null;
    document.getElementById("logo").value = ""; // XXX: Find a better way to reset the file input
    $scope.isUploadingLogo = false;
    $scope.logoUploaded = false;
    $scope.showUploadControls = true;
    $scope.uploadProgressLogo = 0;
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // nocover upload
  ///////////////////////////////////////////////////////////////////////////////////////////////

  $scope.onNocoverUpload = ($files) => {
    if ($files[0] === undefined) {
      return;
    }
    $scope.isUploadingNoCover = true;
    $scope.settings.nocover = "";
    $scope.uploadProgressNocover = 0;
    $scope.upload = Upload.upload({
      url: ENV.apiEndpoint + "/control/tunes/upload-nocover/" + $scope.service.username,
      method: "POST",
      data: {
        nocover: $files[0],
      },
    })
      .progress((evt) => {
        $scope.uploadProgressNocover = parseInt(100.0 * evt.loaded / evt.total, 10);
      })
      .success((data) => {
        $scope.isUploadingNocover = false;
        $scope.NocoverUploaded = true;
        $scope.showUploadControls = false;
        $scope.settings.nocover = data.link;
      })
      .error((data) => {
        $scope.isUploadingNoCover = false;
        $scope.showUploadControls = true;
        let error = (data && data.error) ? data.error : "could not reach the server";
        $alert({
          content: "Failed to upload your image: " + error,
          type: "danger",
          duration: 15,
        });
      });
  };

  $scope.removeNocover = () => {
    $scope.settings.nocover = null;
    document.getElementById("nocover").value = ""; // XXX: Find a better way to reset the file input
    $scope.isUploadingNocover = false;
    $scope.NocoverUploaded = false;
    $scope.showUploadControls = true;
    $scope.uploadProgressNocover = 0;
    PlayerService.removeNocover($rootScope.service.username).then(() => {
      $scope.disableForm = false;
      $alert({
        content: "Your default artwork hes been removed.",
        type: "success",
        duration: 5,
      });
    }, (res) => {
      $alert({
        content: "Could not remove your default artwork (" + res.data.error + "). Your default artwork was not removed. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.disableForm = false;
    });
  };

}
