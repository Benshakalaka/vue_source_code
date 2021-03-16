import { arrayMethods } from './arrayMethods';
import Dep from './dep';
import { def, defineReactive, observe } from './util';

const hasProto: boolean = '__proto__' in {};

export default class Observer {
  // Used for <Array> type value 
  // 为什么把Array的dep放在这里呢？
  // 如果是Object的dep，他的get和set在同一个地方，那么dep只要放在那个scope就可以了
  // 但是Array的收集依赖以及触发依赖不在一个地方，这个时候想要都能访问到，那么只能放在Observer里
  public dep: Dep;

  constructor (
    private value: any
  ) {
    this.dep = new Dep();

    // 可以用来标记是否已经被Observer过
    // 可以给数组类型值提供收集依赖和触发依赖的通道
    def(value, '__ob__', this);

    if (Array.isArray(value)) {

      if (hasProto) {
        protoArgument(value, arrayMethods);
      } else {
        copyArgument(value, arrayMethods, Object.getOwnPropertyNames(value));
      }

      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  observeArray (value: any) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i]);
    }
  }

  walk (obj: any) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

function protoArgument (target: any, src: any) {
  target.__proto__ = src;
}

function copyArgument (target: any, src: any, keys: Array<any>) {
  for (let i = 0; i < keys.length; i++) {
    def(target, keys[i], src[keys[i]]);
  }
}