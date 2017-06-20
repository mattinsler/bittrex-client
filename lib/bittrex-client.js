"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const crypto = require("crypto");
const qs = require("querystring");
const Decimal = require("decimal.js");
const got = require('got');
Decimal.config({ precision: 8 });
function removeUndefined(obj) {
    const res = Object.assign({}, obj);
    for (const k of Object.keys(obj)) {
        if (obj[k] === undefined) {
            delete obj[k];
        }
    }
    return res;
}
const DateConverter = (v) => new Date(v);
const DecimalConverter = (v) => new Decimal(v);
function buildConverter(config) {
    return function (obj) {
        const res = Object.assign({}, obj);
        for (const k of Object.keys(config)) {
            if (res[k] != null) {
                res[k] = config[k](res[k]);
            }
        }
        return res;
    };
}
var Bittrex;
(function (Bittrex) {
    ;
    Bittrex.BalanceConverter = buildConverter({
        Balance: DecimalConverter,
        Available: DecimalConverter,
        Pending: DecimalConverter
    });
    ;
    Bittrex.CurrencyConverter = buildConverter({
        TxFee: DecimalConverter
    });
    ;
    ;
    Bittrex.MarketConverter = buildConverter({
        MinTradeSize: DecimalConverter,
        Created: DateConverter
    });
    ;
    Bittrex.MarketHistoryConverter = buildConverter({
        TimeStamp: DateConverter,
        Quantity: DecimalConverter,
        Price: DecimalConverter,
        Total: DecimalConverter
    });
    ;
    Bittrex.MarketSummaryConverter = buildConverter({
        High: DecimalConverter,
        Low: DecimalConverter,
        Volume: DecimalConverter,
        Last: DecimalConverter,
        BaseVolume: DecimalConverter,
        TimeStamp: DateConverter,
        Bid: DecimalConverter,
        Ask: DecimalConverter,
        PrevDay: DecimalConverter,
        Created: DateConverter
    });
    ;
    Bittrex.OrderConverter = buildConverter({
        Quantity: DecimalConverter,
        QuantityRemaining: DecimalConverter,
        Limit: DecimalConverter,
        Reserved: DecimalConverter,
        ReserveRemaining: DecimalConverter,
        CommissionReserved: DecimalConverter,
        CommissionReserveRemaining: DecimalConverter,
        CommissionPaid: DecimalConverter,
        Price: DecimalConverter,
        PricePerUnit: DecimalConverter,
        Opened: DateConverter
    });
    ;
    Bittrex.OrderHistoryOrderConverter = buildConverter({
        TimeStamp: DateConverter,
        Limit: DecimalConverter,
        Quantity: DecimalConverter,
        QuantityRemaining: DecimalConverter,
        Commission: DecimalConverter,
        Price: DecimalConverter
    });
    ;
    Bittrex.OrderBookOrderConverter = buildConverter({
        Quantity: DecimalConverter,
        Rate: DecimalConverter
    });
    ;
    ;
    Bittrex.TickerConverter = buildConverter({
        Bid: DecimalConverter,
        Ask: DecimalConverter,
        Last: DecimalConverter
    });
    ;
    Bittrex.TransactionConverter = buildConverter({
        Amount: DecimalConverter,
        Opened: DateConverter,
        TxCost: DecimalConverter
    });
    ;
})(Bittrex = exports.Bittrex || (exports.Bittrex = {}));
;
class Client {
    get baseUrl() { return `https://bittrex.com/api/v${this.opts.version}`; }
    constructor({ key, secret, version = '1.1' } = {}) {
        assert(!!key, 'key is required');
        assert(!!secret, 'secret is required');
        this.opts = {
            key: key,
            secret: secret,
            version: version
        };
    }
    prepareRequest(pathname, data = {}) {
        const url = `${this.baseUrl}${pathname}`;
        const query = removeUndefined(Object.assign({}, data, { apikey: this.opts.key, nonce: Math.floor(Date.now() / 1000) }));
        const signature = crypto.createHmac('sha512', this.opts.secret)
            .update(`${url}?${qs.stringify(query)}`)
            .digest('hex');
        const opts = {
            agent: false,
            json: true,
            headers: {
                apisign: signature
            },
            query
        };
        return { url, opts };
    }
    request(pathname, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, opts } = this.prepareRequest(pathname, data);
            let res;
            try {
                res = yield got(url, opts);
            }
            catch (err) {
                throw new Error(`[${err.statusCode}: ${err.statusMessage}] ${err.response.body.message}`);
            }
            const { success, message, result } = res.body;
            if (success) {
                return result;
            }
            throw new Error(message);
        });
    }
    markets() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/public/getmarkets')).map(Bittrex.MarketConverter);
        });
    }
    currencies() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/public/getcurrencies')).map(Bittrex.CurrencyConverter);
        });
    }
    ticker(market) {
        return __awaiter(this, void 0, void 0, function* () {
            return Bittrex.TickerConverter(yield this.request('/public/getticker', { market }));
        });
    }
    marketSummaries() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/public/getmarketsummaries')).map(Bittrex.MarketSummaryConverter);
        });
    }
    marketSummary(market) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/public/getmarketsummary', { market })).map(Bittrex.MarketSummaryConverter)[0];
        });
    }
    orderBook(market, type = 'both', depth) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request('/public/getorderbook', { market, type, depth });
            return {
                buy: res.buy.map(Bittrex.OrderBookOrderConverter),
                sell: res.sell.map(Bittrex.OrderBookOrderConverter)
            };
        });
    }
    marketHistory(market) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/account/getmarkethistory', { market })).map(Bittrex.MarketHistoryConverter);
        });
    }
    balances() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/account/getbalances')).map(Bittrex.BalanceConverter);
        });
    }
    balance(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            return Bittrex.BalanceConverter(yield this.request('/account/getbalance', { currency }));
        });
    }
    depositAddress(currency) {
        return this.request('/account/getdepositaddress', { currency });
    }
    withdraw(currency, quantity, address, paymentid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('/account/withdraw', { currency, quantity: quantity.toNumber(), address, paymentid });
        });
    }
    order(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return Bittrex.OrderConverter(yield this.request('/account/getorder', { uuid }));
        });
    }
    orderHistory(market) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/account/getorderhistory', { market })).map(Bittrex.OrderHistoryOrderConverter);
        });
    }
    withdrawalHistory(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/account/getwithdrawalhistory', { currency })).map(Bittrex.TransactionConverter);
        });
    }
    depositHistory(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request('/account/getdeposithistory', { currency })).map(Bittrex.TransactionConverter);
        });
    }
}
exports.Client = Client;
