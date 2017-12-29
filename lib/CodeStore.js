function CodeStore() {
  this.list = [];
}

CodeStore.prototype.store = function(code, user, scopes, state) {
  this.list.push({ code, user, scopes, state });
};

CodeStore.prototype.get = function(code) {
  var el = null;
  var result = null;
  for (var idx = 0; idx < this.list.length; idx++) {
    el = this.list[idx];
    if (el.code !== code) { continue; }

    result = el;
    this.list.splice(idx, 1);
    break;
  }

  return result;
};

module.exports = CodeStore;
