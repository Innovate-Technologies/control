export default /*@ngInject*/ function ($rootScope, $scope, NowPlayingTweetsService, ENV, $routeParams, $location, $alert, settings) {

    // Initialisation
  var initialiseSettings = function () {
    $scope.nowPlayingState = settings.isEnabled;
    $scope.settings = {};
    $scope.settings.tweet = settings.tweet || "#NowPlaying %title - %artist";
    $scope.settings.mode = settings.mode || "interval";
    $scope.settings.interval = settings.interval || 5;
    $scope.settings.consumerKey = settings.consumerKey;
    $scope.settings.consumerSecret = settings.consumerSecret;
    $scope.settings.accessToken = settings.accessToken;
    $scope.settings.accessTokenSecret = settings.accessTokenSecret;
  };
  initialiseSettings();

  $scope.submitting = false;

    // Functions
  var changeStateSuccess = function () {
    $scope.submitting = false;
  };

  var changeStateFailure = function (oldValue) {
    $alert({
      content: "Could not enable/disable #NowPlaying. Please try again.",
      type: "danger",
      duration: 10,
    });
    unregisterWatch();
    $scope.nowPlayingState = oldValue;
    watchNowPlayingSwitch();
    $scope.submitting = false;
  };

  var unregisterWatch;
  var watchNowPlayingSwitch = function () {
    unregisterWatch = $scope.$watch("nowPlayingState", function (newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

      $scope.submitting = true;
      if ($scope.nowPlayingState) {
        NowPlayingTweetsService.enable($rootScope.service.username, $scope.settings).then(changeStateSuccess, function () { changeStateFailure(oldValue); });
      } else {
        NowPlayingTweetsService.disable($rootScope.service.username, $scope.settings).then(changeStateSuccess, function () { changeStateFailure(oldValue); });
      }
    });
  };
  watchNowPlayingSwitch();

  $scope.submitSettings = function (newSettings) {
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
    NowPlayingTweetsService.submitSettings($rootScope.service.username, newSettings).then(function () {
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

  $scope.removeSettings = function () {
        // Reset settings.
    settings = { isEnabled: false };
    unregisterWatch();

        // Remove settings, server-side.
    $scope.submitting = true;
    NowPlayingTweetsService.removeSettings($rootScope.service.username).then(function () {
      $scope.submitting = false;
      $scope.nowPlayingState = false;
      initialiseSettings();
      watchNowPlayingSwitch();
      $alert({
        content: "Your #NowPlaying settings have been removed.",
        type: "success",
        duration: 5,
      });
    }, function () {
      $alert({
        content: "Something went wrong while removing your settings. Your settings were not saved. Please try again.",
        type: "danger",
        duration: 10,
      });
      watchNowPlayingSwitch();
      $scope.submitting = false;
    });
  };

  $scope.tweetNow = function () {
    NowPlayingTweetsService.tweetNow($rootScope.service.username).then(() => {
      $alert({
        content: "A tweet has been sent!",
        type: "success",
        duration: 5,
      });
    }, () => {
      $alert({
        content: "Something went wrong sending your tweet",
        type: "danger",
        duration: 10,
      });
    });
  };
}
