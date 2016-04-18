import { angular, lodash as _ } from "../../../vendor";
import moment from "moment";

export default /*@ngInject*/ function (
  RequestAppService,
  Upload,
  ENV,
  $alert,
  $q,
  $scope,
  $routeParams,
  $location,
  app
) {

  var ctrl = this;
  var platform = $routeParams.platform;

  ctrl.tabTypes = ["facebook", "twitter", "website"];
  ctrl.app = angular.copy(app) || {};
  ctrl.isiOSApp = (platform === "iOS");
  ctrl.isAndroidApp = (platform === "android");
  ctrl.appType = (platform === "iOS") ? "iOS" : "Android";


  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Editable form
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const EDIT_BLOCKED_REASONS = {
    STILL_PENDING: {
      blocked: true,
      reason: "Cannot edit because it was updated more than 5 minutes ago and the request is still pending.",
    },
    IN_PROGRESS: {
      blocked: true,
      reason: "We are currently processing this request.",
    },
    IOS_SUBMITTED: {
      blocked: true,
      reason: "We cannot update apps that are submitted but not yet approved by Apple.",
    },
    DEFAULT: {
      blocked: false,
    },
  };
  /**
   * @param  {Object} appToCheck
   * @return {Object} Returns an object with blocked: Boolean, reason: String.
   */
  ctrl.shouldBlockEditing = (appToCheck = {}) => {
    if (!appToCheck._id) {
      return EDIT_BLOCKED_REASONS.DEFAULT;
    }
    if (appToCheck.status.includes("pending")
      && !appToCheck.selfHosted
      && moment() > moment(appToCheck.lastUpdated || appToCheck.submittedOn).add(5, "minutes")) {
      return EDIT_BLOCKED_REASONS.STILL_PENDING;
    }
    if (appToCheck.status === "inProgress") {
      return EDIT_BLOCKED_REASONS.IN_PROGRESS;
    }
    if (ctrl.isiOSApp && appToCheck.status.includes("submitted")) {
      return EDIT_BLOCKED_REASONS.IOS_SUBMITTED;
    }
    return EDIT_BLOCKED_REASONS.DEFAULT;
  };

  ctrl.hasBeenRejected = () => {
    return (ctrl.app.reviews[0] || {}).actionTaken === "reject";
  };

  ctrl.addTab = function (type, value) {
    if (!ctrl.isAndroidApp && ctrl.app.tabs.length === 3) {
      $alert({
        content: "You cannot have more than 3 tabs.",
        type: "danger",
        duration: 5,
      });
      return;
    }
    ctrl.app.tabs.push({
      type: type || "",
      value: value || "",
    });
  };

  ctrl.removeTab = function (tab) {
    if (ctrl.app.tabs.length === 1) {
      $alert({
        content: "You must have at least one tab.",
        type: "danger",
        duration: 5,
      });
      return;
    }
    ctrl.app.tabs = _.without(ctrl.app.tabs, tab);
  };

  ctrl.beforeSave = function () {
    ctrl.disableForm = true;
  };

  ctrl.save = function () {
    if (ctrl.app.tabs.length === 0) {
      $alert({
        content: "You must have at least one tab.",
        type: "danger",
        duration: 5,
      });
      ctrl.disableForm = false;
      return $q.reject();
    }

    if (!ctrl.isAndroidApp && ctrl.app.tabs.length > 3) {
      $alert({
        content: "You cannot have more than 3 tabs.",
        type: "danger",
        duration: 5,
      });
      ctrl.disableForm = false;
      return $q.reject();
    }

    if ($scope.editableForm.$invalid) {
      $alert({
        content: "You have not filled in the form correctly.",
        type: "danger",
        duration: 5,
      });
      ctrl.disableForm = false;
      return $q.reject();
    }

    return RequestAppService.update(platform, ctrl.app).then(function onSuccess() {
      $alert({
        content: "Successfully updated your app request. It is now pending review from our team.",
        type: "success",
        duration: 3,
      });
      ctrl.disableForm = false;
      return RequestAppService.getRequest(platform).then(function (newApp) {
        ctrl.app = newApp;
      });
    }, function onFail(response) {
      var errorMessage = response.data.error + " Your updates were not saved. Please try again.";
      if (response.data.error.indexOf("INVALID") !== -1) {
        errorMessage = "Your app request is invalid. Please fill in all required fields correctly.";
      }
      $alert({
        content: errorMessage,
        type: "danger",
        duration: 5,
      });
      ctrl.disableForm = false;
      return errorMessage;
    });
  };

  var _app;
  ctrl.onEdit = function () {
    ctrl.uploads = {};
    _app = angular.copy(ctrl.app);
  };
  ctrl.onCancel = function () {
    if (_app) {
      ctrl.app = angular.copy(_app);
    }
  };


  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Uploads
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const UPLOAD_STATES = {
    ready: 0,
    uploading: 1,
    done: 2,
    failed: 3,
  };
  ctrl.uploadStates = UPLOAD_STATES;
  ctrl.uploads = {};

  ctrl.onImageUpload = (name, $files) => {
    if (!$files[0]) {
      return;
    }
    ctrl.app[name] = null;
    ctrl.uploads[name] = ctrl.uploads[name] || {};
    ctrl.uploads[name].state = UPLOAD_STATES.uploading;
    ctrl.uploads[name].progress = 0;
    Upload.upload({
      url: ENV.apiEndpoint + "/control/apps/upload-image?imageType=" + name,
      method: "POST",
      data: {
        image: $files[0],
      },
    }).progress(function (evt) {
      ctrl.uploads[name].progress = parseInt(100.0 * evt.loaded / evt.total, 10);
    }).success(function (data) {
      ctrl.uploads[name].state = UPLOAD_STATES.done;
      ctrl.uploads[name].progress = 100;
      ctrl.app[name] = data.link;
    }).error(function (data) {
      ctrl.uploads[name].state = UPLOAD_STATES.failed;
      ctrl.uploads[name].progress = 100;
      var error = (data && data.error) ? data.error : "could not reach the server";
      $alert({
        content: "Failed to upload your image: " + error,
        type: "danger",
        duration: 15,
      });
    });
  };
}
