/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const CoffeeContract = require('./lib/coffee-contract');
const OrderContract = require('./lib/order-contract');

module.exports.CoffeeContract = CoffeeContract;
module.exports.OrderContract = OrderContract;
module.exports.contracts = [CoffeeContract, OrderContract];
