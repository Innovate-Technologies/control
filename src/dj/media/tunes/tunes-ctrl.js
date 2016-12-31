import { lodash as _ } from "../../../vendor";

export default /*@ngInject*/ function ($scope, TunesService, TagsService, TagsColorService, $rootScope) {
  this.tab = "songs";

  this.songs = [];
  this.tags = [];
  this.newTags = [];
  this.page = 1;
  this.numberOfPages = 0;
  this.sortOn = "artist";
  this.songPlaying = null;
  this.audioThread = null;
  this.allSelected = false;
  this.tagsColorService = TagsColorService;

  TunesService.getNumberOfPages().then((numberOfPages) => {
    this.numberOfPages = numberOfPages;
    this.loadSongs();
  });
  this.setTab = (tab) => {
    this.tab = tab;
  };

  this.loadSongs = () => {
    TunesService.getSongsOnPage(this.sortOn, this.page).then((data) => {
      this.songs = data;
    });
  };

  this.loadPage = (page) => {
    this.page = page;
    this.loadSongs();
  };

  this.search = (term) => {
    TunesService.searchSongs(term).then((data) => {
      this.songs = data;
    });
  };

  TagsService.getTags().then((tags) => {
    this.tags = tags;
  });

  this.togglePreview = (id) => {
    if (this.songPlaying === id) {
      this.audioThread.pause();
      this.songPlaying = null;
    } else {
      if (this.songPlaying) {
        this.audioThread.pause();
      }
      this.audioThread = new Audio(`https://${$rootScope.service.username}.radioca.st/dj/preview/${id}`);
      this.audioThread.play();
      this.audioThread.addEventListener("ended", () => {
        this.audioThread = null;
        this.songPlaying = null;
        $scope.$apply();
      });
      this.songPlaying = id;
    }
  };

  this.isSortedOn = (sortedOn) => {
    return this.sortOn === sortedOn || this.sortOn === "-" + sortedOn;
  };

  this.sort = (sortOn) => {
    this.sortOn = sortOn;
    this.loadSongs();
  };

  this.deleteSong = (song) => {
    song.isDisabled = true;
    TunesService.deleteSong(song._id).then(() => {
      this.songs = _.without(this.songs, song);
    });
  };

  this.updateSong = (song) => {
    song.isDisabled = true;
    TunesService.updateSong(song).then(() => {
      song.isDisabled = false;
    });
  };

  this.selectAll = () => {
    for (let song of this.songs) {
      song.selected = this.allSelected;
    }
  };

  this.deleteSelected = () => {
    for (let song of this.songs) {
      if (song.selected && song.available) {
        this.deleteSong(song);
      }
    }
  };

  $scope.getNumber = (num) => {
    const numberArray = [];
    for (let i = 1; i <= num; i++) {
      numberArray.push(i);
    }
    return numberArray;
  };

  this.saveTags = (song, tags) => {
    song.isDisabled = true;
    song.editingTags = false;
    if (tags) { // only add new tags
      song.tags = song.tags.concat(tags);
      song.tags = _.uniqWith(song.tags, (a, b) => { return a._id === b._id; });
    }

    const postTags = [];
    for (let tag of song.tags) {
      postTags.push(tag._id);
    }
    TunesService.setTags(song, postTags).then(() => {
      song.isDisabled = false;
    });
  };

  this.tagSelected = () => {
    for (let song of this.songs) {
      if (song.selected && song.available) {
        this.saveTags(song, this.newTags);
      }
    }
    this.newTags = [];
  };


}
