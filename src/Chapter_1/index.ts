import Observer from "./observer";
import Watcher from "./watcher";

export let vm = {
  name: 'Ben'
};

new Observer(vm);
new Watcher(vm, 'name', function () {
  console.log('name change');
});