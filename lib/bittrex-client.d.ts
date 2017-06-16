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
    interface Currency {
        Currency: string;
        CurrencyLong: string;
        MinConfirmation: number;
        TxFee: Decimal;
        IsActive: boolean;
        CoinType: string;
        BaseAddress: string | null;
    }
    interface Market {
        MarketCurrency: string;
        BaseCurrency: string;
        MarketCurrencyLong: string;
        BaseCurrencyLong: string;
        MinTradeSize: Decimal;
        MarketName: string;
        IsActive: boolean;
        Created: string;
    }
    interface MarketHistory {
        Id: number;
        TimeStamp: string;
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
        TimeStamp: string;
        Bid: Decimal;
        Ask: Decimal;
        OpenBuyOrders: number;
        OpenSellOrders: number;
        PrevDay: Decimal;
        Created: string;
        DisplayMarketName: string | null;
    }
    interface OrderBookOrder {
        Quantity: Decimal;
        Rate: Decimal;
    }
    interface OrderBook {
        buy: OrderBookOrder[];
        sell: OrderBookOrder[];
    }
    interface Ticker {
        Bid: Decimal;
        Ask: Decimal;
        Last: Decimal;
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
}
