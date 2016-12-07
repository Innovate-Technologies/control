export default class SupportService {
  /*@ngInject*/
  constructor($http, ENV) {

    // Ticket

    /**
     * Get a ticket by ticket ID
     * @param  {String} ticketId
     * @async
     * @return {Object} Ticket object
     */
    this.getTicket = (ticketId) => {
      if (!ticketId) {
        return Promise.reject("No ticket ID");
      }
      return $http.get(`${ENV.apiEndpoint}/control/support/tickets/${ticketId}`).then((response) => {
        return response.data;
      });
    };

    /**
     * Get all tickets
     * @param  {Boolean}  onlyActive  Get only active tickets
     * @param  {Function} filterFn    A function to filter tickets
     * @async
     * @return {Array}                An array of ticket objects
     */
    this.getTickets = (onlyActive = false, filterFn) => {
      const path = onlyActive
        ? `${ENV.apiEndpoint}/control/support/tickets?activeOnly=true`
        : `${ENV.apiEndpoint}/control/support/tickets`;
      return $http.get(path).then((response) => {
        if (typeof filterFn === "function") {
          return response.data.filter(filterFn);
        }
        return response.data;
      });
    };

    /**
     * Open a new ticket
     * @param  {String} options.department  Ticket department name
     * @param  {String} options.subject     Ticket subject
     * @param  {String} options.message     Ticket message
     * @async
     * @return {Object} Ticket object
     */
    this.openTicket = ({ department, subject, message } = {}) => {
      if (!department || !subject || !message) {
        return Promise.reject("Missing fields");
      }
      return $http.post(`${ENV.apiEndpoint}/control/support/tickets`, {
        department,
        subject,
        message,
      });
    };

    /**
     * Change the status of a ticket by ticket ID
     * @param  {String} ticketId
     * @param  {String} status    New ticket status
     * @async
     * @return {Object} Response object
     */
    this.changeTicketStatus = (ticketId, status) => {
      if (!ticketId) {
        return Promise.reject("No ticket ID");
      }
      if (!status || ["closed", "open"].indexOf(status) === -1) {
        return Promise.reject("No status, or invalid status");
      }
      return $http.put(`${ENV.apiEndpoint}/control/support/tickets/${ticketId}/status`, status)
        .then((response) => response.data);
    };


    // Replies

    /**
     * Get replies for a ticket by ticket ID
     * @param  {String} ticketId
     * @async
     * @return {Array}  Array of replies object
     */
    this.getReplies = (ticketId) => {
      if (!ticketId) {
        return Promise.reject("No ticket ID");
      }
      return $http.get(`${ENV.apiEndpoint}/control/support/tickets/${ticketId}/replies`)
        .then((response) => response.data);
    };

    /**
     * Post a reply on a ticket by ticket ID
     * @param  {String} ticketId
     * @param  {String} message     Reply message
     * @async
     * @return {Object} Reply object
     */
    this.postReply = (ticketId, message) => {
      if (!ticketId || !message) {
        return Promise.reject("No ticket ID or message");
      }
      return $http.post(`${ENV.apiEndpoint}/control/support/tickets/${ticketId}/replies`)
        .then((response) => response.data);
    };
  }
}
