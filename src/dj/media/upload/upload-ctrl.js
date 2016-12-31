export default /*@ngInject*/ function ($scope, FileUploader, ENV, localStorageService, $rootScope) {
  $scope.uploader = new FileUploader({
    url: ENV.apiEndpoint + "/control/cast/tunes/upload",
    alias: "song",
    removeAfterUpload: false,
    formData: [
      { username: $rootScope.service.username },
    ],
    headers: {
      Authorization: "Bearer " + localStorageService.get("sessionData").token,
    },
    filters: [
      {
        name: "songFilter",
        fn: function (item) {
          var type = "|" + item.type.slice(item.type.lastIndexOf("/") + 1) + "|";
          return "|mp3|mpeg|mp4|m4a|x-m4a|ogg|flac|wav|amr|".indexOf(type) !== -1;
        },
      },
    ],
  });
}
