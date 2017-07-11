import * as Decimal from 'decimal.js';

import { toDecimal } from './utils';
import { Responses } from './responses';
import { BaseClient, ClientOptions } from './base-client';

export class BittrexClient extends BaseClient implements Bittrex.Client {
  static Decimal = Decimal;

  // public

  async markets(): Promise<Bittrex.Market[]> {
    return Responses.markets(await this.request('/public/getmarkets'));
  }

  async currencies(): Promise<Bittrex.Currency[]> {
    return Responses.currencies(await this.request('/public/getcurrencies'));
  }

  async ticker(market: string): Promise<Bittrex.Ticker> {
    return Responses.ticker(await this.request('/public/getticker', { market }));
  }

  async marketSummaries(): Promise<Bittrex.MarketSummary[]> {
    return Responses.marketSummaries(await this.request('/public/getmarketsummaries'));
  }

  async marketSummary(market: string): Promise<Bittrex.MarketSummary> {
    return Responses.marketSummary((await this.request('/public/getmarketsummary', { market }))[0]);
  }

  async orderBook(market: string, type: 'buy' | 'sell' | 'both', depth?: number): Promise<Bittrex.OrderBook> {
    return Responses.orderBook(await this.request('/public/getorderbook', { market, type, depth }));
  }

  async marketHistory(market: string): Promise<Bittrex.MarketHistory[]> {
    return Responses.marketHistory(await this.request('/account/getmarkethistory', { market }));
  }

  // market

  async buyLimit(market: string, quantity: number | string | Bittrex.Decimal, rate: number | string | Bittrex.Decimal): Promise<Bittrex.OrderResult> {
    return Responses.buyLimit(await this.request('/market/buylimit', { market, quantity: toDecimal(quantity).toString(), rate: toDecimal(rate).toString() }));
  }

  async sellLimit(market: string, quantity: number | string | Bittrex.Decimal, rate: number | string | Bittrex.Decimal): Promise<Bittrex.OrderResult> {
    return Responses.sellLimit(await this.request('/market/selllimit', { market, quantity: toDecimal(quantity).toString(), rate: toDecimal(rate).toString() }));
  }

  async cancel(uuid: string): Promise<void> {
    return Responses.cancel(await this.request('/market/cancel', { uuid }));
  }

  async openOrders(market: string): Promise<Bittrex.OpenOrder[]> {
    return Responses.openOrders(await this.request('/market/getopenorders', { market }));
  }

  // account

  async balances(): Promise<Bittrex.Balance[]> {
    return Responses.balances(await this.request('/account/getbalances'));
  }

  async balance(currency: string): Promise<Bittrex.Balance> {
    return Responses.balance(await this.request('/account/getbalance', { currency }));
  }

  async depositAddress(currency: string): Promise<Bittrex.DepositAddress> {
    return Responses.depositAddress(await this.request('/account/getdepositaddress', { currency }));
  }

  async withdraw(currency: string, quantity: number | string | Bittrex.Decimal, address: string, paymentid?: string): Promise<Bittrex.WithdrawalConfirmation> {
    return Responses.withdraw(await this.request('/account/withdraw', { currency, quantity: toDecimal(quantity).toString(), address, paymentid }));
  }

  async order(uuid: string): Promise<Bittrex.Order> {
    return Responses.order(await this.request('/account/getorder', { uuid }));
  }

  async orderHistory(market?: string): Promise<Bittrex.OrderHistoryOrder[]> {
    return Responses.orderHistory(await this.request('/account/getorderhistory', { market }));
  }

  async withdrawalHistory(currency?: string): Promise<Bittrex.Transaction[]> {
    return Responses.withdrawalHistory(await this.request('/account/getwithdrawalhistory', { currency }));
  }

  async depositHistory(currency?: string): Promise<Bittrex.Transaction[]> {
    return Responses.depositHistory(await this.request('/account/getdeposithistory', { currency }));
  }
}
