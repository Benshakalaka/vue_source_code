import { defineReactive } from './util';

export default class Observer {
  constructor (
    private value: any
  ) {
    if (!Array.isArray(value)) {
      this.walk(value);
    }
  }

  walk (obj: any) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}