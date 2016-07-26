const nunjucks = require('nunjucks');

function nunjucksConfig () {

  const app = this;

  var env = nunjucks.configure(__dirname + '/templates', {
    autoescape: true,
    cache: false,
    express: app
  });

  // TODO: should these filters get moved to a different file than app.js?
  env.addFilter('stringify', function(str) {
    var s = JSON.stringify(str);
    return s;
  });

  env.addFilter('readableDate', function(date) {
    return date.substring(0, 10);
  });

  // TODO: This identify function is also in the scripts.js. Probably this should
  // be refactored.
  env.addFilter('convertSecToHHMMSS', function(sec) {
      // thanks to dkreuter http://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
      var totalSec = sec;

      var hours = parseInt(totalSec / 3600) % 24;
      var minutes = parseInt(totalSec / 60) % 60;
      var seconds = totalSec % 60;
      var result = '';

      if (hours > 0) {
        result += hours + ':';
      }

      if (minutes > 9) {
        result += minutes + ':';
      } else if (minutes > 0 && hours > 0) {
        result += '0' + minutes + ':';
      } else if (minutes > 0){
        result += minutes + ':';
      }

      if (seconds > 9) {
        result += seconds;
      } else if (seconds > 0 && minutes > 0) {
        result += '0' + minutes + ':';
      } else if (seconds > 0) {
        result += seconds;
      } else {
        result += '00';
      }

      return result;
  });

}

module.exports = {nunjucks: nunjucksConfig};