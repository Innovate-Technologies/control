/* global angular inject */

describe("SupportService", function () {
  beforeEach(angular.mock.module("control"));
  beforeEach(angular.mock.module(function ($provide) {
    $provide.value("ENV", { apiEndpoint: API_ENDPOINT });
  }));
  beforeEach(inject(function (SupportService) {
    this.service = SupportService;
  }));

  describe("the service", function () {
    [
      "getTicket",
      "getTickets",
      "openTicket",
      "changeTicketStatus",

      "getReplies",
      "postReply",
    ]
    .forEach((method) => {
      it(`should provide a ${method} method`, function () {
        expect(this.service[method]).toEqual(jasmine.any(Function));
      });
    });
  });
});
