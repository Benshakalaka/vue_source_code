import Observer from "./observer";

const arrayProto: any = Array.prototype;
export const arrayMethods: any = Object.create(arrayProto);

[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach((methodName: string) => {
  const original = arrayProto[methodName];
  Object.defineProperty(arrayMethods, methodName, {
    value: function mutator (...args: Array<any>) {
      // do something
      const __ob__: Observer = this.__ob__;

      let inserted: any;
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        __ob__.observeArray(inserted);
      }

      __ob__.dep.notify();
      return original.apply(this, args);
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
})