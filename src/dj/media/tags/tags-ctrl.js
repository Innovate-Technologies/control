import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (TagsService, TagsColorService, $q, tags, $rootScope) {
  this.now = new Date();
  this.colorService = TagsColorService;
  this.tags = tags;
  this.isSaving = false;

  // form functions

  this.addTag = () => {
    this.tags.push({
      "name": "",
      "color": "#FFFFFF",
    });
  };

  let _tags;
  let _deletedTags = [];
  this.onEdit = () => {
    _tags = angular.copy(this.tags);
    _deletedTags = [];
  };
  this.onCancel = () => {
    this.tags = angular.copy(_tags);
    _deletedTags = [];
  };

  this.removeTag = (tag) => {
    _deletedTags.push(angular.copy(tag));
    this.tags = _.without(this.tags, tag);
  };

  this.beforeSave = () => {
    this.disableForm = true;
  };

  this.save = () => {
    const promises = [];

    for (let tag of _deletedTags) {
      if (tag._id) {
        promises.push(TagsService.deteleTag(tag._id));
      }
    }
    for (let tag of this.tags) {
      const sameNamed = _.filter(this.tags, { name: tag.name });
      if (sameNamed.length > 1) {
        $rootScope.$broadcast("validation-error", {
          message: "Clock must have a name",
          alertDuration: 30,
        });

        this.disableForm = false;
        return;
      }

      if (!tag._id) {
        promises.push(TagsService.addTag(tag).then((itframeTag) => {
          tag._id = itframeTag._id;
        }));
      } else {
        promises.push(TagsService.updateTag(tag));
      }
    }
    $q.all(promises).then(()=> {
      this.disableForm = false;
    });
  };
}
