/* global angular, inject */

describe("Session", function () {

  beforeEach(angular.mock.module("control"));
  beforeEach(inject(function ($rootScope, USER_ROLES, Session, localStorageService) {
    this.USER_ROLES = USER_ROLES;
    this.Session = Session;
    this.$rootScope = $rootScope;
    this.localStorageService = localStorageService;
    this.localStorageService.clearAll();
    spyOn($rootScope, "$broadcast").and.callThrough();
  }));

  describe("the service", function () {

    it("should provide a create method", function () {
      expect(this.Session.create).toEqual(jasmine.any(Function));
    });

    it("should provide a createFromLocalStorage method", function () {
      expect(this.Session.createFromLocalStorage).toEqual(jasmine.any(Function));
    });

    it("should provide a update method", function () {
      expect(this.Session.update).toEqual(jasmine.any(Function));
    });

    it("should provide a destroy method", function () {
      expect(this.Session.destroy).toEqual(jasmine.any(Function));
    });

    it("should not automatically create a session", function () {
      expect(this.Session.token).toBeUndefined();
    });

    describe("the create method", function () {
      var testToken = "xxxxx-test-token";
      it("should create a session", function () {
        expect(this.Session.token).toBeUndefined();
        this.Session.create({ token: testToken });
        expect(this.Session.token).toBe(testToken);
      });
      it("should store the token in local storage", function () {
        expect(this.localStorageService.get("sessionData")).toBeNull();
        this.Session.create({ token: testToken });
        expect(this.localStorageService.get("sessionData")).toEqual({ token: testToken });
      });
      it("should broadcast the sessionCreated event", function () {
        expect(this.Session.token).toBeUndefined();
        this.Session.create({ token: testToken });
        expect(this.$rootScope.$broadcast).toHaveBeenCalledWith("sessionCreated");
      });
    });

    describe("the update method", function () {
      var oldTestToken = "xxxxx-test-token";
      var newTestToken = "xxxxx-test-token-new";
      it("should update the session token", function () {
        this.Session.create({ token: oldTestToken });
        expect(this.Session.token).toBe(oldTestToken);
        this.Session.update({ token: newTestToken });
        expect(this.Session.token).toBe(newTestToken);
      });
      it("should update the token in local storage", function () {
        this.Session.create({ token: oldTestToken });
        expect(this.localStorageService.get("sessionData")).toEqual({ token: oldTestToken });
        this.Session.update({ token: newTestToken });
        expect(this.localStorageService.get("sessionData")).toEqual({ token: newTestToken });
      });
      it("should broadcast the sessionUpdated event", function () {
        this.Session.create({ token: oldTestToken });
        this.Session.update({ token: newTestToken });
        expect(this.$rootScope.$broadcast).toHaveBeenCalledWith("sessionUpdated");
      });
    });

    describe("the destroy method", function () {
      var testToken = "xxxxx-test-token";
      it("should destroy the session", function () {
        this.Session.create({ token: testToken });
        expect(this.Session.token).toEqual(testToken);
        this.Session.destroy();
        expect(this.Session.token).toBeNull();
      });
      it("should remove the token from local storage", function () {
        this.Session.create({ token: testToken });
        expect(this.localStorageService.get("sessionData")).toEqual({ token: testToken });
        this.Session.destroy();
        expect(this.localStorageService.get("sessionData")).toBeNull();
      });
      it("should broadcast the sessionDestroyed event", function () {
        this.Session.create({ token: testToken });
        expect(this.Session.token).toBeDefined();
        this.Session.destroy();
        expect(this.$rootScope.$broadcast).toHaveBeenCalledWith("sessionDestroyed");
      });
    });

  });
});
