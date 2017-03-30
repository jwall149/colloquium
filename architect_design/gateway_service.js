/* eslint-disable */
const BillingService = require('./billing_service');
const BookingService = require('./booking_service');

const GatewayService = {
  booking: {
    post(payload) {
      // Step 0 initialize
      // Create a new transaction, Transaction model should throw error if fail
      // 1 hour in the future
      const later = new Date();
      later.setHours(later.getHours() + 1);
      const newTransaction = new Transaction({
        id: Math.random(),
        state: 'initial',
        transaction: [],
        expiredAt: later, // This is for the recovery
      }).save();
      //*** If the save() raise error, both not yet created, hence fail

      // Sending to both service, this should be async, but I will wrote as sync to keep its simplicity
      const hasError = false;
      try {
        newTransaction.update({ state: 'pending' });
        const billing = BillingService.post(payload);
        const booking = BookingService.post(payload);
      } catch(e) {
        const hasError = true;
      }
      // If we have problem communicating with the service or billing/booking isn't created
      if (hasError || !billing || !booking) {
        // Oftenly we have a message queue to do recovery, but here just repeat until success to keep it's simplicity
        const successCancel = false;
        while (!successCancel) {
          try {
            // All 3 calls here is idempotent, can repeat forever untill success
            //*** If the save() raise error, both fail

            // Keep track of the record for recovery
            newTransaction.update({
              state: 'cancel',
              transaction: [
                { service: 'booking', data: booking },
                { service: 'billing', data: billing },
              ]
            });

            // Cancel, this is optional both billing and booking will be expired anyway.
            if (billing) BillingService.delete(billing.id);
            if (booking) BookingService.delete(booking.id);
          } catch (e) {
            // Sleep for few second then repeat the service
            sleep(5000);
            continue;
          }
          successCancel = true;
        }
      } else {
        // Or else we going to confirm
        const successConfirm = false;
        while (!successConfirm) {
          try {
            // All 3 calls here is idempotent, can repeat forever until success
            //*** If the save() raise error, both success

            // Keep track of the record for recovery
            newTransaction.update({
              state: 'confirm',
              transaction: [
                { service: 'booking', data: booking },
                { service: 'billing', data: billing },
              ],
            });

            billing.expiredAt = null; // No expire anymore, confirmed
            BillingService.put(billing.id, billing);

            booking.expiredAt = null; // No more expired
            BookingService.put(booking.id, booking);
          } catch (e) {
            // Sleep for few second then repeat the service
            sleep(5000);
            continue;
          }
          successConfirm = true;
        }
      }
    },
  },
};

module.exports = GatewayService;
