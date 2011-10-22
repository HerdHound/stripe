/**
 * # stripe
 *
 * _Node.js library for integrating Stripe payment gateway._
 *
 * Documentation for this module has been adapted from 
 * [Stripe's official documentation](https://stripe.com/docs/api).
 *
 * The Stripe API is organized around REST. Our API is designed to have
 * predictable, resource-oriented URLS, to use HTTP response codes to indicate
 * API errors, and to use built-in HTTP features, like HTTP authentication and
 * HTTP verbs, which can be understood by off-the-shelf HTTP clients. JSON will
 * be returned in all responses from the API, including errors.
 *
 * To make the Stripe API as explorable as possible, accounts have test-mode
 * API keys as well as live-mode API keys. These keys can be active at the same
 * time. Data created with test-mode credentials will never hit the credit card
 * networks and will never cost anyone money.
 *
 * ## API Endpoint
 *
 *     https://api.stripe.com/
 *
 * ## Summary of Resource URL Patterns
 *
 *     /v1/charges 
 *     /v1/charges/{CHARGE_ID} 
 *     /v1/customers
 *     /v1/customers/{CUSTOMER_ID} 
 *     /v1/customers/{CUSTOMER_ID}/subscription
 *     /v1/invoices 
 *     /v1/invoices/{INVOICE_ID} 
 *     /v1/invoiceitems
 *     /v1/invoiceitems/{INVOICEITEM_ID} 
 *     /v1/tokens 
 *     /v1/tokens/{TOKEN_ID}
 *
 * @author Branko Vukelic, Monwara LLC <branko@herdhound.com>
 */

var stripe = exports;
stripe.API_VERSION = 'v1';
stripe.CLIENT_VERSION = '0.0.1';
stripe.API_CLIENT = 'Stripe-node/' + stripe.CLIENT_VERSION + 
  ' Node.js/' + process.version;

/**
 * ## Constants and macros
 */
var FUNC = 'function';
var UNDEF = 'undefined';

/**
 * ## Module dependencies
 */
var util = require('util');
var querystring = require('querystring');
var https = require('https'); 
var normalize = require('./normalize');

/**
 * ## stripe.StripeError
 *
 * _Error object_
 *
 * All methods in this library will return an instance of 
 * ``stripe.StripeError`` object when Stripe gateway retruns one of the error 
 * HTTP codes. The error object will contain details about the error as 
 * described below.
 * 
 * Stripe uses conventional HTTP response codes to indicate success or failure
 * of an API request. In general, codes in the 2xx range indicate success,
 * codes in the 4xx range indicate an error that resulted from the provided
 * information (e.g. a required parameter was missing, a charge failed, etc.),
 * and codes in the 5xx range indicate an error with Stripe's servers.
 *
 * Not all errors map cleanly onto HTTP response codes, however. When a request
 * is valid but does not complete successfully (e.g. a card is declined), we
 * return a 402 error code.
 *
 * All errors return JSON with a type (one of card_error,
 * invalid_request_error, or api_error) and message describing the particular
 * problem. Properties on the JSON response will be mapped directly to 
 * properties of the ``stripe.StripeError`` object.
 *
 *  + `type`: The type of error returned (card_error, invalidRequestError,
 *  apiError) Card errors are the most common type of error you should expect
 *  to handle. They result when the user enters a card that can't be charged
 *  for some reason. Invalid request errors arise when your request has invalid
 *  parameters. API errors cover any other type of problem (e.g. a temporary
 *  problem with Stripe's servers) and should turn up only very infrequently. 
 *  In addition, the `failedRequestError` is returned when Node.js itself 
 *  encounters difficulties making the request (e.g., network is down, etc).
 *  + `message`: A user-friendly message describing the error
 *  + `code`: (*optional*) For card errors, additional information about the
 *  user-friendly message to display for this error (e.g. "Your card was
 *  declined.")
 *  + `param`: (*optional*) The parameter the error relates to if the error is
 *  parameter-specific. You can use this to display a message near the correct
 *  form field, for example.
 *
 * ### HTTP Status Codes
 *
 * The actual status code that was returned by the gateway will be mapped to a
 * ``status`` property on the ``stripe.StripeError`` object.
 *  
 *  + **0** _Request error_: This is internal failure of the client library
 *  rather than real HTTP failure
 *  + **200** _OK_: Everything worked as expected.
 *  + **400** _Bad Request_: Often missing a required parameter.
 *  + **401** _Unauthorized_: No valid API key provided.
 *  + **402** _Request Failed_: Parameters were valid but request failed.
 *  + **404** _Not Found_: The requested item doesn't exist.
 *  + **500, 502, 503, 504** _Server errors_: something went wrong on Stripe's
 *  end.
 *
 * ### Errors
 *
 * #### Internal Request Error
 *
 *  + **Type:** `failedRequestError`
 *  + **Code:** The original error object
 *
 * #### Invalid Request Errors 
 *
 *  + **Type:** `invalidRequestError` 
 * 
 * #### API Errors 
 *
 *  + **Type:** `apiError` 
 *
 * #### Card Errors 
 *
 *  + **Type:** `cardError`
 *  + **Codes:**
 *   * `invalidNumber`: The card number is invalid
 *   * `incorrectNumber`: The card number is incorrect
 *   * `invalidExpiryMonth`: The card's expiration missingonth is invalid
 *   * `invalidExpiryMonth`: The card's expiration year is invalid
 *   * `invalidCvc`: The card's security code is invalid
 *   * `expiredCard`: The card has expired
 *   * `invalidAmount`: An invalid amount was entered
 *   * `incorrectCvc`: The card's security code is incorrect
 *   * `cardDeclined`: The card wass declined.
 *   * `missing`: There is no card on a customer that is being chargeded.
 *   * `duplicateTransaction`: A transaction with identical amount and
 *   creditit card information was submitted very recently.
 *   * `processingError`: An error occurred while processing the card.
 *
 * @param {String} status Original status code returned by server
 * @param {String} type Type of error
 * @param {String} [code] Optional error code
 * @param {String} message
 */
stripe.StripeError = function(status, type, code, message, param) {
  this.status = status;
  this.type = type;
  this.code = code;
  this.messsage = message;
  this.param = param;
};

// Alias for convenience when used inside this module
var StripeError = stripe.StripeError;

// Inherit from global Error object
util.inherits(stripe.StripeError, Error);

// Stringify the error object
stripe.StripeError.prototype.toString = function() {
  return '[StripeError: ' + 
    this.type + 
    ' ' + 
    this.message + 
    ' (' + 
    this.status + ')]';
};

/**
 * ## stripe.apiKey 
 *
 * _Stripe authentication key_
 *
 * You authenticate to the Stripe API by providing one of your API keys in the
 * request. You can manage your API keys from your account. You can have
 * multiple API keys active at one time. Your API keys carry many privileges,
 * so be sure to keep them secret! 
 *
 * To use your API key, you need only set `stripe.apiKey` equal to the key. The
 * Python library will automatically send this key in each request.
 *
 * All API requests must be made over HTTPS. Calls made over plain HTTP will
 * fail. You must authenticate for all requests. 
 *
 * Example:
 *
 *     var stripe = require('stripe');
 *     stripe.apiKey = 'vtUQeOtUnYr7PGCLQ96Ul4zqpDUO4sOE';
 *
 */
stripe.apiKey = '';

/**
 * ## stripe.stripeBase
 *
 * _Base object used to do the actual heavy-lifing_
 *
 * @private
 */
stripe.stripeBase = {
  apiEndpoint: 'api.stripe.com',
  version: stripe.API_VERSION,
  path: '' // override this in child object
};

/**
 * ## stripeBase._cred()
 *
 * _Generate HTTP auth credential_
 *
 * @return {String} Base64-encoded credential for use in HTTP auth header
 * @private
 */
stripe.stripeBase._cred = function() {
  // Use cached value or generate new one
  this._b64cred = this._b64cred || 'Basic ' + 
    new Buffer(stripe.apiKey).toString('base64');

  return this._b64cred;
};

/**
 * ## stripe.stripeBase._process(res, callback)
 *
 * _Process response data_
 *
 * Callback is called with error object or `null` as first argument, depending 
 * on success of the request. Second argument is the parsed JSON data.
 *
 * @param {Object} res Response object
 * @private
 */
stripe.stripeBase._process = function(res, callback) {
  var JSONdata;

  if (res.body.length) {
    JSONdata = JSON.parse(res.body);
    JSONdata = normaliez.camelizeKeys(JSONdata);
  }

  if (res.status != 200) {
    callback(stripe.StripeError(
      res.status, 
      JSONdata.type, 
      JSONdata.code, 
      JSONdata.message, 
      JSONdata.param
    ), JSONdata);
  } else {
    callback(null, JSONdata);
  }
};

/**
 * ## stripe.stripeBase._request(path, method, [data], callback)
 *
 * _Make HTTPS request to Stripe gateway_
 *
 * @param {String} path API path to make request to
 * @param {String} method HTTP method
 * @param {Object} [data] Optional request data
 * @param {Function} callback Called when the request finishes
 * @private
 */
stripe.stripeBase._request = function(path, method, data, callback) {
  var self = this;
  var requestOptions = {};
  var payload = data ? querystring.stringify(data) : data;

  requestOptions.headers = {
    'Authorization': self._cred(),
    'User-Agent': stripe.API_CLIENT,
    'Accepts': 'application/json',
    'Date': (new Date()).toString(),
    'Content-Length': 0
  };
  
  if (typeof callback !== FUNC && typeof data === FUNC) {
    callback = data;
    data = null;
  }

  requestOptions.host = self.apiEndpoint; 
  requestOptions.path = '/' + self.version + (path || self.path);

  if (method === 'GET') {
    requestOptions.path += '?' + payload;
    payload = null;
  }

  if (payload) {
    requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    requestOptions.headers['Content-Length'] = payload.length;
  }

  var req = https.request(requestOptions, function(res) {
    response = {};

    response.status = res.statusCode;
    response.body = '';

    res.on('data', function(chunk) {
      response.body += chunk;
    });

    res.on('end', function(err) {
      if (err) {
        callback(new stripe.StripeError(
          0, 'failedRequestError', err, 'Request could not be completed'
        ));
      }

      self._process(response);
    });
  });

  req.on('error', function(err) {
    callback(new stripe.StripeError(
      0, 'failedRequestError', err, 'Request could not be completed'
    ));
  });

  if (payload) {
    req.write(payload);
  }

  req.end();
};
