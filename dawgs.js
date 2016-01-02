'use strict';

function Dawgs(route) {
  this.route = route;
  this.pack = [];

  this.addDawg = function(dawg) {
    this.pack.push(dawg);
  };
  this.findDawg = function(name) {
    return this.pack.findIndex(dawg => (dawg.name === name));
  };
  this.updateDawg = function(dawg) {
    var index = this.findDawg(dawg.name);
    if (-1 !== index) {
      return this.pack[index] = dawg;
    } else {
      return -1;
    }
  };
  this.deleteDawg = function(name) {
    var index = this.findDawg(name);
    if (-1 !== index) {
      return this.pack.splice(index, 1);
    } else {
      return -1;
    }
  };
}

module.exports = Dawgs;
