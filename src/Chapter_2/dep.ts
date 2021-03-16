import Watcher from './watcher';
declare const window: any;

export default class Dep {
  private subs: Array<Watcher> = [];

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
      this.addSub(window.target);
    }
  }

  notify () {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update();
    }
  }
}