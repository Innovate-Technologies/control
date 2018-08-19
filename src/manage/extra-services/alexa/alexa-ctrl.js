import _ from "lodash";

export default /*@ngInject*/ function ($rootScope, $scope, AlexaService, ENV, $routeParams, $location, $alert, settings, Upload) {

  // Initialisation
  var initialiseSettings = function () {
    $scope.languages = [
      { code: "en", name: "English" }, { code: "fr", name: "French" }, { code: "es", name: "spanish" }, { code: "de", name: "German" }, { code: "jp", name: "Japanese" }, { code: "it", name: "Italian" },
    ];
    $scope.languageEnabled = { "en": false, "fr": false, "es": false, "de": false, "jp": false, "it": false };
    $scope.settingsPerLanguage = { "en": {}, "fr": {}, "es": {}, "de": {}, "jp": {}, "it": {} };
    $scope.settings = settings || {};
  };
  initialiseSettings();

  $scope.submitting = false;

  $scope.saveLanguageSettings = function (languageCode) {
    $scope.$broadcast("show-errors-check-validity");
    if ($scope.form.$invalid) {
      $alert({
        content: "Please fill in all required fields correctly.",
        type: "danger",
        duration: 10,
      });
      return;
    }
    $scope.submitting = true;

    settings.languageEntries = _.without(settings.languageEntries, ... _.find(settings.languageEntries, { language: languageCode }));
    $scope.settingsPerLanguage[languageCode].language = languageCode;
    settings.languageEntries.push($scope.settingsPerLanguage[languageCode]);

    AlexaService.submitSettings($rootScope.service.username, settings).then(function () {
      $scope.submitting = false;
      $alert({
        content: "New settings saved.",
        type: "success",
        duration: 5,
      });
    }, function () {
      $alert({
        content: "Something went wrong while saving your settings. Your settings were not saved. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.submitting = false;
    });
  };

  $scope.saveGeneralSettings = function () {
    settings.name = $scope.settings.name;
    settings.logo = $scope.settings.logo;

    // Remove settings, server-side.
    $scope.submitting = true;
    AlexaService.submitSettings($rootScope.service.username, settings).then(function () {
      $scope.submitting = false;
      initialiseSettings();
      $alert({
        content: "Your language settings have been removed.",
        type: "success",
        duration: 5,
      });
    }, function () {
      $alert({
        content: "Something went wrong while removing your settings. Your settings were not saved. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.submitting = false;
    });
  };

  $scope.removeLanguageSettings = function (languageCode) {
    settings.languageEntries = _.without(settings.languageEntries, { language: languageCode });
    $scope.settingsPerLanguage[languageCode] = {};

    if (!settings._id) {
      return;
    }

    // Remove settings, server-side.
    $scope.submitting = true;
    AlexaService.submitSettings($rootScope.service.username, settings).then(function () {
      $scope.submitting = false;
      initialiseSettings();
      $alert({
        content: "Your language settings have been removed.",
        type: "success",
        duration: 5,
      });
    }, function () {
      $alert({
        content: "Something went wrong while removing your settings. Your settings were not saved. Please try again.",
        type: "danger",
        duration: 10,
      });
      $scope.submitting = false;
    });
  };

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
}
