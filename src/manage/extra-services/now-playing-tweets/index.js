import { angular } from "../../../vendor";

import NowPlayingTweetsCtrl from "./now-playing-tweets-ctrl";
import NowPlayingTweetsServiceFactory from "./now-playing-tweets-service";

export default angular.module("control.manage.extra-services.np-tweets", [])
    .factory("NowPlayingTweetsService", NowPlayingTweetsServiceFactory)
    .controller("NowPlayingTweetsCtrl", NowPlayingTweetsCtrl)
    .run(/*@ngInject*/ function (ManageService) {
      ManageService.addItem({
        sectionId: "extra-services",
        name: "#NowPlaying",
        iconHtml: '<i class="fab fa-twitter"></i>',
        route: {
          subPathName: "now-playing-tweets",
          name: "nowPlayingTweets",
          template: require("./now-playing-tweets.html"),
          controller: "NowPlayingTweetsCtrl",
          title: "#NowPlaying Tweets",
          resolve: /*@ngInject*/ {
            settings: function (NowPlayingTweetsService, $q) {
              return NowPlayingTweetsService.getSettings().then(
                            settings => $q.resolve(settings), () => $q.resolve({}));
            },
          },
        },
      });
    })
    .name;
