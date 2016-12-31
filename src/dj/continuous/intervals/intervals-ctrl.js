import { lodash as _, angular, moment } from "../../../vendor";

export default /*@ngInject*/ function ($scope, IntervalsService, $q, $modal, TunesService, TagsColorService) {
  let _intervals;
  let _removedIntervals = [];
  let _oldSongs = [];

  this.editSongsSelectedInterval = null;
  this.songsAvailable = [];
  this.now = new Date();
  this.tagsColorService = TagsColorService;

  $scope.moment = moment;
  this.intervals = [];

  IntervalsService.getIntervals().then((intervals) => {
    this.intervals = intervals;
  });

  // convert dte string to date
  for (let interval of this.intervals) {
    interval.start = new Date(interval.start);
    interval.end = new Date(interval.end);
  }

  this.isSaving = false;


  this.intervalTypes = [
    { value: "random", text: "Random selection" },
    { value: "ordered", text: "Play in order" },
    { value: "all", text: "Play all songs of interval" },
  ];

  this.intervalModes = [
    { value: "songs", text: "songs" },
    { value: "seconds", text: "seconds" },
  ];

  // form functions

  this.addInterval = () => {
    this.intervals.push({
      "name": "",
      "songs": [],
      "intervalType": "random",
      "every": 1,
      "intervalMode": "songs",
      "songsAtOnce": 1,
      "start": new Date(),
      "end": new Date(),
      "forever": false,
    });
  };

  this.removeInterval = (interval) => {
    this.intervals = _.without(this.intervals, interval);
    _removedIntervals.push(interval);
  };

  this.beforeSave = () => {
    this.disableForm = true;
  };

  this.save = () => {
    const promises = [];

    for (let interval of _removedIntervals) {
      promises.push(IntervalsService.deleteInterval(interval._id));
    }

    for (let interval of this.intervals) {
      const intervalCopy = angular.copy(interval);
      intervalCopy.songs = [];
      for (let song of interval.songs) {
        intervalCopy.songs.push(song._id);
      }

      if (intervalCopy._id) {
        promises.push(IntervalsService.updateInterval(intervalCopy));
      } else {
        promises.push(IntervalsService.addInterval(intervalCopy).then((data) => {
          interval._id = data._id;
        }));
      }
    }

    $q.all(promises).then(() => {
      this.disableForm = false;
    });
  };

  this.onEdit = () => {
    _intervals = angular.copy(this.intervals);
    _removedIntervals = [];
  };

  this.onCancel = () => {
    this.intervals = angular.copy(_intervals);
    _removedIntervals = [];
  };

  this.onCancelSongSelect = () => {
    this.editSongsSelectedInterval.songs = angular.copy(_oldSongs);
  };

  this.searchAvailableSongs = (term) => {
    TunesService.searchSongs(term).then((data) => {
      this.songsAvailable = data;
    });
  };

  this.editSongsInInterval = (interval) => {
    _oldSongs = angular.copy(interval.songs);
    this.editSongsSelectedInterval = interval;
    TunesService.getSongsOnPage("artist", 1, 10).then((data) => {
      this.songsAvailable = data;
    });
    $modal({ scope: $scope, template: require("./edit-songs.html"), show: true });
  };
}
