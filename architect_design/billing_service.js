// Billing service is a REST microservice response

const billings = {};
const _ = require('underscore');
let autoIncreaseId = 0;

const BillingService = {
  /**
   * Get the billing Id, has expires to make auto-cancel possible
   */
  get(id) {
    const bill = billings[id];
    if (!bill || bill.expiredAt < new Date()) return null;
    return bill;
  },
  /**
   * Create a new billing that will expire after a minute
   * @param  {[type]} payload [description]
   * @return {[type]}         [description]
   */
  post(payload) {
    const now = new Date();
    // TODO: Checking billing logic go here

    // Set the expire in 1 mins
    now.setMinutes(now.getMinutes() + 1);
    payload.expiredAt = now;
    autoIncreaseId += 1;
    payload.id = autoIncreaseId;
    billings[autoIncreaseId] = payload;
    return payload;
  },
  /**
   * Put is idempotent, will update the appropriate billing
   * @param  {[type]} id      [description]
   * @param  {[type]} payload [description]
   * @return {[type]}         [description]
   */
  put(id, payload) {
    const bill = billings[id];
    if (!bill || bill.expiredAt < new Date()) return null;
    _.extends(bill, payload);
    return bill;
  },
  /**
   * Delete the billing, also idempotent
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  delete(id) {
    if (billings[id]) billings[id] = null;
  },
};

module.exports = BillingService;
