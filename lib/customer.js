var stripe = exports;

/**
 * ## customer module dependencies
 */
var stripeBase = require('./stripe').stripeBase;
var StripeError = require('./stripe').StripeError;

/**
 * ## stripe.Customer
 *
 * Customer objects allow you to perform recurring charges and track multiple
 * charges that are associated with the same customer. The API allows you to
 * create, delete, and update your customers. You can retrieve individual
 * customers as well as a list of all your customers. 
 */
stripe.Customer = function() {

};

// Inherit from stripeBase
stripe.Customer.prototype = stripeBase;

/**
 * ### stripe.Customer.create(opts, callback)
 *
 * _Create a customer object_
 *
 * Creates a new customer object.
 *
 * Customer details are specified via the `opts` object which can have 
 * following keys:
 *
 *  + `card`: (*optional*) A card to attach to the customer. The card can
 *  either be a token, like the ones returned by our stripe.js, or an object
 *  containing a user's credit card details, with the options described below.
 *  Whenever you attach a card to a customer, Stripe will automatically
 *  validate the card. A customer with a card can be used when creating a
 *  charge or put on a recurring billing plan. 
 *   * `number`: (**required**) The card number, as a string without any
 *   separators.
 *   * `expMonth`: (**required**) Two digit number representing the card's
 *   expiration month.
 *   * `expYear`: (**required**) Four digit number representing the card's
 *   expiration year.
 *   * `cvc`: (*optional*, recommended) Card security code
 *   * `name`: (*optional*, recommended) Cardholder's full name.
 *   * `addressLine1`: (*optional*, recommended) 
 *   * `addressLine2`: (*optional*, recommended)
 *   * `addressZip`: (*optional*, recommended)
 *   * `addressState`: (*optional*, recommended)
 *   * `addressCountry`: (*optional*, recommended)
 *  + `coupon`: (*optional*) If you provide a coupon code, the customer will
 *  have a discount applied on all recurring charges. Charges you create
 *  through the API will not have the discount. You can manage your coupons in
 *  the [coupon section](https://manage.stripe.com/recurring/coupons) of your 
 *  account. 
 *  + `email`: (*optional*) The customer's email address. It is displayed
 *  alongside the customer in the web interface and can be useful for searching
 *  and tracking. 
 *  + `description`: (*optional*) An arbitrary string which you can attach to a
 *  customer object. It is displayed alongside the customer in the web
 *  interface. 
 *  + `plan`: (*optional*) The identifier of the plan to subscribe the customer
 *  to. If provided, the returned customer object has a 'subscription'
 *  attribute describing the state of the customer's subscription.  +
 *  `trialEnd`: (*optional*) UTC integer timestamp or date object representing
 *  the end of the trial period the customer will get before being charged for
 *  the first time.  If set, trial_end will override the default trial period
 *  of the plan the customer is being subscribed to.
 *
 * Callback will be called with error object or `null` as first argument, 
 * depending on the success of the create call, and customer object as second
 * argument if the call is successful. The customer object will have an 
 * ``activeCard`` property if there is an active card associated with the 
 * customer.
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     stripe.Customer.create({
 *       description: 'stripe@stripe.com',
 *       card: 'tok_K55qIvOpies74y' // obtained with stripe.js
 *     }, function(err, customer) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Customer is: ' + customer);
 *     });
 *
 * @param {Object} opts Customer object data
 * @param {Function} callback Called when the request finishes
 */
stripe.Customer.create = function(opts, callback) {

};

/**
 * ### stripe.Customer.retrieve(customerId, callback)
 *
 * _Retrieve a customer object_
 *
 * Retrieves the details of an existing customer. You need only supply the
 * unique customer identifier that was returned upon customer creation. 
 *
 * Like with a charge, you can view the retrieved customer directly in your
 * browser. 
 *
 * Callback will be called with error object or `null` as first argument, 
 * depending on the success of the create call, and customer object as second
 * argument if the call is successful.
 *
 * When requesting the ID of a customer that has been deleted, a subset of the
 * customer's information will be returned, including a "deleted" property,
 * which will be true. 
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *     
 *     // Called when retrieved:
 *     function postRetrieve(err, customer)
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Customer is: ' + customer);
 *     }
 *
 *     // Retrieve customer:
 *     stripe.Customer.retrieve('cus_RTW3KxBMCknuhB', postRetrieve);
 *
 * @param {String} customerId The identifier of the customer to be retrieved.
 * @param {Function} callback Called when the request finishes
 */
stripe.Customer.retrieve = function(customerId, callback) {

};

/**
 * ### stripe.Customer.prototype.save(callback)
 *
 * _Update customer_
 *
 * Updates the specified customer by setting the values of the parameters
 * passed. Any parameters not provided will be left unchanged. For example, if
 * you pass the card parameter, that becomes the customer's active card which
 * will be used for all charges in future.
 *
 * This request accepts mostly the same arguments as the customer creation
 * call. However, subscription-related arguments (`plan` and `trialEnd`) are
 * not accepted. To change those, one must update the customer's subscription
 * directly (see `stripe.Customer.prototype.updateSubscription`). 
 * 
 * The following keys on the customer object can be updated:
 *
 *  + `card`: (*optional*) A new card to attach to the customer. The card can
 *  either be a token, like the ones returned by our stripe.js, or a dictionary
 *  containing a user's credit card details, with the options described below.
 *  A customer with a card can be used when creating a charge or put on a
 *  recurring billing plan. Although not all information is required, the extra
 *  info helps prevent fraud. 
 *   * `number`: (**required**) The card number, as a string without any
 *   separators.
 *   * `expMonth`: (**required**) Two digit number representing the card's
 *   expiration month.
 *   * `expYear`: (**required**) Four digit number representing the card's
 *   expiration year.
 *   * `cvc`: (*optional*, recommended) Card security code
 *   * `name`: (*optional*, recommended) Cardholder's full name.
 *   * `addressLine1`: (*optional*, recommended) 
 *   * `addressLine2`: (*optional*, recommended)
 *   * `addressZip`: (*optional*, recommended)
 *   * `addressState`: (*optional*, recommended)
 *   * `addressCountry`: (*optional*, recommended) 
 *  + `coupon`: (*optional*) If you provide a coupon code, the customer will
 *  have a discount applied on all recurring charges. Charges you create
 *  through the API will not have the discount. You can manage your coupons in
 *  the coupon section of your account. 
 *  + `description`: (*optional*) An arbitrary string which you can attach to a
 *  customer object. It is displayed alongside the charge in the web interface.
 *  It's often a good idea to use an email address as a description for
 *  tracking later.
 *  + `email`: (*optional*) The customer's email address. It is displayed
 *  alongside the customer in the web interface and can be useful for searching
 *  and tracking. 
 * 
 * Callback is called with error object or `null` as its first argument, 
 * depending on the success of the create call, and customer object as second
 * argument if the call is successful.
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *     
 *     // Called when customer is updated:
 *     function postUpdate(err, customer) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Finished updating customer');
 *     }
 *
 *     // Called when customer is retrieved:
 *     function updateCustomer(err, customer) {
 *       if (err) { return console.error('Error retrieving: ' + err); }
 *       console.log('Retrieved customer: ' + customer);
 *       customer.description = 'new-email@example.com';
 *       customer.save(postUpdate);
 *     }
 *
 *     // Retrieve customer:
 *     stripe.Customer.retrieve('cus_RTW3KxBMCknuhB', updateCustomer);
 *
 * @param {Object} opts Updated customer data
 * @param {Function} callback Called when the request finishes
 */
stripe.Customer.prototype.update = function(opts, callback) {
  
};

/**
 * ### stripe.Customer.prototype.delete(callback)
 *
 * _Delete a customer_
 *
 * Permanently deletes a customer. It cannot be undone.
 *
 * Callback is called with error object or `null` as its first argument, 
 * depending on the success of the create call, and customer object as second
 * which has a `deleted` flag set to `true`.
 *
 * Unlike other objects, deleted customers can still be retrieved through the
 * API, in order to be able to track the history of customers while still
 * removing their credit card details and preventing any further operations to
 * be performed (such as adding a new subscription).
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     // Called when deleted:
 *     function postDelete(err, customer) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Customer deleted');
 *       console.log('Deleted flag is: ' + customer.deleted);
 *     }
 *
 *     // Called when retrieved:
 *     function deleteCustomer(err, customer) {
 *       if (err) { return console.error('Error retrieving: ' + err); }
 *       customer.delete(postDelete);
 *     }
 *
 *     // Retrieve customer:
 *     stripe.Customer.retrieve('cus_RTW3KxBMCknuhB', deleteCustomer);
 *
 * @param {Function} callback Called when the request finishes
 */
stripe.Customer.prototype.delete = function(callback) {

};

/**
 * ### stripe.Customer.all([opts], callback)
 *
 * _List all customers_
 *
 * Returns a list of your customers. The customers are returned sorted by
 * creation date, with the most recently created customers appearing first.
 *
 * Like with an individual customer, you can view the list of customers
 * directly in your browser. 
 *
 * Options can be passed to limit the number of and set offset of the results:
 *
 *  + `count`: (*optional*, default is 10) A limit on the number of customers
 *  to be returned. Count can range between 1 and 100 charges. 
 *  + `offset`: (*optional*, default is 0) An offset into your customer array.
 *  The API will return the requested number of customers starting at that
 *  offset.
 *
 * Callback is called with an array of customers as second argument if the call
 * is successful. Each entry in the array is a separate customer object. If no
 * more customers are available, the resulting array will be empty. This
 * request should never return an error.
 * 
 * @param {Object} [opts] Lookup options
 * @param {Function} callback Called when the request finishes
 */
stripe.Customer.all = function(opts, callback) {
  opts = opts || {};
  if (typeof callback !== FUNC && typeof opts === FUNC) {
    callback = opts;
    opts = {};
  }

  opts.count = opts.count || 10;
  opts.offset = opts.offset || 0;

};
