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
function createFieldConverter(converter, ...fields) {
    const fieldSet = new Set(fields);
    return function (obj) {
        return Object.keys(obj).reduce((res, key) => {
            if (fieldSet.has(key)) {
                res[key] = converter(obj[key]);
            }
            else {
                res[key] = obj[key];
            }
            return res;
        }, {});
    };
}
function removeUndefined(obj) {
    return Object.keys(obj).reduce((o, k) => {
        const v = obj[k];
        if (v !== undefined) {
            o[k] = v;
        }
        return o;
    }, {});
}
var Bittrex;
(function (Bittrex) {
    ;
    ;
    ;
    ;
    ;
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
            const converter = createFieldConverter(v => new Decimal(v), 'MinTradeSize');
            return (yield this.request('/public/getmarkets')).map(converter);
        });
    }
    currencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'TxFee');
            return (yield this.request('/public/getcurrencies')).map(converter);
        });
    }
    ticker(market) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'Bid', 'Ask', 'Last');
            return converter(yield this.request('/public/getticker', { market }));
        });
    }
    marketSummaries() {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'High', 'Low', 'Volume', 'Last', 'BaseVolume', 'Bid', 'Ask', 'PrevDay');
            return (yield this.request('/public/getmarketsummaries')).map(converter);
        });
    }
    marketSummary(market) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'High', 'Low', 'Volume', 'Last', 'BaseVolume', 'Bid', 'Ask', 'PrevDay');
            return (yield this.request('/public/getmarketsummary', { market })).map(converter)[0];
        });
    }
    orderBook(market, type = 'both', depth) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'Quantity', 'Rate');
            const res = yield this.request('/public/getorderbook', { market, type, depth });
            return {
                buy: res.buy.map(converter),
                sell: res.sell.map(converter)
            };
        });
    }
    marketHistory(market) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'Quantity', 'Price', 'Total');
            return (yield this.request('/account/getmarkethistory', { market })).map(converter);
        });
    }
    balances() {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = createFieldConverter(v => new Decimal(v), 'Balance', 'Available', 'Pending');
            return (yield this.request('/account/getbalances')).map(converter);
        });
    }
}
exports.Client = Client;
