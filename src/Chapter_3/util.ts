import Dep from "./dep";

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

// 访问一遍所有属性，这样就将target加入属性的dep队列
export function traverse (val: Object) {
  const seenObject: Set<number> = new Set();
  _traverse(val, seenObject);
}

function _traverse (val: any, seen: Set<number>) {
  if ((!Array.isArray(val) && (typeof val !== 'object')) || Object.isFrozen(val)) {
    return;
  }

  if (val.__ob__) {
    let depId: number = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }

    seen.add(depId);
  }

  if (Array.isArray(val)) {
    let i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    let keys = Object.keys(val);
    let i = keys.length;
    while(i--) _traverse(val[keys[i]], seen);
  }
}