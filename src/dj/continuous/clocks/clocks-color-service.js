export default class ClocksColorService {
    /*@ngInject*/
  constructor() {
    let shadeColour = (color, percent) => {
      // from http://stackoverflow.com/a/13542669/1636285, with minor changes
      // pass a negative number to darken, positive to lighten
      var f = parseInt(color.slice(1), 16);
      var t = percent < 0 ? 0 : 255;
      var p = percent < 0 ? percent * -1 : percent;
      var R = f >> 16;
      var G = f >> 8 & 0x00FF;
      var B = f & 0x0000FF;
      return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    };
    this.getTheme = (backgroundColour) => {
      var threshold = arguments.length <= 1 || arguments[1] === undefined ? 128 : arguments[1];

      var r;
      var g;
      var b;
      var yiq;
      try {
        r = parseInt(backgroundColour.slice(1).substr(0, 2), 16);
        g = parseInt(backgroundColour.slice(1).substr(2, 2), 16);
        b = parseInt(backgroundColour.slice(1).substr(4, 2), 16);
        yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= threshold ? "light" : "dark";
      } catch (e) {
        return "dark";
      }
    };

    this.getShadedBackgroundColour = (color) => {
      var shadeMultiplier = 0.45;
      var lightenOrDarken = this.getTheme(color, 64) === "light" ? -1 : 1;
      return shadeColour(color, shadeMultiplier * lightenOrDarken);
    };
  }
}
