/* global angular, inject */

/*
describe("AppStatusesService", function () {

  beforeEach(angular.mock.module("control"));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value("ENV", { apiEndpoint: API_ENDPOINT });
  }));
  beforeEach(inject(function (AppStatusesService, $httpBackend) {
    this.service = AppStatusesService;
    this.$httpBackend = $httpBackend;
  }));

  describe("the service", function () {

    it("should provide a getStatuses method", function () {
      expect(this.service.getStatuses).toEqual(jasmine.any(Function));
    });

    it("should provide a getStatusesByValue method", function () {
      expect(this.service.getStatusesByValue).toEqual(jasmine.any(Function));
    });

  });

  describe("getStatuses", function () {

    var statuses;

    it("should return a non-empty array of status objects", function () {
      var testResponse = [{ value: "pending", label: "Pending" }];

      this.$httpBackend.expectGET("https://apps.shoutca.st/internal/statuses").respond(200, testResponse);

      this.service.getStatuses().then(function (_statuses_) {
        statuses = _statuses_;
      });

      this.$httpBackend.flush();
      expect(statuses).toEqual(jasmine.any(Array));
      expect(statuses.length).not.toEqual(0);
    });

    describe("the returned status object", function () {
      it("should have a value and a label", function () {
        expect(statuses[0].value).toEqual(jasmine.any(String));
        expect(statuses[0].label).toEqual(jasmine.any(String));
      });
    });

  });

  describe("getStatusesByValue", function () {

    var statuses;

    it("should return an object of statuses", function () {
      var testResponse = { pending: "Pending" };

      this.$httpBackend.expectGET("https://apps.shoutca.st/internal/statuses-by-value").respond(200, testResponse);

      this.service.getStatusesByValue().then(function (_statuses_) {
        statuses = _statuses_;
      });

      this.$httpBackend.flush();
      expect(statuses).toEqual(jasmine.any(Object));
    });

    describe("the returned object", function () {
      it("contains the labels (as object values) by values (as keys)", function () {
        expect(statuses.pending).toEqual("Pending");
      });
    });

  });

});
*/
