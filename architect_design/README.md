## Architecture

Assume that you want me to design api for booking service with the flow:

1. Customer calling the Gateway API /gateway/booking/:tripId

2.a Gateway call Booking Service API /booking
2.b Gateway call Billing Service API /billing

3.a If 2.a and 2.b both success, return success
3.b If one of 2.a or 2.b fail, return fail

To keep the simplicity and scalablity, I assume that `billing` and `booking` are two REST microservices, and will ignore all the authentication/authorization in this case.
To archive Atomic transaction, I will design these follow the TCC (Try, Cancel/Confirm) concept.

### Billing Service

The billing service is responsible for calling payment service/reduce.
Billing service is a participant in the TCC.
Require: Default timeout to cancel
         Confirm is idempotent (PUT), and will remove the timeout

This is a normal REST service so it will follow the usual REST design.

GET /billing/:id
  // Get a billing
POST /billing
  // Create a billing
  // The timeout (expiredAt is auto-generated, 1 minutes in the future)
PUT /billing/:id
  // Update billing
DELETE /billing/:id
  // Delete the billing

### Booking Service
Booking service is a participant in the TCC.
Require: Default timeout to cancel
         Confirm is idempotent (PUT), and will remove the timeout

Identical with billing

GET /booking/:id
  // Get a booking
POST /booking
  // Create a booking
PUT /booking/:id
  // Update booking
DELETE /booking/:id
  // Delete the booking

### Gateway service
Gateway is a puppet master, controlling billing and booking.

POST /gateway/booking
  // Create booking by combine booking and billing service.
The timeof between both service assure that, before confirm, both will fail eventually.
After confirm, both will success.

If confirmation fail, we going to repeat the confirmation, because all API calls in confirmation are idempotent.

The recovery procedure is differently treated, and will act independent with gateway.

### Sample composition

The following shows the success composition of two services.

1. POST /gateway/booking/trip_A

2.a POST /booking
  Data: tripId=trip_A

  RES: 200
       bookingId=trip_A_bookingId
2.b POST /billing
  Data: tripId=trip_A

  RES: 200
       billingId = trip_a_billingId

// Confirm
3.a PUT /booking/trip_A_bookingId
  RES: 204
3.b PUT /billing/trip_a_billingId
  RES: 204

The following shows a failed composition of two services.

1. POST /gateway/booking/trip_A

2.a POST /booking
  Data: tripId=trip_A

  RES: 200
       bookingId=trip_A_bookingId
2.b POST /billing
  Data: tripId=trip_A

  RES: 402
  (Can not bill user, out of cash)

// Cancel
3.a DELETE /booking/trip_A_bookingId
  RES: 204
3.b DELETE /billing/trip_a_billingId
  RES: 204
