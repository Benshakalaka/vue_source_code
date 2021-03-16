import Dep from "./dep";
import Observer from "./observer";

const bailRe: RegExp = /[^\w.$]/;

export function parsePath (path: string) {
  if (bailRe.test(path)) {
    return (): any => (undefined);
  }

  const segments: Array<string> = path.split('.');
  return function (obj: any) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return undefined;
      obj = obj[segments[i]];
    }

    return obj;
  }
}

export function defineReactive (data: any, key: string, value: any) {
  if (typeof value === 'object') {
    new Observer(value);
  }

  let dep: Dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();
      return value;
    },
    set: function (val) {
      if (value === val) return;
      value = val;
      dep.notify();
    }
  })
}