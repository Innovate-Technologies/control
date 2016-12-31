import { lodash as _ } from "../vendor";

export default class ManageService {
  /*@ngInject*/
  constructor($routeSegmentProvider, USER_ROLES) {
    let sections = [];
    let itemsToAdd = [];
    this.getSections = (doNotSort) => {
      if (doNotSort) {
        return sections;
      }

      sections.forEach((section) => {
        section.items = _.sortBy(section.items, "order");
      });

      return _.sortBy(sections, "order");
    };
    this.removeAllSections = () => {
      sections = [];
      return sections;
    };
    this.removeSection = (sectionSelector) => {
      if (typeof sectionSelector === "undefined") {
        throw new TypeError("No section selector was passed");
      }
      var section = _.find(sections, sectionSelector);
      if (!section) {
        throw new Error("Could not find any section matching the selector: " + sectionSelector);
      }
      sections = _.without(sections, section);
    };
    this.removeAllItems = (sectionSelector) => {
      if (typeof sectionSelector === "undefined") {
        throw new TypeError("No section selector was passed");
      }
      var section = _.find(sections, sectionSelector);
      if (!section) {
        throw new Error("Could not find any section matching the selector: " + sectionSelector);
      }
      section.items = [];
    };
    this.addSection = (section) => {
      if (typeof section === "undefined") {
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
        visibleForCastOnly: section.visibleForCastOnly || false,
      });

      let pendingItemsForSection = _. filter(itemsToAdd, { sectionId: section.id });
      if (pendingItemsForSection.length) {
        pendingItemsForSection.forEach(this.addItem);
      }
    };
    this.addItem = (item) => {
      if (typeof item === "undefined") {
        throw new TypeError("No item object was passed");
      }

      if (!item.name) {
        throw new Error("The section object must contain a `name`");
      }

      if (!item.route) {
        throw new Error("The section object must contain a `route` object");
      }

      let section = _.find(sections, { id: item.sectionId });
      if (!section) {
        itemsToAdd.push(item);
        return false;
      }

      let newItem = {
        name: item.name,
        icon: item.icon,
        iconHtml: item.iconHtml,
        featureFlag: item.featureFlag || "none",
        visibleForCastOnly: item.visibleForCastOnly || false,
        order: item.order,
        route: {
          subPathName: item.route.subPathName,
          name: item.route.name,
          completeName: "manage." + item.route.name,
          template: item.route.template,
          templateUrl: item.route.templateUrl,
          controller: item.route.controller,
          controllerAs: item.route.controllerAs,
          resolve: item.route.resolve,
          resolveFailed: item.route.resolveFailed,
          title: item.route.title || item.name,
          featureFlag: item.featureFlag || "none",
          visibleForCastOnly: item.visibleForCastOnly || false,
        },
      };

      if (section.visibleForCastOnly) {
        newItem.route.visibleForCastOnly = true;
      }
      if (section.featureFlag && !newItem.route.featureFlag) {
        newItem.route.featureFlag = section.featureFlag;
      }

      section.items.push(newItem);

      var routeObject = {
        template: newItem.route.template,
        templateUrl: newItem.route.templateUrl,
        authorizedRoles: [USER_ROLES.all],
        title: newItem.route.title,
        featureFlag: newItem.route.featureFlag,
        visibleForCastOnly: newItem.route.visibleForCastOnly,
        watcher: /*@ngInject*/ function ($rootScope) {
          if (!$rootScope.service) {
            return;
          }
          return $rootScope.service.id;
        },
        resolve: newItem.route.resolve,
        resolveFailed: newItem.route.resolveFailed,
        controller: newItem.route.controller,
        controllerAs: newItem.route.controllerAs,
      };

      $routeSegmentProvider
        .when("/manage/" + newItem.route.subPathName, newItem.route.completeName)
        .within("manage")
        .segment(newItem.route.name, routeObject);

      return true;
    };
  }
}
