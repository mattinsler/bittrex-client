import * as assert from 'assert';
import * as crypto from 'crypto';
import * as qs from 'querystring';
import * as Decimal from 'decimal.js';
const got = require('got');

Decimal.config({ precision: 8 });

function removeUndefined(obj: any) {
  const res = Object.assign({}, obj);

  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined) {
      delete obj[k];
    }
  }

  return res;
}

const DateConverter = (v: string) => new Date(v);
const DecimalConverter = (v: number | string) => new Decimal(v);

function buildConverter<T>(config: { [k:string]: (v: any) => any }) {
  return function(obj: any): T {
    const res = Object.assign({}, obj);

    for (const k of Object.keys(config)) {
      if (res[k] != null) {
        res[k] = config[k](res[k]);
      }
    }

    return res;
  }
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

  export const BalanceConverter = buildConverter<Balance>({
    Balance: DecimalConverter,
    Available: DecimalConverter,
    Pending: DecimalConverter
  })

  export interface Currency {
    Currency: string; // BTC
    CurrencyLong: string; // Bitcoin
    MinConfirmation: number;
    TxFee: Decimal;
    IsActive: boolean;
    CoinType: string; // BITCOIN
    BaseAddress: string | null;
  };

  export const CurrencyConverter = buildConverter<Currency>({
    TxFee: DecimalConverter
  });

  export interface DepositAddress {
    Currency: string; // VTC
		Address: string; // Vy5SKeKGXUHKS2WVpJ76HYuKAu3URastUo
  };

  export interface Market {
    MarketCurrency: string; // LTC
    BaseCurrency: string; // BTC
    MarketCurrencyLong: string; // Litecoin
    BaseCurrencyLong: string; // Bitcoin
    MinTradeSize: Decimal;
    MarketName: string; // BTC-LTC
    IsActive: boolean;
    Created: Date; // 2014-02-13T00:00:00
  };

  export const MarketConverter = buildConverter<Market>({
    MinTradeSize: DecimalConverter,
    Created: DateConverter
  });

  export interface MarketHistory {
    Id: number;
    TimeStamp: Date; // 2014-07-09T03:21:20.08
    Quantity: Decimal;
    Price: Decimal;
    Total: Decimal;
    FillType: 'FILL' | 'PARTIAL_FILL';
    OrderType: 'BUY' | 'SELL';
  };

  export const MarketHistoryConverter = buildConverter<MarketHistory>({
    TimeStamp: DateConverter,
    Quantity: DecimalConverter,
    Price: DecimalConverter,
    Total: DecimalConverter
  });

  export interface MarketSummary {
    MarketName: string;
    High: Decimal;
    Low: Decimal;
    Volume: Decimal;
    Last: Decimal;
    BaseVolume: Decimal;
    TimeStamp: Date; // 2014-07-09T07:19:30.15
    Bid: Decimal;
    Ask: Decimal;
    OpenBuyOrders: number;
    OpenSellOrders: number;
    PrevDay: Decimal;
    Created: Date; // 2014-03-20T06:00:00
    DisplayMarketName: string | null;
  };

  export const MarketSummaryConverter = buildConverter<MarketSummary>({
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

  export interface Order {
    AccountId: string | null; // null
		OrderUuid: string; // 0cb4c4e4-bdc7-4e13-8c13-430e587d2cc1
		Exchange: string; // BTC-SHLD
		Type: string; // LIMIT_BUY
		Quantity: Decimal; // 1000.00000000
		QuantityRemaining: Decimal; // 1000.00000000
		Limit: Decimal; // 0.00000001
		Reserved: Decimal; // 0.00001000
		ReserveRemaining: Decimal; // 0.00001000
		CommissionReserved: Decimal; // 0.00000002
		CommissionReserveRemaining: Decimal; // 0.00000002
		CommissionPaid: Decimal; // 0.00000000
		Price: Decimal; // 0.00000000
		PricePerUnit: Decimal | null; // null
		Opened: Date; // 2014-07-13T07:45:46.27
		Closed: null; // null
		IsOpen: boolean; // true
		Sentinel: string; // 6c454604-22e2-4fb4-892e-179eede20972
		CancelInitiated: boolean; // false
		ImmediateOrCancel: boolean; // false
		IsConditional: boolean; // false
		Condition: string; // NONE
		ConditionTarget: null; // null
  };

  export const OrderConverter = buildConverter<Order>({
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

  export interface OrderHistoryOrder {
    OrderUuid: string; // fd97d393-e9b9-4dd1-9dbf-f288fc72a185
    Exchange: string; // BTC-LTC
    TimeStamp: Date; // 2014-07-09T04:01:00.667
    OrderType: string; // LIMIT_BUY
    Limit: Decimal; // 0.00000001
    Quantity: Decimal; // 100000.00000000
    QuantityRemaining: Decimal; // 100000.00000000
    Commission: Decimal; // 0.00000000
    Price: Decimal; // 0.00000000
    PricePerUnit: null; // null
    IsConditional: boolean; // false
    Condition: null; // null
    ConditionTarget: null; // null
    ImmediateOrCancel: boolean; // false
  };

  export const OrderHistoryOrderConverter = buildConverter<OrderHistoryOrder>({
    TimeStamp: DateConverter,
    Limit: DecimalConverter,
    Quantity: DecimalConverter,
    QuantityRemaining: DecimalConverter,
    Commission: DecimalConverter,
    Price: DecimalConverter
  });

  export interface OrderBookOrder {
    Quantity: Decimal;
    Rate: Decimal;
  };

  export const OrderBookOrderConverter = buildConverter<OrderBookOrder>({
    Quantity: DecimalConverter,
    Rate: DecimalConverter
  });

  export interface OrderBook {
    buy: OrderBookOrder[];
    sell: OrderBookOrder[];
  };

  export interface Ticker {
    Bid: Decimal;
		Ask: Decimal;
		Last: Decimal;
  };

  export const TickerConverter = buildConverter<Ticker>({
    Bid: DecimalConverter,
		Ask: DecimalConverter,
		Last: DecimalConverter
  });

  export interface Transaction {
    PaymentUuid: string; // b52c7a5c-90c6-4c6e-835c-e16df12708b1
    Currency: string; // BTC
    Amount: Decimal; // 17.00000000
    Address: string; // 1DeaaFBdbB5nrHj87x3NHS4onvw1GPNyAu
    Opened: Date; // 2014-07-09T04:24:47.217
    Authorized: boolean; // true
    PendingPayment: boolean; // false
    TxCost: Decimal; // 0.00020000
    TxId: string | null; // 3efd41b3a051433a888eed3ecc174c1d025a5e2b486eb418eaaec5efddda22de | null
    Canceled: boolean; // true
    InvalidAddress: boolean; // false
  };

  export const TransactionConverter = buildConverter<Transaction>({
    Amount: DecimalConverter,
    Opened: DateConverter,
    TxCost: DecimalConverter
  });

  export interface WithdrawalConfirmation {
    uuid: string; // 68b5a16c-92de-11e3-ba3b-425861b86ab6
  };

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
    balance(currency: string): Promise<Balance>;
    depositAddress(currency: string): Promise<DepositAddress>;
    withdraw(currency: string, quantity: Decimal, address: string, paymentid?: string): Promise<WithdrawalConfirmation>;
    order(uuid: string): Promise<Order>;
    orderHistory(market?: string): Promise<OrderHistoryOrder[]>;
    withdrawalHistory(currency?: string): Promise<Transaction[]>;
    depositHistory(currency?: string): Promise<Transaction[]>;
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
    return (await this.request('/public/getmarkets')).map(Bittrex.MarketConverter);
  }

  public async currencies(): Promise<Bittrex.Currency[]> {
    return (await this.request('/public/getcurrencies')).map(Bittrex.CurrencyConverter);
  }

  public async ticker(market: string): Promise<Bittrex.Ticker> {
    return Bittrex.TickerConverter(await this.request('/public/getticker', { market }));
  }

  public async marketSummaries(): Promise<Bittrex.MarketSummary[]> {
    return (await this.request('/public/getmarketsummaries')).map(Bittrex.MarketSummaryConverter);
  }

  public async marketSummary(market: string): Promise<Bittrex.MarketSummary> {
    return (await this.request('/public/getmarketsummary', { market })).map(Bittrex.MarketSummaryConverter)[0];
  }

  public async orderBook(market: string, type: 'buy' | 'sell' | 'both' = 'both', depth?: number): Promise<Bittrex.OrderBook> {
    const res = await this.request('/public/getorderbook', { market, type, depth });
    return {
      buy: res.buy.map(Bittrex.OrderBookOrderConverter),
      sell: res.sell.map(Bittrex.OrderBookOrderConverter)
    }
  }

  public async marketHistory(market: string): Promise<Bittrex.MarketHistory[]> {
    return (await this.request('/account/getmarkethistory', { market })).map(Bittrex.MarketHistoryConverter);
  }

  public async balances(): Promise<Bittrex.Balance[]> {
    return (await this.request('/account/getbalances')).map(Bittrex.BalanceConverter);
  }

  public async balance(currency: string): Promise<Bittrex.Balance> {
    return Bittrex.BalanceConverter(await this.request('/account/getbalance', { currency }));
  }

  public depositAddress(currency: string): Promise<Bittrex.DepositAddress> {
    return this.request('/account/getdepositaddress', { currency });
  }

  public async withdraw(currency: string, quantity: Bittrex.Decimal, address: string, paymentid?: string): Promise<Bittrex.WithdrawalConfirmation> {
    return await this.request('/account/withdraw', { currency, quantity: quantity.toNumber(), address, paymentid });
  }

  public async order(uuid: string): Promise<Bittrex.Order> {
    return Bittrex.OrderConverter(await this.request('/account/getorder', { uuid }));
  }

  public async orderHistory(market?: string): Promise<Bittrex.OrderHistoryOrder[]> {
    return (await this.request('/account/getorderhistory', { market })).map(Bittrex.OrderHistoryOrderConverter);
  }

  public async withdrawalHistory(currency?: string): Promise<Bittrex.Transaction[]> {
    return (await this.request('/account/getwithdrawalhistory', { currency })).map(Bittrex.TransactionConverter);
  }

  public async depositHistory(currency?: string): Promise<Bittrex.Transaction[]> {
    return (await this.request('/account/getdeposithistory', { currency })).map(Bittrex.TransactionConverter);
  }
}
