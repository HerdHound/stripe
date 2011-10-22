var stripe = exports;

stripe.apiKey = require('./lib/stripe').apiKey;

stripe.Charge = require('./lib/charge').Charge;
stripe.Customer = require('./lib/customer').Customer;
