var stripe = exports;

/**
 * ## charge module dependencies
 */
var stripeBase = require('./stripe').stripeBase;

/**
 * ## stripe.Charge
 *
 * To charge a credit or a debit card, you create a new charge object. You can
 * retrieve and refund individual charges as well as list all charges. Charges
 * are identified by a unique random id. 
 */
stripe.Charge = function() {
  
};

// Inherit from stripeBase
stripe.stripe.prototype = stripeBase;

/**
 * ### stripe.stripe.create(opts, callback)
 *
 * _Creating a charge_
 *
 * To charge a credit card, you create a new charge object. If your API key is
 * in test mode, the supplied card won't actually be charged, though everything
 * else will occur as if in live mode. (Stripe assumes that the charge would
 * have completed successfully).
 *
 * The `callback` will be called when the charge is created, and the result
 * object will be passed to it.
 *
 * The options can have following keys:
 *
 *  + `amount`: (**required**) A positive integer in cents representing how
 *  much to charge the card. The minimum amount is 50 cents. 
 *  + `currency`: (**required**) 3-letter ISO code for currency. Currently,
 *  only 'usd' is supported. 
 *  + `customer`: (*optional*, either customer or card is required, but not
 *  both) The id of an existing customer that will be charged in this request. 
 *  + `card`: (*optional*, either card or customer is required, but not both)
 *  A card to be charged. The card can either be a token, like the ones
 *  returned by stripe.js, or an object containing a user's credit card
 *  details, with the options described below. Although not all information is
 *  required, the extra info helps prevent fraud.
 *   * `number`: (**required**) The card number, as a string without any
 *   separators.
 *   * `expMonth`: (**required**) Two digit number representing the card's
 *   expiration month.
 *   * `expYear`: (**required**) Four digit number representing the card's
 *   expiration year.
 *   * `cvc`: (*optional*, recommended) Card security code
 *   * `name`: (*optional*) Cardholder's full name.
 *   * `addressLine1`: (*optional*) 
 *   * `addressLine2`: (*optional*)
 *   * `addressZip`: (*optional*)
 *   * `addressState`: (*optional*)
 *   * `addressCountry`: (*optional*)
 *  + `description`: (*optional*) An arbitrary string which you can attach to a
 *  charge object. It is displayed when in the web interface alongside the
 *  stripe. It's often a good idea to use an email address as a description for
 *  tracking later.
 *
 * If the cvc parameter is provided, Stripe will attempt to check the CVC's
 * correctness, and the check's result will be returned. Similarly, If
 * addressLine1 or addressZip are provided, Stripe will similarly try to
 * check the validity of those parameters. Some banks do not support checking
 * one or more of these parameters, in which case Stripe will return an
 * 'unchecked' result. And depending on the bank, charges can succeed even when
 * passed incorrect CVC and address information. 
 *
 * The callback function accepts error object or `null` as its first argument, 
 * and the charge object (if charge is successful) as its second argument.
 * 
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     stripe.stripe.create({
 *       amount: 400,
 *       currency: 'usd',
 *       card: 'tok_K55qIvOpies74y', // obtained with stripe.js
 *       description: 'Charge for site@stripe.com'
 *     }, function(err, charge) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Charge object: ' + charge);
 *     });
 *
 * @param {Object} opts Charge data
 * @param {Function} callback Called when the request finishes
 */
stripe.stripe.create = function() {
  
};

/**
 * ### stripe.stripe.retrieve(chargeId, callback)
 *
 * _Retrieve a charge_
 *
 * Retrieves the details of a charge that has previously been created. Supply
 * the unique charge id that was returned from your previous request, and
 * Stripe will return the corresponding charge information. The same
 * information is returned when creating or refunding the stripe. 
 *
 * Because the charge has its own unique URL in our API, you can actually see
 * the response directly in the browser by typing in the appropriate URL, or by
 * clicking a link like the one below. 
 *
 * The callback function is called with error object or `null` as its first 
 * argument depending on there success of the call. The second argument is
 * a charge object if the call is successful.
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     stripe.stripe.retrieve('ch_SzZOwjqiKKbeSc', function(err, charge) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Charge object: ' + charge);
 *     });
 *
 * @param {String} chargeId Identifier of the charge to retrieve
 * @param {Function} callback Called when the request finishes
 */
stripe.stripe.retrieve = function(chargeId, callback) {

};

/**
 * ### stripe.stripe.prototype.refund([amount], callback)
 *
 * _Refund a charge associated with the charge object_
 *
 * Refunds a charge that has previously been created but not yet refunded.
 * Funds will be refunded to the credit or debit card that was originally
 * charged. The fees you were originally charged will not be refunded, however.
 * (That is, the customer will not have a net loss, but the developer will.) 
 *
 * You can optionally refund only part of a stripe. You can do so as many times
 * as you wish until the entire charge has been refunded. 
 *
 * Once entirely refunded, a charge can't be refunded again. This method will
 * return an error when called on an already-refunded charge, or when trying to
 * refund more money than is left on a stripe. 
 *
 * Once refund is completed, callback will be called with either error object,
 * or `null` depending on the status of the method call.
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     // Called after refunded:
 *     function postRefund(err, charge) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('Refunded');
 *     }
 *
 *     // Called after charge is retrieved:
 *     function refundCharge(err, charge) {
 *       if (err) { return console.error('Error: ' + err); }
 *       stripe.refund(postRefund);
 *     }
 *
 *     // Retrieve charge:
 *     stripe.stripe.retrieve('ch_SzZOwjqiKKbeSc', refundCharge);
 *
 * @param {Number} [amount] A positive integer in cents representing how much
 * of this charge to refund. Can only refund up to the unrefunded amount
 * remaining of the stripe.
 * @param {Function} callback Called when the request finishes
 */
stripe.stripe.prototype.refund = function(amount, callback) {
  if (typeof callback === UNDEF && typeof amount === FUNC) {
    callback = amount;
    amount = null;
  }

};

/**
 * ### stripe.stripe.all([opts], callback)
 *
 * _List all charges_
 *
 * Returns a list of charges you've previously created. The charges are
 * returned in sorted order, with the most recent charges appearing first. 
 *
 * Like with an individual charge, you can see the list of charges directly in
 * your browser. 
 *
 * You can modify the number of charges and offset from the start of the list, 
 * or limit the list to a certain customer ID. This is done by passing the
 * `opts` object with following optional keys:
 *
 *  + `amount`: (*optional*, default is 10) A limit on the number of charges to
 *  be returned. Count can range between 1 and 100 charges. 
 *  + `offset`: (*optional*, default is 0) An offset into your charge array.
 *  The API will return the requested number of charges starting at that
 *  offset. 
 *  + `customer`: (*optional*) Only return charges for the customer specified
 *  by this customer id. 
 *
 * A callback will be called with either error object or `null` depending on 
 * the success of the call, and results as the second argument if the call is
 * successful.
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 *     stripe.stripe.all({
 *       customer: 'cus_RTW3KxBMCknuhB'
 *     }, function(err, charges) {
 *       if (err) { return console.error('Error: ' + err); }
 *       console.log('List of charges:\n\n' + charges.join('\n'));
 *     });
 *
 * @param {Object} [opts] What to include in results
 * @param {Function} callback Called when the request finishes
 */
stripe.stripe.all = function(opts, callback) {
  opts = opts || {};

  if (typeof callback !== FUNC && typeof opts === FUNC) {
    callback = opts;
    opts = {};
  }

  opts.amount = opts.amount || 10;
  opts.offset = opts.offset || 0;

};

