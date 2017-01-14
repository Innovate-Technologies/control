import { lodash as _, angular } from "../../../vendor";

export default /*@ngInject*/ function (config, ConfigService, $alert, $scope) {
  this.config = angular.copy(config);
  this.primaryStream = _.find(config.streams, { primary: true }).stream;
  this.useCustomDomain = !(/.*radioca.st$/.test(config.hostname));
  this.useCustomDomain ? this.customDomain = config.hostname.replace("https://", "") : this.customDomain = "";

  this.isValidDomain = (domain) => {
    return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain);
  };

  this.setCustomDomain = () => {
    this.isSaving = true;
    return ConfigService.setCustomDomain(this.customDomain).then(() => {
      $alert({
        content: "Successfully changed the domain.",
        type: "success",
        duration: 3,
      });
      this.config.hostname = `https://${this.customDomain}}`;
      $scope.$emit("invalidate-cast-config-cache");
      this.isSaving = false;
    }, () => {
      $alert({
        content: "Failed to update the domain. Double check your DNS and try again later.",
        type: "danger",
        duration: 5,
      });
      this.isSaving = false;
    });
  };
}
