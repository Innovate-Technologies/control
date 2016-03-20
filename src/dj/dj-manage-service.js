import { lodash as _ } from "../vendor";

export default class DjManageService {
  /*@ngInject*/
  constructor($routeSegmentProvider) {
    const sections = [];
    const itemsQueue = [];

    this.getSections = () => {
      sections.forEach((section) => {
        section.items = _.sortBy(section.items, "order");
      });
      return _.sortBy(sections, "order");
    };

    this.addSection = (section) => {
      if (!section) {
        throw new TypeError("No section object was passed");
      }

      if (!section.id) {
        throw new Error("The section object must contain an `id`");
      }

      sections.push({
        id: section.id,
        name: section.name,
        icon: section.icon,
        order: section.order,
        items: [],
        featureFlag: section.featureFlag || "none",
      });

      const pendingItemsForSection = _.where(itemsQueue, { sectionId: section.id });
      if (pendingItemsForSection.length) {
        pendingItemsForSection.forEach(this.addItem);
      }
    };

    this.addItem = (item) => {
      if (!item) {
        throw new TypeError("No item object was passed");
      }
      if (!item.name) {
        throw new Error("The section object must contain a `name`");
      }
      if (!item.route) {
        throw new Error("The section object must contain a `route` object");
      }

      const section = _.findWhere(sections, { id: item.sectionId });
      if (!section) {
        itemsQueue.push(item);
        return;
      }

      const newItem = {
        name: item.name,
        icon: item.icon,
        iconHtml: item.iconHtml,
        featureFlag: item.featureFlag || "none",
        order: item.order,
        route: _.extend(item.route, {
          completeName: "dj." + item.route.name,
          title: item.route.title || item.name,
          featureFlag: item.featureFlag || "none",
        }),
      };
      if (section.featureFlag && !newItem.route.featureFlag) {
        newItem.route.featureFlag = section.featureFlag;
      }

      section.items.push(newItem);

      const routeObject = _.extend(newItem.route, {
        watcher: /*@ngInject*/ ($rootScope) => {
          if (!$rootScope.service) {
            return;
          }
          return $rootScope.service.id;
        },
      });

      $routeSegmentProvider
        .when("/dj/" + newItem.route.subPathName, newItem.route.completeName)
        .within("dj")
        .segment(newItem.route.name, routeObject);
    };
  }
}
