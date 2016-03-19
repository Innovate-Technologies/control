export default /*@ngInject*/ function (
  $rootScope,
  $scope,
  $location,
  $alert,
  AuthChecker,
  AuthService,
  ServicesService,
) {

  $scope.isActive = function (viewLocation) {
    return (viewLocation === "/") ? viewLocation === $location.path() : $location.path().indexOf(viewLocation) > -1;
  };

  $scope.logOut = function () {
    AuthService.logOut();
  };

  //////////////////
  // Top bar player
  //////////////////

  var audio;
  $scope.player = {};
  $scope.player.states = { stopped: 0, buffering: 1, playing: 2 };
  $scope.player.state = $scope.player.states.stopped;

  $scope.player.toggle = function (streamUrl) {
    if ($scope.player.state === $scope.player.states.buffering) {
      return;
    }
    if ($scope.player.state === $scope.player.states.playing && audio !== null) {
      audio.removeEventListener("error");
      audio.pause();
      audio.src = "";
      audio = null;
      $scope.player.state = $scope.player.states.stopped;
      return;
    }
    audio = new Audio(streamUrl);
    audio.play();
    audio.addEventListener("playing", function () {
      $scope.player.state = $scope.player.states.playing;
      $scope.$apply();
    });
    audio.addEventListener("error", function () {
            /* global MediaError */
      if (audio.error.code !== MediaError.MEDIA_ERR_ABORTED) {
        $alert({
          content: "Failed to play the stream.",
          type: "danger",
          duration: 3,
        });
      }
      $scope.player.state = $scope.player.states.stopped;
      $scope.$apply();
      audio = null;
    });
    $scope.player.state = $scope.player.states.buffering;
  };

  ////////////
  // Services
  ////////////

  $scope.initServices = function initServices() {
    // returns a promise.
    return ServicesService.initAndGetService().then(function onInitServiceSuccess(service) {
      $rootScope.servicesLoaded = true;
      $rootScope.services = ServicesService.getServicesList();
      $rootScope.service = service;
      return service;
    }, function onInitServiceFail(response) {
      if (response.status === 419) {
        return;
      }
      $alert({
        content: "Apologies, but something went wrong. Please reload the page and try again. If this persists, please check status.shoutca.st for network issues and let us know.",
        type: "danger",
        duration: 600,
      });
      $rootScope.initialLoadError = true;
    });
  };

  $rootScope.reloadServices = function () {
    $rootScope.$broadcast("invalidate-services-cache");
    return $scope.initServices();
  };

  if (AuthChecker.isAuthenticated()) {
    $scope.initServices();
  }

  $rootScope.$watch("service.username", function onSelectedServiceUsernameChange(newUsername) {
    if (!AuthChecker.isAuthenticated()) {
      return;
    }
    if (newUsername && $location.search().username && (newUsername !== $location.search().username)) {
      $location.search("username", null);
      $location.search("serviceId", null);
    }
  });

  $rootScope.$watch("service.id", function onSelectedServiceIdChange(newId, oldId) {
    if (!AuthChecker.isAuthenticated()) {
      return;
    }
    if (newId && $location.search().serviceId && (newId !== $location.search().serviceId)) {
      $location.search("username", null);
      $location.search("serviceId", null);
    }
    if (oldId && newId !== oldId) {
      $rootScope.$broadcast("selected-service-changed", newId);
    }
  });

  var alert;

  $rootScope.$on("cast-only-route", function onCastOnlyRouteEvent() {
    $rootScope.routeLoading = false;
    if (alert) {
      alert.hide();
    }
    alert = $alert({
      content: "The page you are trying to access is only available for Cast nodes.",
      type: "danger",
      duration: 5,
    });
    $location.path("/manage/information");
  });

  $rootScope.$on("route-behind-feature-flag", () => {
    $rootScope.routeLoading = false;
    if (alert) {
      alert.hide();
    }
    alert = $alert({
      content: "The page you are trying to access is not available to you.",
      type: "danger",
      duration: 5,
    });
    $location.path("/");
  });

  $rootScope.$on("invalid-service", function onInvalidServiceEvent() {
    $rootScope.routeLoading = false;
    if (alert) {
      alert.hide();
    }
    alert = $alert({
      content: "The service does not exist.",
      type: "danger",
      duration: 5,
    });
    $location.search("username", null);
    $location.search("serviceId", null);
    $location.path("/manage");
  });

  $rootScope.$on("server-error", function onServerError(event, error) {
    if (alert) {
      alert.hide();
    }
    alert = $alert({
      content: error.message + " (" + error.code + ")",
      type: "danger",
      duration: error.alertDuration,
    });
  });

}
