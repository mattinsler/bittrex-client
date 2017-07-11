import * as Decimal from 'decimal.js';

export function removeUndefined(obj: any) {
  const res = Object.assign({}, obj);

  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined) {
      delete obj[k];
    }
  }

  return res;
}

export function convertValues<T>(converters: { [key: string]: (value: any) => any } = {}) {
  return function(obj: any): T {
    const res = Object.assign({}, obj);

    for (const k of Object.keys(converters)) {
      if (res[k] != null) {
        res[k] = converters[k](res[k]);
      }
    }

    return res;
  };
}

export function convertArray<T>(itemConverter: (value: any) => T) {
  return function(arr: any[]) {
    return arr.map(itemConverter);
  };
}

export function toDecimal(value: number | string | Bittrex.Decimal): Bittrex.Decimal {
  if (typeof value === 'number' || typeof value === 'string') {
    return new Decimal(value);
  }
  return value;
}
