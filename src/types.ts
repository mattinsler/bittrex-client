declare namespace Bittrex {
  type Decimal = decimal.Decimal;
  var Decimal: decimal.IDecimalStatic;

  interface Balance {
    Currency: string;
    Balance: Decimal;
    Available: Decimal;
    Pending: Decimal;
    CryptoAddress: string | null;
    // Requested?: boolean;
    // Uuid: string | null;
  }

  interface Currency {
    Currency: string; // BTC
    CurrencyLong: string; // Bitcoin
    MinConfirmation: number;
    TxFee: Decimal;
    IsActive: boolean;
    CoinType: string; // BITCOIN
    BaseAddress: string | null;
  }

  interface DepositAddress {
    Currency: string; // VTC
		Address: string; // Vy5SKeKGXUHKS2WVpJ76HYuKAu3URastUo
  }

  interface Market {
    MarketCurrency: string; // LTC
    BaseCurrency: string; // BTC
    MarketCurrencyLong: string; // Litecoin
    BaseCurrencyLong: string; // Bitcoin
    MinTradeSize: Decimal;
    MarketName: string; // BTC-LTC
    IsActive: boolean;
    Created: Date; // 2014-02-13T00:00:00
  }

  interface MarketHistory {
    Id: number;
    TimeStamp: Date; // 2014-07-09T03:21:20.08
    Quantity: Decimal;
    Price: Decimal;
    Total: Decimal;
    FillType: 'FILL' | 'PARTIAL_FILL';
    OrderType: 'BUY' | 'SELL';
  }

  interface MarketSummary {
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
  }

  interface Order {
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
  }

  interface OrderHistoryOrder {
    OrderUuid: string; // fd97d393-e9b9-4dd1-9dbf-f288fc72a185
    Exchange: string; // BTC-LTC
    TimeStamp: Date; // 2014-07-09T04:01:00.667
    OrderType: string; // LIMIT_BUY
    Limit: Decimal; // 0.00000001
    Quantity: Decimal; // 100000.00000000
    QuantityRemaining: Decimal; // 100000.00000000
    Commission: Decimal; // 0.00000000
    Price: Decimal; // 0.00000000
    PricePerUnit: Decimal; // 0.00000000
    IsConditional: boolean; // false
    Condition: null; // null
    ConditionTarget: null; // null
    ImmediateOrCancel: boolean; // false
  }

  interface OpenOrder {
    Uuid: string | null; // null
    OrderUuid: string; // 09aa5bb6-8232-41aa-9b78-a5a1093e0211"
    Exchange: string; // BTC-LTC
    OrderType: 'LIMIT_SELL' | 'LIMIT_BUY'; // LIMIT_SELL | LIMIT_BUY
    Quantity: Decimal; // 5.00000000
    QuantityRemaining: Decimal; // 5.00000000
    Limit: Decimal; // 2.00000000
    CommissionPaid: Decimal; // 0.00000000
    Price: Decimal; // 0.00000000
    PricePerUnit: null; // null
    Opened: Date; // 2014-07-09T03:55:48.77
    Closed: null; // null
    CancelInitiated: boolean; // false
    ImmediateOrCancel: boolean; // false
    IsConditional: boolean; // false
    Condition: null; // null
    ConditionTarget: null; // null
  }

  interface OrderBookOrder {
    Quantity: Decimal;
    Rate: Decimal;
  }

  interface OrderBook {
    buy: OrderBookOrder[];
    sell: OrderBookOrder[];
  }

  interface OrderResult {
    uuid: string; // e606d53c-8d70-11e3-94b5-425861b86ab6
  }

  interface Ticker {
    Bid: Decimal;
		Ask: Decimal;
		Last: Decimal;
  }

  interface Transaction {
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
  }

  interface WithdrawalConfirmation {
    uuid: string; // 68b5a16c-92de-11e3-ba3b-425861b86ab6
  }

  interface Client {
    // public

    markets(): Promise<Market[]>;
    currencies(): Promise<Currency[]>;
    ticker(market: string): Promise<Ticker>;
    marketSummaries(): Promise<MarketSummary[]>;
    marketSummary(market: string): Promise<MarketSummary>;
    orderBook(market: string, type: 'buy' | 'sell' | 'both', depth?: number): Promise<OrderBook>;
    marketHistory(market: string): Promise<MarketHistory[]>;

    // market
    
    buyLimit(market: string, quantity: number | string | Decimal, rate: number | string | Decimal): Promise<OrderResult>;
    sellLimit(market: string, quantity: number | string | Decimal, rate: number | string | Decimal): Promise<OrderResult>;
    cancel(uuid: string): Promise<void>;
    openOrders(market: string): Promise<OpenOrder[]>;

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
