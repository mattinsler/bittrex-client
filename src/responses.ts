import * as Decimal from 'decimal.js';
import { convertArray, convertValues } from './utils';

const Convert = {
  Date: (v: string) => new Date(v),
  Decimal: (v: number | string) => new Decimal(v)
};

const convertMarketSummary = convertValues<Bittrex.MarketSummary>({
  High: Convert.Decimal,
  Low: Convert.Decimal,
  Volume: Convert.Decimal,
  Last: Convert.Decimal,
  BaseVolume: Convert.Decimal,
  TimeStamp: Convert.Date,
  Bid: Convert.Decimal,
  Ask: Convert.Decimal,
  PrevDay: Convert.Decimal,
  Created: Convert.Date
});

const convertOrderBookOrders = convertArray(convertValues<Bittrex.OrderBookOrder>({
  Quantity: Convert.Decimal,
  Rate: Convert.Decimal
}));

const convertBalance = convertValues<Bittrex.Balance>({
  Balance: Convert.Decimal,
  Available: Convert.Decimal,
  Pending: Convert.Decimal
});

const convertTransaction = convertValues<Bittrex.Transaction>({
  Amount: Convert.Decimal,
  Opened: Convert.Date,
  TxCost: Convert.Decimal
});

const convertOrderResult = convertValues<Bittrex.OrderResult>();

export const Responses = {
  // public
  markets: convertArray(convertValues<Bittrex.Market>({
    MinTradeSize: Convert.Decimal,
    Created: Convert.Date
  })),
  currencies: convertArray(convertValues<Bittrex.Currency>({
    TxFee: Convert.Decimal
  })),
  ticker: convertValues<Bittrex.Ticker>({
    Bid: Convert.Decimal,
		Ask: Convert.Decimal,
		Last: Convert.Decimal
  }),
  marketSummaries: convertArray(convertMarketSummary),
  marketSummary: convertMarketSummary,
  orderBook({ buy, sell }: any) {
    return {
      buy: convertOrderBookOrders(buy),
      sell: convertOrderBookOrders(sell)
    };
  },
  marketHistory: convertArray(convertValues<Bittrex.MarketHistory>({
    TimeStamp: Convert.Date,
    Quantity: Convert.Decimal,
    Price: Convert.Decimal,
    Total: Convert.Decimal
  })),

  // market
  buyLimit: convertOrderResult,
  sellLimit: convertOrderResult,
  cancel: convertValues<void>(),
  openOrders: convertArray(convertValues<Bittrex.OpenOrder>({
    Quantity: Convert.Decimal,
    QuantityRemaining: Convert.Decimal,
    Limit: Convert.Decimal,
    CommissionPaid: Convert.Decimal,
    Price: Convert.Decimal,
    Opened: Convert.Date
  })),

  // account
  balances: convertArray(convertBalance),
  balance: convertBalance,
  depositAddress: convertValues<Bittrex.DepositAddress>(),
  withdraw: convertValues<Bittrex.WithdrawalConfirmation>(),
  order: convertValues<Bittrex.Order>({
		Quantity: Convert.Decimal,
		QuantityRemaining: Convert.Decimal,
		Limit: Convert.Decimal,
		Reserved: Convert.Decimal,
		ReserveRemaining: Convert.Decimal,
		CommissionReserved: Convert.Decimal,
		CommissionReserveRemaining: Convert.Decimal,
		CommissionPaid: Convert.Decimal,
		Price: Convert.Decimal,
		PricePerUnit: Convert.Decimal,
		Opened: Convert.Date
  }),
  orderHistory: convertArray(convertValues<Bittrex.OrderHistoryOrder>({
    TimeStamp: Convert.Date,
    Limit: Convert.Decimal,
    Quantity: Convert.Decimal,
    QuantityRemaining: Convert.Decimal,
    Commission: Convert.Decimal,
    Price: Convert.Decimal
  })),
  withdrawalHistory: convertArray(convertTransaction),
  depositHistory: convertArray(convertTransaction)
};
