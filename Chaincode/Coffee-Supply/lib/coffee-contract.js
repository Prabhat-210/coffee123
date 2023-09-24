/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const OrderContract = require('./order-contract');

class CoffeeContract extends Contract {
    async coffeeExists(ctx, coffeeId) {
        const buffer = await ctx.stub.getState(coffeeId);
        return !!buffer && buffer.length > 0;
    }

    async createCoffee(
        ctx,
        coffeeId,
        make,
        model,
        color,
        dateOfManufacture,
        manufactureName
    ) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'exporter-coffee-com') {
            const exists = await this.coffeeExists(ctx, coffeeId);
            if (exists) {
                throw new Error(`The coffee ${coffeeId} already exists`);
            }
            const coffeeAsset = {
                make,
                model,
                color,
                dateOfManufacture,
                status: 'Ready to export',
                ownedBy: manufactureName,
                assetType: 'coffee',
            };
            const buffer = Buffer.from(JSON.stringify(coffeeAsset));
            await ctx.stub.putState(coffeeId, buffer);

            let addCoffeeEventData = { Type: 'Coffee creation', Model: model };
            await ctx.stub.setEvent('addCoffeeEvent', Buffer.from(JSON.stringify(addCoffeeEventData)));

        } else {
            return `User under following MSP:${mspID} cannot able to perform this action`;
        }
    }

    async readCoffee(ctx, coffeeId) {
        const exists = await this.coffeeExists(ctx, coffeeId);
        if (!exists) {
            throw new Error(`The coffee ${coffeeId} does not exist`);
        }
        const buffer = await ctx.stub.getState(coffeeId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async deleteCoffee(ctx, coffeeId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'exporter-coffee-com') {
            const exists = await this.coffeeExists(ctx, coffeeId);
            if (!exists) {
                throw new Error(`The coffee ${coffeeId} does not exist`);
            }
            await ctx.stub.deleteState(coffeeId);
        } else {
            return `User under following MSP:${mspID} cannot able to perform this action`;
        }
    }

    async checkMatchingOrders(ctx, coffeeId) {
        //throw new Error("test")
        const exists = await this.coffeeExists(ctx, coffeeId);
        if (!exists) {
            throw new Error(`The coffee ${coffeeId} does not exist`);
        }
        const coffeeBuffer = await ctx.stub.getState(coffeeId);
        const coffeeDetails = JSON.parse(coffeeBuffer.toString());
        
        const queryString = {
            selector: {
                assetType: 'order',
                make: coffeeDetails.make,
                color: coffeeDetails.color,
            },
        };
        const orderContract = new OrderContract();
        const orders = await orderContract.queryAllOrders(
            ctx,
            JSON.stringify(queryString)
        );   
        return orders;
    }

    async matchOrder(ctx, coffeeId, orderId) {
        const orderContract = new OrderContract();

        const coffeeDetails = await this.readCoffee(ctx, coffeeId);
        const orderDetails = await orderContract.readOrder(ctx, orderId);

        if (
            orderDetails.make === coffeeDetails.make &&
      orderDetails.model === coffeeDetails.model &&
      orderDetails.color === coffeeDetails.color
        ) {
            coffeeDetails.ownedBy = orderDetails.ImporterName;
            coffeeDetails.status = 'Assigned to a Importer';

            const newCoffeeBuffer = Buffer.from(JSON.stringify(coffeeDetails));
            await ctx.stub.putState(coffeeId, newCoffeeBuffer);

            await orderContract.deleteOrder(ctx, orderId);
            return `Coffee ${coffeeId} is assigned to ${orderDetails.ImporterName}`;
        } else {
            return 'Order is not matching';
        }
    }

    async registerCoffee(ctx, coffeeId, ownerName, registrationNumber) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'processor-coffee-com') {
            const exists = await this.coffeeExists(ctx, coffeeId);
            if (!exists) {
                throw new Error(`The coffee ${coffeeId} does not exist`);
            }

            const coffeeBuffer = await ctx.stub.getState(coffeeId);
            const coffeeDetails = JSON.parse(coffeeBuffer.toString());

            coffeeDetails.status = `The batch is being transferred from ${ownerName} to ${registrationNumber}`;
            coffeeDetails.ownedBy = ownerName;

            const newCoffeeBuffer = Buffer.from(JSON.stringify(coffeeDetails));
            await ctx.stub.putState(coffeeId, newCoffeeBuffer);

            return `Coffee ${coffeeId} is successfully registered to ${ownerName}`;
        } else {
            return `User under following MSP:${mspID} cannot able to perform this action`;
        }
    }

    async queryAllCoffees(ctx) {
        const queryString = {
            selector: {
                assetType: 'coffee',
            },
            sort: [{ dateOfManufacture: 'asc' }],
        };
        let resultIterator = await ctx.stub.getQueryResult(
            JSON.stringify(queryString)
        );
        let result = await this.getAllResults(resultIterator, false);
        return JSON.stringify(result);
    }

    async getCoffeesByRange(ctx, startKey, endKey) {
        let resultIterator = await ctx.stub.getStateByRange(startKey, endKey);
        let result = await this.getAllResults(resultIterator, false);
        return JSON.stringify(result);
    }

    async getCoffeesWithPagination(ctx, _pageSize, _bookmark) {
        const queryString = {
            selector: {
                assetType: 'coffee',
            },
        };

        const pageSize = parseInt(_pageSize, 10);
        const bookmark = _bookmark;

        const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(
            JSON.stringify(queryString),
            pageSize,
            bookmark
        );

        const result = await this.getAllResults(iterator, false);

        const results = {};
        results.Result = result;
        results.ResponseMetaData = {
            RecordCount: metadata.fetched_records_count,
            Bookmark: metadata.bookmark,
        };
        return JSON.stringify(results);
    }

    async getCoffeesHistory(ctx, coffeeId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(coffeeId);
        let results = await this.getAllResults(resultsIterator, true);
        return JSON.stringify(results);
    }

    async getAllResults(iterator, isHistory) {
        let allResult = [];

        for (
            let res = await iterator.next();
            !res.done;
            res = await iterator.next()
        ) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.timestamp = res.value.timestamp;
                    jsonRes.Value = JSON.parse(res.value.value.toString());
                } else {
                    jsonRes.Key = res.value.key;
                    jsonRes.Record = JSON.parse(res.value.value.toString());
                }
                allResult.push(jsonRes);
            }
        }
        await iterator.close();
        return allResult;
    }
}

module.exports = CoffeeContract;
