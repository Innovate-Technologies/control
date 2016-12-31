export default class TagsColorService {
    /*@ngInject*/
  constructor() {
    this.getFontColor = (backgroundColour, threshold = 128) => {
      let r;
      let g;
      let b;
      let yiq;
      try {
        r = parseInt(backgroundColour.slice(1).substr(0, 2), 16);
        g = parseInt(backgroundColour.slice(1).substr(2, 2), 16);
        b = parseInt(backgroundColour.slice(1).substr(4, 2), 16);
        yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (yiq >= threshold) ? "#333333" : "#FFFFFF";
      } catch (e) {
        return "#FFFFFF";
      }
    };
  }
}
