export default /*@ngInject*/ function ($scope, FileUploader, ENV, localStorageService, $rootScope, TagsService) {
  const vm = this;
  this.tags = [];

  TagsService.getTags().then((tags) => {
    this.allTags = tags;
  });

  var uploader = $scope.uploader = new FileUploader({
    url: ENV.apiEndpoint + "/control/cast/tunes/upload",
    alias: "song",
    removeAfterUpload: false,
    formData: [
      { username: $rootScope.service.username },
    ],
    headers: {
      // Authorization: "Bearer " + localStorageService.get("sessionData").token,
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

  uploader.onBeforeUploadItem = function (item) {
    const postTags = [];
    for (let tag of vm.tags) {
      postTags.push(tag._id);
    }
    item.formData.push({ tags: JSON.stringify(postTags) });

    item.headers.Authorization = `Bearer ${localStorageService.get("sessionData").token}`;
  };

}
