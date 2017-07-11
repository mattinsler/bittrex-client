import * as assert from 'assert';
import * as crypto from 'crypto';
import * as qs from 'querystring';

const got = require('got');

import { removeUndefined } from './utils';

export interface ClientOptions {
  key: string;
  secret: string;
  version?: '1.0' | '1.1';
}

export class BaseClient {
  private opts: ClientOptions;
  private get baseUrl() { return `https://bittrex.com/api/v${this.opts.version}`; }

  constructor({ key, secret, version = '1.1' }: Partial<ClientOptions> = {}) {
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

  protected async request(pathname: string, data = {}): Promise<any> {
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
}
