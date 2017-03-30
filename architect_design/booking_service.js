// booking service is a REST microservice response

const bookings = {};
const _ = require('underscore');
let autoIncreaseId = 0;

const BookingService = {
  /**
   * Get the booking Id, has expires to make auto-cancel possible
   */
  get(id) {
    const booking = bookings[id];
    if (!booking || booking.expiredAt < new Date()) return null;
    return booking;
  },
  /**
   * Create a new booking that will expire after a minute
   * @param  {[type]} payload [description]
   * @return {[type]}         [description]
   */
  post(payload) {
    const now = new Date();
    // TODO: Checking booking logic go here

    // Set the expire in 1 mins
    now.setMinutes(now.getMinutes() + 1);
    payload.expiredAt = now;
    autoIncreaseId += 1;
    payload.id = autoIncreaseId;
    bookings[autoIncreaseId] = payload;
    return payload;
  },
  /**
   * Put is idempotent, will update the appropriate booking
   * @param  {[type]} id      [description]
   * @param  {[type]} payload [description]
   * @return {[type]}         [description]
   */
  put(id, payload) {
    const booking = bookings[id];
    if (!booking || booking.expiredAt < new Date()) return null;
    _.extends(booking, payload);
    return booking;
  },
  /**
   * Delete the booking, also idempotent
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  delete(id) {
    if (bookings[id]) bookings[id] = null;
  },
};

module.exports = BookingService;
