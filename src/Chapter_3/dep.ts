import Watcher from './watcher';
declare const window: any;
let uid: number = 0;

export default class Dep {
  private subs: Array<Watcher> = [];
  id: number = ++uid;

  addSub (sub: Watcher) {
    let index = this.subs.indexOf(sub);
    if (index > -1) return;
    this.subs.push(sub);
  }

  removeSub (sub: Watcher) {
    let index = this.subs.indexOf(sub);
    index > -1 && this.subs.splice(index, 1);
  }

  depend () {
    if (window.target) {
      // 双向添加
      // 1. 数据改变，触发回调
      // 2. 回调取消，移除监听
      window.target.addDep(this);
    }
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update();
    }
  }
}