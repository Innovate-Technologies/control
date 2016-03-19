/* global angular, inject */

describe("AuthService", function () {

  var AuthService;
  var $rootScope;
  var $httpBackend;
  var Session;

  beforeEach(angular.mock.module("control"));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value("ENV", { apiEndpoint: API_ENDPOINT });
  }));
  beforeEach(inject(function (_$rootScope_, _AuthService_, _$httpBackend_, AUTH_EVENTS, _Session_, $interval) {
    this.AUTH_EVENTS = AUTH_EVENTS;
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $rootScope.$$listeners[AUTH_EVENTS.loginSuccess] = [];
    $rootScope.$$listeners[AUTH_EVENTS.loginFailed] = [];
    spyOn($rootScope, "$broadcast").and.callThrough();
    Session = _Session_;
    spyOn(Session, "create").and.callThrough();
    spyOn(Session, "destroy").and.callThrough();
    this.$interval = $interval;
    spyOn($interval, "cancel").and.callThrough();
  }));

  describe("the service", function () {

    it("should provide a logIn method", function () {
      expect(AuthService.logIn).toEqual(jasmine.any(Function));
    });

    it("should provide a logOut method", function () {
      expect(AuthService.logOut).toEqual(jasmine.any(Function));
    });

    it("should start keeping the session alive on session create", function () {
      expect(AuthService.keepAlivePromise).toBe(null);
      $rootScope.$broadcast("sessionCreated");
      expect(AuthService.keepAlivePromise).not.toBe(null);
    });

    it("should stop keeping the session alive on session destroy", function () {
      expect(AuthService.keepAlivePromise).toBe(null);
      $rootScope.$broadcast("sessionCreated");
      expect(AuthService.keepAlivePromise).not.toBe(null);
      $rootScope.$broadcast("sessionDestroyed");
      expect(this.$interval.cancel).toHaveBeenCalled();
      expect(AuthService.keepAlivePromise).toBe(null);
    });

  });

  describe("logIn", function () {

    it("should broadcast AUTH_EVENTS.loginSuccess when login succeeds", function () {
      var credentials = {
        email: "fake@innovate.ch",
        password: "hackme",
      };

      $httpBackend.expectPOST(API_ENDPOINT + "/authenticate", credentials).respond(200, {
        token: "xxxxx-xxxxx-from-server",
      });

      $httpBackend.expectGET(API_ENDPOINT + "/control/user-info").respond(200, {});

      AuthService.logIn(credentials);
      $httpBackend.flush();
      $rootScope.$digest();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(this.AUTH_EVENTS.loginSuccess);
    });

    it("should create a session when login succeeds", function () {
      var credentials = {
        email: "fake@innovate.ch",
        password: "hackme",
      };
      var token = "xxxxx-xxxxx-from-server";

      $httpBackend.expectPOST(API_ENDPOINT + "/authenticate", credentials).respond(200, {
        token: token,
      });

      $httpBackend.expectGET(API_ENDPOINT + "/control/user-info").respond(200, {});

      AuthService.logIn(credentials);
      $httpBackend.flush();
      $rootScope.$digest();
      expect(Session.create).toHaveBeenCalledWith({ token });
    });

    it("should broadcast AUTH_EVENTS.loginFailed when login fails", function () {
      var credentials = {
        email: "noreply@innovate.ch",
        password: "uhohwrongpassword",
      };

      $httpBackend.expectPOST(API_ENDPOINT + "/authenticate", credentials).respond(401, {
        result: "error",
        error: "Incorrect credentials",
      });

      AuthService.logIn(credentials);
      $httpBackend.flush();
      $rootScope.$digest();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(this.AUTH_EVENTS.loginFailed);
    });

  });

  describe("logOut", function () {

    it("should destroy the session client-side when server logout succeeds", function () {
      $httpBackend.expectPOST(API_ENDPOINT + "/control/log-out").respond(200, {});
      AuthService.logOut();
      $httpBackend.flush();
      $rootScope.$digest();
      expect(Session.destroy).toHaveBeenCalled();
    });

    it("should broadcast AUTH_EVENTS.logoutSuccess when server logout succeeds", function () {
      $httpBackend.expectPOST(API_ENDPOINT + "/control/log-out").respond(200, {});
      AuthService.logOut();
      $httpBackend.flush();
      $rootScope.$digest();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(this.AUTH_EVENTS.logoutSuccess);
    });

    it("should broadcast AUTH_EVENTS.logoutFailed when server logout fails", function () {
      $httpBackend.expectPOST(API_ENDPOINT + "/control/log-out").respond(500, {});
      AuthService.logOut();
      $httpBackend.flush();
      $rootScope.$digest();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(this.AUTH_EVENTS.logoutFailed);
    });

  });
});
