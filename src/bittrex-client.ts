import * as assert from 'assert';
import * as crypto from 'crypto';
import * as qs from 'querystring';
import * as Decimal from 'decimal.js';
const got = require('got');

Decimal.config({ precision: 8 });

type ObjectType = {[k:string]: any};

function createFieldConverter<T>(converter: (v: any) => T, ...fields: string[]) {
  const fieldSet = new Set(fields);

  return function(obj: ObjectType): ObjectType {
    return Object.keys(obj).reduce((res: ObjectType, key: string) => {
      if (fieldSet.has(key)) {
        res[key] = converter(obj[key]);
      } else {
        res[key] = obj[key];
      }
      return res;
    }, {});
  };
}

function removeUndefined(obj: ObjectType): ObjectType {
  return Object.keys(obj).reduce((o: ObjectType, k) => {
    const v = obj[k];
    if (v !== undefined) { o[k] = v; }
    return o;
  }, {});
}

export namespace Bittrex {
  export type Decimal = decimal.Decimal;

  export interface Balance {
    Currency: string;
    Balance: Decimal;
    Available: Decimal;
    Pending: Decimal;
    CryptoAddress: string | null;
    // Requested?: boolean;
    // Uuid: string | null;
  };

  export interface Currency {
    Currency: string; // BTC
    CurrencyLong: string; // Bitcoin
    MinConfirmation: number;
    TxFee: Decimal;
    IsActive: boolean;
    CoinType: string; // BITCOIN
    BaseAddress: string | null;
  };

  export interface Market {
    MarketCurrency: string; // LTC
    BaseCurrency: string; // BTC
    MarketCurrencyLong: string; // Litecoin
    BaseCurrencyLong: string; // Bitcoin
    MinTradeSize: Decimal;
    MarketName: string; // BTC-LTC
    IsActive: boolean;
    Created: string; // 2014-02-13T00:00:00
  };

  export interface MarketHistory {
    Id: number;
    TimeStamp: string; // 2014-07-09T03:21:20.08
    Quantity: Decimal;
    Price: Decimal;
    Total: Decimal;
    FillType: 'FILL' | 'PARTIAL_FILL';
    OrderType: 'BUY' | 'SELL';
  };

  export interface MarketSummary {
    MarketName: string;
    High: Decimal;
    Low: Decimal;
    Volume: Decimal;
    Last: Decimal;
    BaseVolume: Decimal;
    TimeStamp: string; // 2014-07-09T07:19:30.15
    Bid: Decimal;
    Ask: Decimal;
    OpenBuyOrders: number;
    OpenSellOrders: number;
    PrevDay: Decimal;
    Created: string; // 2014-03-20T06:00:00
    DisplayMarketName: string | null;
  };

  export interface OrderBookOrder {
    Quantity: Decimal;
    Rate: Decimal;
  };

  export interface OrderBook {
    buy: OrderBookOrder[];
    sell: OrderBookOrder[];
  }

  export interface Ticker {
    Bid: Decimal;
		Ask: Decimal;
		Last: Decimal;
  }

  export interface Client {
    // public
    markets(): Promise<Market[]>;
    currencies(): Promise<Currency[]>;
    ticker(market: string): Promise<Ticker>;
    marketSummaries(): Promise<MarketSummary[]>;
    marketSummary(market: string): Promise<MarketSummary>;
    orderBook(market: string, type: 'buy' | 'sell' | 'both', depth?: number): Promise<OrderBook>;
    marketHistory(market: string): Promise<MarketHistory[]>;

    // market
    

    // account
    balances(): Promise<Balance[]>;
  }
};




export interface Options {
  key: string;
  secret: string;
  version?: '1.0' | '1.1';
}

export class Client implements Bittrex.Client {
  private opts: Options;
  private get baseUrl() { return `https://bittrex.com/api/v${this.opts.version}`; }

  constructor({ key, secret, version = '1.1' }: Partial<Options> = {}) {
    assert(!!key, 'key is required');
    assert(!!secret, 'secret is required');

    this.opts = {
      key: key,
      secret: secret,
      version: version
    };
  }

  private prepareRequest(pathname: string, data = {}) {
    const url = `${this.baseUrl}${pathname}`;

    const query = removeUndefined({
      ...data,
      apikey: this.opts.key,
      nonce: Math.floor(Date.now() / 1000)
    });

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

  private async request(pathname: string, data = {}) {
    const { url, opts } = this.prepareRequest(pathname, data);

    let res;
    
    try {
      res = await got(url, opts);
    } catch (err) {
      throw new Error(`[${err.statusCode}: ${err.statusMessage}] ${err.response.body.message}`);
    }

    const { success, message, result } = res.body;

    if (success) { return result; }
    throw new Error(message);
  }

  public async markets(): Promise<Bittrex.Market[]> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'MinTradeSize'
    );
    return (await this.request('/public/getmarkets')).map(converter);
  }

  public async currencies(): Promise<Bittrex.Currency[]> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'TxFee'
    );
    return (await this.request('/public/getcurrencies')).map(converter);
  }

  public async ticker(market: string): Promise<Bittrex.Ticker> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'Bid', 'Ask', 'Last'
    );
    return converter(await this.request('/public/getticker', { market })) as Bittrex.Ticker;
  }

  public async marketSummaries(): Promise<Bittrex.MarketSummary[]> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'High', 'Low', 'Volume', 'Last', 'BaseVolume', 'Bid', 'Ask', 'PrevDay'
    );
    return (await this.request('/public/getmarketsummaries')).map(converter);
  }

  public async marketSummary(market: string): Promise<Bittrex.MarketSummary> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'High', 'Low', 'Volume', 'Last', 'BaseVolume', 'Bid', 'Ask', 'PrevDay'
    );
    return (await this.request('/public/getmarketsummary', { market })).map(converter)[0];
  }

  public async orderBook(market: string, type: 'buy' | 'sell' | 'both' = 'both', depth?: number): Promise<Bittrex.OrderBook> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'Quantity', 'Rate'
    );
    const res = await this.request('/public/getorderbook', { market, type, depth });
    return {
      buy: res.buy.map(converter),
      sell: res.sell.map(converter)
    }
  }

  public async marketHistory(market: string): Promise<Bittrex.MarketHistory[]> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'Quantity', 'Price', 'Total'
    );
    return (await this.request('/account/getmarkethistory', { market })).map(converter);
  }

  public async balances(): Promise<Bittrex.Balance[]> {
    const converter = createFieldConverter(
      v => new Decimal(v),
      'Balance', 'Available', 'Pending'
    );
    return (await this.request('/account/getbalances')).map(converter);
  }  
}
