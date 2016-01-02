function Router() {

  this.get = function(url, route) {
    var re = new RegExp("/^\/" + route + "\/(.+)/");
    var match = url.match(re);
    //URL === /dawgs with no name attached 
    if (match === null) {

      console.log('Got NEW ROUTER GET');
      
    };
  };
}

var router = new Router();

module.exports = router;
