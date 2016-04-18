import { angular } from "../../../vendor";

export default /*@ngInject*/ function (
  $rootScope,
  $scope,
  RequestAppService,
  ENV,
  $alert,
  apps,
  $q
) {

  $scope.apps = angular.copy(apps) || {};

  $scope.showConfirmForm = () => {
    if ($scope.form.$invalid) {
      $alert({
        content: "Please fill in all required fields correctly before continuing.",
        type: "danger",
        duration: 5,
      });
      $scope.isConfirmStep = false;
      return;
    }
    $scope.isConfirmStep = true;
  };
  $scope.hideConfirmForm = () => $scope.isConfirmStep = false;

  let areNoPlatformsSelected = (x, y, scope) => {
    let platforms = scope.fields.filter(field => {
      return typeof field.key === "string"
        && field.key.includes("platforms")
        && scope.model.platforms[field.key.replace("platforms.", "")];
    });
    return platforms.length === 0;
  };

  $scope.confirmFormFields = [
    {
      key: "logoNotBlurry",
      type: "checkbox",
      templateOptions: {
        required: true,
        label: "My logo is not a blurry mess (dimensions of at least 128×128)",
      },
    },
    {
      key: "iconOfCorrectDimensions",
      type: "checkbox",
      templateOptions: {
        required: true,
        label: "My icon respects the guideline dimensions (512×512 for Android, 1024×1024 for iOS or both)",
      },
    },
    { template: "<hr>" },
    {
      key: "isMyImage",
      type: "radio",
      templateOptions: {
        required: true,
        label: "Do I own the images in the app request?",
        options: [
          { value: "yes", name: "Yes" },
          { value: "no", name: "No, I found them on the Internet, generated them online, or someone made them for me" },
        ],
      },
    },
    {
      hideExpression: "!model.isMyImage",
      fieldGroup: [
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am not using logos I do not own",
          },
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am not including intellectual property, trademarks or patented material in my images",
          },
        },
        {
          key: "rejectMeImmediately",
          type: "checkbox",
          templateOptions: {
            required: false,
            label: "I want my request to be rejected immediately",
          },
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am not using images of any person (including artists, actors, actresses and DJs)",
          },
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am allowed to use the images (according to the license) or I have permission from the copyright owner",
          },
          hideExpression: 'model.isMyImage === "yes"',
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "My image does not contain elements directly taken from other images, unless I have express and written permission",
          },
          hideExpression: 'model.isMyImage === "no"',
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am not using images without a declared and clear license",
          },
          hideExpression: 'model.isMyImage === "yes"',
        },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I am not violating the images' license",
            description: "What constitutes a violation depends on the images' license. Most of the time, using the images without proper attribution is a violation.",
          },
          hideExpression: 'model.isMyImage === "yes"',
        },
        { template: "<hr>" },
        {
          type: "checkbox",
          templateOptions: {
            required: true,
            label: "I agree that my service can be suspended if I do not own all rights on the images",
            description: "I agree that my service can be suspended without prior warning and compensation if I do not own the rights to use the images. I have to tick this before continuing. I confirm that I *do* have permission to use the images.",
          },
        },
      ],
    },
  ];

  $scope.requestFields = [
    // Platforms
    {
      key: "platforms.android",
      type: "fullHorizontalCheckbox",
      defaultValue: !$scope.apps.android,
      templateOptions: {
        label: "Submit for Android",
        description: !$scope.apps.android
          ? "Tick this if you want us to build and submit an Android app."
          : "You have already submitted an Android app request.",
        disabled: !!$scope.apps.android,
      },
      expressionProperties: {
        "templateOptions.required": areNoPlatformsSelected,
      },
    },
    {
      key: "platforms.iOS",
      type: "fullHorizontalCheckbox",
      defaultValue: !$scope.apps.iOS,
      templateOptions: {
        label: "Submit for iOS",
        description: !$scope.apps.iOS
          ? "Tick this if you want us to build and submit an iOS app (for iPhone, iPad and iPod)."
          : "You have already submitted an iOS app request.",
        disabled: !!$scope.apps.iOS,
      },
      expressionProperties: {
        "templateOptions.required": areNoPlatformsSelected,
      },
    },
    { template: "<hr><br>" },

    // Base information
    {
      key: "name",
      type: "horizontalInput",
      templateOptions: {
        type: "text",
        label: "App Name",
        required: true,
        maxlength: 30,
        placeholder: "My Station Name",
        description: "Your application name. Must be shorter than 30 characters.",
        addonLeft: {
          class: "fa fa-pencil-square-o fa-fw",
        },
      },
    },
    {
      key: "keywords",
      type: "horizontalInput",
      templateOptions: {
        type: "text",
        label: "App Keywords",
        required: true,
        maxlength: 100,
        description: "The keywords are separated by commas and must be under 100 characters. This is used for the App Store.",
        addonLeft: {
          class: "fa fa-tags fa-fw",
        },
      },
      hideExpression: "!model.platforms.iOS",
    },
    {
      key: "shortDescription",
      type: "horizontalTextarea",
      templateOptions: {
        type: "horizontalTextarea",
        label: "Short Description",
        required: true,
        maxlength: 80,
        description: "A short description of your app. This'll be the first description the user sees in the Play Store. Must be shorter than 80 characters.",
        rows: 2,
        addonLeft: {
          class: "fa fa-bars fa-fw",
        },
      },
      hideExpression: "!model.platforms.android",
    },
    {
      key: "description",
      type: "horizontalTextarea",
      templateOptions: {
        type: "horizontalTextarea",
        label: "App Description",
        required: true,
        maxlength: 4000,
        placeholder: "A description for your app, which shouldn't be too short and should have a minimum of 2 sentences. (Must be shorter than 4000 characters.)",
        description: "Describe your station. Why should someone download the app and listen to it? Avoid excessive keywords and pay attention to the grammar, as your app could get rejected otherwise. Also, do not write in ALL CAPS.",
        rows: 4,
        addonLeft: {
          class: "fa fa-bars fa-fw",
        },
      },
    },
    { template: "<hr><br>" },

    // Tabs
    {
      key: "website",
      type: "horizontalInput",
      templateOptions: {
        type: "url",
        label: "Website",
        placeholder: "https://shoutca.st",
        description: "Use HTTPS if your website supports it.",
        addonLeft: {
          class: "fa fa-globe fa-fw",
        },
      },
      expressionProperties: {
        "templateOptions.required": "!model.facebook && !model.twitter",
      },
    },
    {
      key: "twitter",
      type: "horizontalInput",
      templateOptions: {
        type: "text",
        label: "Twitter",
        placeholder: "shoutca_st",
        description: "Only provide the Twitter handle, *without* the @.",
        addonLeft: {
          class: "fa fa-twitter-square fa-fw",
        },
      },
      expressionProperties: {
        "templateOptions.required": "!model.facebook && !model.website",
      },
    },
    {
      key: "facebook",
      type: "horizontalInput",
      templateOptions: {
        type: "text",
        label: "Facebook",
        placeholder: "shoutcastsolutions",
        description: "Only use this for Facebook pages. Groups are not supported. Only provide the page username or page ID.",
        pattern: "^((?!groups).)*$",
        addonLeft: {
          class: "fa fa-facebook-square fa-fw",
        },
      },
      expressionProperties: {
        "templateOptions.required": "!model.twitter && !model.website",
      },
    },
    {
      template: `<div class="form-group">
<div class="col-sm-offset-3 col-sm-9">
    <p class="help-block"><fa name="lightbulb-o"></fa> Only one additional link is required. Please open a ticket <b>immediately after submission</b> if you need more than 3 additional links.</p>
</div>
</div>`,
    },
    { template: "<hr><br>" },

    // Colours
    {
      key: "backgroundColour",
      type: "horizontalColorpicker",
      templateOptions: {
        label: "Background Colour",
        required: true,
        placeholder: "#123456",
        description: "A colour in long hexadecimal form (example: #123456). This will be used for the app's background colour.",
      },
    },
    {
      key: "tint",
      type: "horizontalColorpicker",
      templateOptions: {
        label: "Tint",
        placeholder: "#123456",
        description: "A colour in long hexadecimal form (example: #123456). Will be used for the app's tint (button and text on iOS, volume slider on Android). This is optional on Android; if empty, it will be determined automatically.",
      },
      expressionProperties: {
        "templateOptions.required": "model.platforms.iOS",
      },
    },
    {
      key: "actionBarColour",
      type: "horizontalColorpicker",
      templateOptions: {
        label: "Action Bar Colour",
        placeholder: "#123456",
        description: "A colour in long hexadecimal form (example: #123456). Will be used for the app's action bar (the top bar); if empty, this will be determined automatically.",
      },
      hideExpression: "!model.platforms.android",
    },
    // Graphics
    {
      key: "icon",
      type: "horizontalUpload",
      templateOptions: {
        label: "Icon",
        required: true,
        description: "",
        accept: "image/gif, image/jpeg, image/png",
        fileFormName: "image",
        url: ENV.apiEndpoint + "/control/apps/upload-image?imageType=icon",
      },
      expressionProperties: {
        "templateOptions.description": `'The image that will represent your app. Avoid putting too much detail in the app icon. The size must be ' + (model.platforms.iOS ? '1024×1024' : '512×512') + ' or it will not look good. (JPG, PNG and GIF only. PNG highly recommended.)'`,
      },
    },
    {
      key: "logo",
      type: "horizontalUpload",
      templateOptions: {
        label: "Logo",
        required: true,
        description: "The image that will represent your station: your station logo. No size limitation, but it shouldn't be too small (or the logo will look blurry). (JPG, PNG and GIF only. PNG highly recommended.)",
        accept: "image/gif, image/jpeg, image/png",
        fileFormName: "image",
        url: ENV.apiEndpoint + "/control/apps/upload-image",
      },
    },
    {
      key: "featureGraphic",
      type: "horizontalUpload",
      templateOptions: {
        label: "Feature Graphic",
        required: true,
        description: "An image that will be displayed at the top of your app details page in the Play Store. *Must* be 1024×500 or it won't look good. (JPG, PNG and GIF only. PNG highly recommended.)",
        accept: "image/gif, image/jpeg, image/png",
        fileFormName: "image",
        url: ENV.apiEndpoint + "/control/apps/upload-image?imageType=featureGraphic",
      },
      hideExpression: "!model.platforms.android",
    },
    { template: "<hr>" },

    // Alternative stream URL
    {
      template: `<div class="form-group">
  <label class="control-label col-sm-3">Alternative Stream URL</label>
  <div class="col-sm-9">
  <p>Please open a ticket if you need to use an alternative stream URL for licensing or any other legal reason.</p>
  </div>
</div>`,
    },
    { template: "<hr>" },

    // Self-hosted
    {
      key: "selfHosted",
      type: "fullHorizontalCheckbox",
      hideExpression: "!model.platforms.android",
      defaultValue: true,
      templateOptions: {
        label: "Host the Android app myself",
      },
    },
    {
      hideExpression: "!model.platforms.android",
      template: `
<p class="help-block">You can choose to have your Android app submitted to our Google Play developer account (shared with other apps), or use your own which gives you better flexibility and reliability as your app is then independent.</p>
<p class="help-block text-danger"><b>WARNING: If you don't host the app yourself, you may have to wait for a very long time (a few months) while we are working to resolve this issue with Google.</b></p>
<p class="help-block">For more information, please refer to <a href="https://docs.shoutca.st/v1.0/docs/apps#self-host-your-android-apps">the documentation</a>.</p>
`,
    },
    {
      template: "<hr>",
      hideExpression: "!model.platforms.android",
    },

    {
      template: `<p class="text-warning"><fa name="warning"></fa> For iOS apps, make sure that you are not mentioning other platforms such as Android in your app descriptions or even on your website. Otherwise, Apple may reject your app.</p>`,
      hideExpression: "!model.platforms.iOS",
    },
  ];

  var onAppSubmitted = function () {
    $alert({
      content: "We have received your app request and will process it as soon as we can.",
      type: "success",
      duration: 5,
    });
    $scope.justSubmitted = true;
    RequestAppService.getAppsObject().then(function (newApps) {
      $scope.apps = newApps;
    });
  };

  var onFail = function (res) {
    var error = (res.data && res.data.error) ? res.data.error : "Could not reach the server.";
    $alert({
      content: error + " If this persists, please let us know.",
      type: "danger",
      duration: 15,
    });
    $scope.submittingForm = false;
    $scope.justSubmitted = false;
  };

  $scope.submittingForm = false;
  $scope.request = {};

  $scope.submit = (request) => {
    $scope.submittingForm = true;
    if ($scope.form.$invalid) {
      $alert({
        content: "Please fill in all required fields correctly.",
        type: "danger",
        duration: 5,
      });
      $scope.hideConfirmForm();
      $scope.submittingForm = false;
      return;
    }

    request.username = $rootScope.service.username;
    if (!request.needsAlternativeStreamUrl) {
      request.alternativeStreamUrl = undefined;
    }

    if ($scope.confirmFormModel.rejectMeImmediately) {
      request.rejectMeImmediately = true;
    }

    let promises = [];
    for (let platform in request.platforms) {
      if (request.platforms.hasOwnProperty(platform) && request.platforms[platform]) {
        promises.push(RequestAppService.submit(platform, request));
      }
    }
    $q.all(promises).then(onAppSubmitted, onFail);
  };
}
