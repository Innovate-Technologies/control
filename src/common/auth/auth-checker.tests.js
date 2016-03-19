/* global angular, inject */

describe("AuthChecker", function () {

  var fakeLocalStorage;
  var SessionCreateFromLSCalled;
  var SessionMock;

  beforeEach(angular.mock.module("control"));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value("localStorageService", {
      get: function (key) {
        return fakeLocalStorage[key];
      },
      set: function (key, value) {
        fakeLocalStorage[key] = value;
      },
    });

    // Reset the states
    fakeLocalStorage = {};
    SessionCreateFromLSCalled = false;
    SessionMock = {
      createFromLocalStorage: function () {
        SessionCreateFromLSCalled = true;
        this.sessionData = { token: "xxxxx-xxxxx" };
        this.token = this.sessionData.token;
      },
    };

    $provide.value("Session", SessionMock);
  }));
  beforeEach(inject(function (AuthChecker, USER_ROLES) {
    this.service = AuthChecker;
    this.USER_ROLES = USER_ROLES;
  }));

  describe("the service", function () {

    it("should provide a isAuthenticated method", function () {
      expect(this.service.isAuthenticated).toEqual(jasmine.any(Function));
    });
    it("should provide a isAuthorized method", function () {
      expect(this.service.isAuthorized).toEqual(jasmine.any(Function));
    });

    describe("isAuthenticated", function () {
      it("should create a Session if there is a token in LS", function () {
        fakeLocalStorage.sessionData = { token: "xxxxx-xxxxx" };
        this.service.isAuthenticated();
        expect(SessionCreateFromLSCalled).toBe(true);
      });
      it("should not create a Session if there is no token in LS", function () {
        this.service.isAuthenticated();
        expect(SessionCreateFromLSCalled).toBe(false);
      });
      it("should return true if we have a session token", function () {
        fakeLocalStorage.sessionData = { token: "xxxxx-xxxxx" };
        expect(this.service.isAuthenticated()).toBe(true);
      });
      it("should return false if we do not have a session token", function () {
        expect(this.service.isAuthenticated()).toBe(false);
      });
    });

    describe("isAuthorized", function () {
      it('should return true if the authorised role includes "public"', function () {
        expect(this.service.isAuthorized([this.USER_ROLES.public])).toBe(true);
        expect(this.service.isAuthorized(this.USER_ROLES.public)).toBe(true);
      });
      describe('when the authorised role includes "all", it', function () {
        it("should return true when isAuthenticated() is true", function () {
          fakeLocalStorage.sessionData = { token: "xxxxx-xxxxx" };
          expect(this.service.isAuthorized([this.USER_ROLES.all])).toBe(true);
          expect(this.service.isAuthorized(this.USER_ROLES.all)).toBe(true);
        });
        it("should return false when isAuthenticated() is false", function () {
          expect(this.service.isAuthorized([this.USER_ROLES.all])).toBe(false);
          expect(this.service.isAuthorized(this.USER_ROLES.all)).toBe(false);
        });
      });
      it("should return true only if the user has one of the authorised roles", function () {
        // Non-authenticated
        expect(this.service.isAuthorized([this.USER_ROLES.user])).toBe(false);

        // User has the user role
        fakeLocalStorage.sessionData = { token: "xxxxx-xxxxx" };
        SessionMock.userRole = this.USER_ROLES.user;
        expect(this.service.isAuthorized([this.USER_ROLES.user])).toBe(true);

        SessionMock.userRole = this.USER_ROLES.user;
        expect(this.service.isAuthorized([this.USER_ROLES.admin])).toBe(false);
      });
    });

  });

});
