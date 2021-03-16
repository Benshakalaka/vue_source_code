import Dep from './dep';
import { parsePath, traverse } from './util';
declare const window: any;

export default class Watcher {
  private vm: any;
  private getter: Function;
  private cb: Function;
  private value: any;
  private deps: Array<Dep>;
  private depIds: Set<number>;
  private deep: boolean;

  constructor (vm: any, expOrFn: string | Function, cb: Function, options?: any) {
    this.vm = vm;
    this.deps = [];
    this.depIds = new Set();

    if (options) {
      this.deep = !!options.deep;
    } else {
      this.deep = false;
    }

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
    }
    
    this.cb = cb;
    this.value = this.get();
  }

  addDep (dep: Dep) {
    if (!this.depIds.has(dep.id)) {
      this.deps.push(dep);
      this.depIds.add(dep.id);
      dep.addSub(this);
    }
  }

  get () {
    window.target = this;
    let value = this.getter(this.vm);

    if (this.deep) {
      traverse(value);
    }
    
    window.target = undefined;
    return value;
  }

  update () {
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }

  teardown () {
    this.deps.forEach((dep: Dep) => {
      dep.removeSub(this);
    });
  }
}