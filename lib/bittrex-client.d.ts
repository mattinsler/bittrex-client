/// <reference types="decimal.js" />
export declare namespace Bittrex {
    type Decimal = decimal.Decimal;
    interface Balance {
        Currency: string;
        Balance: Decimal;
        Available: Decimal;
        Pending: Decimal;
        CryptoAddress: string | null;
    }
    const BalanceConverter: (obj: any) => Balance;
    interface Currency {
        Currency: string;
        CurrencyLong: string;
        MinConfirmation: number;
        TxFee: Decimal;
        IsActive: boolean;
        CoinType: string;
        BaseAddress: string | null;
    }
    const CurrencyConverter: (obj: any) => Currency;
    interface DepositAddress {
        Currency: string;
        Address: string;
    }
    interface Market {
        MarketCurrency: string;
        BaseCurrency: string;
        MarketCurrencyLong: string;
        BaseCurrencyLong: string;
        MinTradeSize: Decimal;
        MarketName: string;
        IsActive: boolean;
        Created: Date;
    }
    const MarketConverter: (obj: any) => Market;
    interface MarketHistory {
        Id: number;
        TimeStamp: Date;
        Quantity: Decimal;
        Price: Decimal;
        Total: Decimal;
        FillType: 'FILL' | 'PARTIAL_FILL';
        OrderType: 'BUY' | 'SELL';
    }
    const MarketHistoryConverter: (obj: any) => MarketHistory;
    interface MarketSummary {
        MarketName: string;
        High: Decimal;
        Low: Decimal;
        Volume: Decimal;
        Last: Decimal;
        BaseVolume: Decimal;
        TimeStamp: Date;
        Bid: Decimal;
        Ask: Decimal;
        OpenBuyOrders: number;
        OpenSellOrders: number;
        PrevDay: Decimal;
        Created: Date;
        DisplayMarketName: string | null;
    }
    const MarketSummaryConverter: (obj: any) => MarketSummary;
    interface Order {
        AccountId: string | null;
        OrderUuid: string;
        Exchange: string;
        Type: string;
        Quantity: Decimal;
        QuantityRemaining: Decimal;
        Limit: Decimal;
        Reserved: Decimal;
        ReserveRemaining: Decimal;
        CommissionReserved: Decimal;
        CommissionReserveRemaining: Decimal;
        CommissionPaid: Decimal;
        Price: Decimal;
        PricePerUnit: Decimal | null;
        Opened: Date;
        Closed: null;
        IsOpen: boolean;
        Sentinel: string;
        CancelInitiated: boolean;
        ImmediateOrCancel: boolean;
        IsConditional: boolean;
        Condition: string;
        ConditionTarget: null;
    }
    const OrderConverter: (obj: any) => Order;
    interface OrderHistoryOrder {
        OrderUuid: string;
        Exchange: string;
        TimeStamp: Date;
        OrderType: string;
        Limit: Decimal;
        Quantity: Decimal;
        QuantityRemaining: Decimal;
        Commission: Decimal;
        Price: Decimal;
        PricePerUnit: null;
        IsConditional: boolean;
        Condition: null;
        ConditionTarget: null;
        ImmediateOrCancel: boolean;
    }
    const OrderHistoryOrderConverter: (obj: any) => OrderHistoryOrder;
    interface OrderBookOrder {
        Quantity: Decimal;
        Rate: Decimal;
    }
    const OrderBookOrderConverter: (obj: any) => OrderBookOrder;
    interface OrderBook {
        buy: OrderBookOrder[];
        sell: OrderBookOrder[];
    }
    interface Ticker {
        Bid: Decimal;
        Ask: Decimal;
        Last: Decimal;
    }
    const TickerConverter: (obj: any) => Ticker;
    interface Transaction {
        PaymentUuid: string;
        Currency: string;
        Amount: Decimal;
        Address: string;
        Opened: Date;
        Authorized: boolean;
        PendingPayment: boolean;
        TxCost: Decimal;
        TxId: string | null;
        Canceled: boolean;
        InvalidAddress: boolean;
    }
    const TransactionConverter: (obj: any) => Transaction;
    interface WithdrawalConfirmation {
        uuid: string;
    }
    interface Client {
        markets(): Promise<Market[]>;
        currencies(): Promise<Currency[]>;
        ticker(market: string): Promise<Ticker>;
        marketSummaries(): Promise<MarketSummary[]>;
        marketSummary(market: string): Promise<MarketSummary>;
        orderBook(market: string, type: 'buy' | 'sell' | 'both', depth?: number): Promise<OrderBook>;
        marketHistory(market: string): Promise<MarketHistory[]>;
        balances(): Promise<Balance[]>;
        balance(currency: string): Promise<Balance>;
        depositAddress(currency: string): Promise<DepositAddress>;
        withdraw(currency: string, quantity: Decimal, address: string, paymentid?: string): Promise<WithdrawalConfirmation>;
        order(uuid: string): Promise<Order>;
        orderHistory(market?: string): Promise<OrderHistoryOrder[]>;
        withdrawalHistory(currency?: string): Promise<Transaction[]>;
        depositHistory(currency?: string): Promise<Transaction[]>;
    }
}
export interface Options {
    key: string;
    secret: string;
    version?: '1.0' | '1.1';
}
export declare class Client implements Bittrex.Client {
    private opts;
    private readonly baseUrl;
    constructor({key, secret, version}?: Partial<Options>);
    private prepareRequest(pathname, data?);
    private request(pathname, data?);
    markets(): Promise<Bittrex.Market[]>;
    currencies(): Promise<Bittrex.Currency[]>;
    ticker(market: string): Promise<Bittrex.Ticker>;
    marketSummaries(): Promise<Bittrex.MarketSummary[]>;
    marketSummary(market: string): Promise<Bittrex.MarketSummary>;
    orderBook(market: string, type?: 'buy' | 'sell' | 'both', depth?: number): Promise<Bittrex.OrderBook>;
    marketHistory(market: string): Promise<Bittrex.MarketHistory[]>;
    balances(): Promise<Bittrex.Balance[]>;
    balance(currency: string): Promise<Bittrex.Balance>;
    depositAddress(currency: string): Promise<Bittrex.DepositAddress>;
    withdraw(currency: string, quantity: Bittrex.Decimal, address: string, paymentid?: string): Promise<Bittrex.WithdrawalConfirmation>;
    order(uuid: string): Promise<Bittrex.Order>;
    orderHistory(market?: string): Promise<Bittrex.OrderHistoryOrder[]>;
    withdrawalHistory(currency?: string): Promise<Bittrex.Transaction[]>;
    depositHistory(currency?: string): Promise<Bittrex.Transaction[]>;
}
