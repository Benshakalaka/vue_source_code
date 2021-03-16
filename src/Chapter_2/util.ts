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
  let childOb: Observer = observe(value);
  let dep: Dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();
      childOb && childOb.dep.depend();
      return value;
    },
    set: function (val) {
      if (value === val) return;
      value = val;
      dep.notify();
    }
  })
}

export function observe (value: any) {
  if (typeof value !== 'object') {
    return;
  }

  let ob;
  // 避免重复监测
  // 一个对象可以被挂不同的地方好几次，可能会被Observer好几次
  if (('__ob__' in value) && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }

  return ob;
}

export function def (target: any, key: string, value: any, enumerable?: boolean) {
  Object.defineProperty(target, key, {
    value: value,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}