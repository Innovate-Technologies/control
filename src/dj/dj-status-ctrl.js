import io from "socket.io-client";

export default /*@ngInject*/ function ($scope, $alert, $modal, DjConfigService) {
  this.disableForm = false;
  this.socket = null;

  this.current = {};
  this.queue = [];

  this.genresDropdown = [
    { label: "Alternative", value: "Alternative" },
    { label: "Blues", value: "Blues" },
    { label: "Classical", value: "Classical" },
    { label: "Country", value: "Country" },
    { label: "Decades", value: "Decades" },
    { label: "Easy Listening", value: "Easy Listening" },
    { label: "Electronic", value: "Electronic" },
    { label: "Folk", value: "Folk" },
    { label: "Inspirational", value: "Inspirational" },
    { label: "Inspirational", value: "Inspirational" },
    { label: "Jazz", value: "Jazz" },
    { label: "Latin", value: "Latin" },
    { label: "Metal", value: "Metal" },
    { label: "Misc", value: "Misc" },
    { label: "New Age", value: "New Age" },
    { label: "Pop", value: "Pop" },
    { label: "Public Radio", value: "Public Radio" },
    { label: "R&B and Urban", value: "R&B and Urban" },
    { label: "Rap", value: "Rap" },
    { label: "Reggae", value: "Reggae" },
    { label: "Rock", value: "Rock" },
    { label: "Seasonal and Holiday", value: "Seasonal and Holiday" },
    { label: "Soundtracks", value: "Soundtracks" },
    { label: "Talk", value: "Talk" },
    { label: "Themes", value: "Themes" },
  ];

  DjConfigService.getConfig().then((config) => {
    this.enabled = config.DJ.enabled;
    this.config = config;
    if (this.enabled) {
      setUpSockets();
    }
  });

  const setUpSockets = () => {
    this.socket = io(`https://${this.config.username}-dj.radioca.st/queueEvents`);
    this.socket.on("connect", () => {
      this.socket.emit("key", this.config.apikey);
    });
    this.socket.on("queue", (queue) => {
      this.queue = queue.slice(0, 5);
      $scope.$apply();
    });
    this.socket.on("currentSong", (current) => {
      this.current = current;
      $scope.$apply();
    });
  };


  this.enableDisbale = (newValue, oldValue) => {
    if (newValue === oldValue) {
      return;
    }
    if (!newValue) {
      this.config.DJ.enabled = false;
      return DjConfigService.saveConfig(this.config);
    }

    if (!this.config.fadeLength) {
      this.config.fadeLength = 5;
    }
    $modal({ scope: $scope, template: require("./dj-settings.html"), show: true });
  };

  this.enableDJ = () => {
    this.config.DJ.enabled = true;
    DjConfigService.saveConfig(this.config);
    setUpSockets(); // no idea if this will work
  };

  this.disableDJ = () => {
  };

  $scope.$watch("DjStatusCtrl.enabled", this.enableDisbale);

}
