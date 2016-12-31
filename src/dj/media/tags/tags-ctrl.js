import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (TagsService, TagsColorService, $q) {
  this.now = new Date();
  this.colorService = TagsColorService;
  this.tags = [];
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

  this.getTags = () => {
    TagsService.getTags().then((tags) => {
      this.tags = tags;
    });
  };

  this.getTags();

}
