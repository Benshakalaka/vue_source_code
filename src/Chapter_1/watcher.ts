import { parsePath } from './util';
declare const window: any;

export default class Watcher {
  private vm: any;
  private getter: Function;
  private cb: Function;
  private value: any;

  constructor (vm: any, expOrFn: string, cb: Function) {
    this.vm = vm;
    this.getter = parsePath(expOrFn);
    this.cb = cb;
    this.value = this.get();
  }

  get () {
    window.target = this;
    let value = this.getter(this.vm);
    window.target = undefined;
    return value;
  }

  update () {
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }
}