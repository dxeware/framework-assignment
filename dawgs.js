function Dawgs() {
  this.pack = [];

  this.addDawg = function(dawg) {
    this.pack.push(dawg);
  };
  this.findDawg = function(name) {
    console.log('PACK = ', this.pack);
    // var index = this.pack.findIndex(function(dawg) {
    //   return dawg.name === name;
    // });
    // return index;
    return this.pack.findIndex(function(dawg) {
      return dawg.name === name;
    });
  };
}

module.exports = Dawgs;


var num = [{num: 1},{num:2},{num:3}].findIndex(function(ele){
        return ele.num === 3;
});
